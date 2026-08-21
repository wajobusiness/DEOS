import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Member, PlanTier } from '../types';

interface AuthContextType {
  user: User | null;
  member: Member | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (
    name: string,
    email: string,
    password: string,
    country?: string,
    sponsorCode?: string
  ) => Promise<{ success: boolean; requiresEmailConfirmation?: boolean; error?: string }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updatePlan: (plan: PlanTier) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch Member profile directly from Supabase public.Member table
  const fetchMemberProfile = async (authUser: User): Promise<Member | null> => {
    try {
      const { data, error } = await supabase
        .from('Member')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching member profile from Supabase:', error);
      }

      if (data) {
        const profile: Member = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          country: data.country || 'Global',
          avatar: data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          plan: (data.plan as PlanTier) || 'growth',
          role: data.role || 'member',
          status: data.status || 'active',
          memberSince: new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          renewalDate: data.renewalDate
            ? new Date(data.renewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          rank: data.rank || 'Member',
          nextRank: 'Director',
          walletBalance: Number(data.walletBalance || 0),
          tokenBalance: Number(data.walletBalance || 0), // Model A: 1 DEOS Coin = $1.00 USD
          availableBalance: Number(data.walletBalance || 0),
          binaryVolume: Number(data.binaryLeftVolume || 0) + Number(data.binaryRightVolume || 0),
          activeReferrals: 0,
        };
        setMember(profile);
        return profile;
      }

      // If user exists in auth.users but Member record is pending, construct profile from user_metadata
      const metaName = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Entrepreneur';
      const metaCountry = authUser.user_metadata?.country || 'Global';
      const metaMemberCode = `DEOS${Math.floor(100000 + Math.random() * 900000)}`;

      // Attempt to upsert the Member profile into Supabase
      const newMemberRow = {
        id: authUser.id,
        memberCode: metaMemberCode,
        name: metaName,
        email: authUser.email!,
        passwordHash: 'supabase_auth_managed',
        country: metaCountry,
        plan: 'growth',
        role: authUser.email?.includes('admin') ? 'super_admin' : 'member',
        status: 'active',
        rank: 'Member',
        walletBalance: 0.00,
        usdtBalance: 0.00,
        binaryLeftVolume: 0.00,
        binaryRightVolume: 0.00,
        updatedAt: new Date().toISOString(),
      };

      const { data: inserted, error: insertErr } = await supabase
        .from('Member')
        .upsert(newMemberRow)
        .select()
        .single();

      if (inserted && !insertErr) {
        const profile: Member = {
          id: inserted.id,
          name: inserted.name,
          email: inserted.email,
          phone: '',
          country: inserted.country || 'Global',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          plan: (inserted.plan as PlanTier) || 'growth',
          role: inserted.role || 'member',
          status: inserted.status || 'active',
          memberSince: new Date(inserted.createdAt).toLocaleDateString(),
          renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          rank: inserted.rank || 'Member',
          nextRank: 'Director',
          walletBalance: Number(inserted.walletBalance || 0),
          tokenBalance: Number(inserted.walletBalance || 0),
          availableBalance: Number(inserted.walletBalance || 0),
          binaryVolume: 0,
          activeReferrals: 0,
        };
        setMember(profile);
        return profile;
      }
    } catch (err) {
      console.error('Error synchronizing member profile with Supabase:', err);
    }
    return null;
  };

  // Initial session hydration & onAuthStateChange listener
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const { data: { session: activeSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Supabase getSession error:', error);
        }

        if (isMounted) {
          setSession(activeSession);
          setUser(activeSession?.user || null);
          if (activeSession?.user) {
            await fetchMemberProfile(activeSession.user);
          }
        }
      } catch (err) {
        console.error('Unexpected auth initialization error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initializeAuth();

    // Subscribe to live auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;
      console.log(`[DEOS Supabase Auth Event] ${event}`, newSession?.user?.email || 'No user');
      
      setSession(newSession);
      setUser(newSession?.user || null);

      if (newSession?.user) {
        await fetchMemberProfile(newSession.user);
      } else {
        setMember(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Production Sign Up
  const signUp = async (
    name: string,
    email: string,
    password: string,
    country?: string,
    sponsorCode?: string
  ): Promise<{ success: boolean; requiresEmailConfirmation?: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const cleanEmail = email.trim().toLowerCase();
      const code = `DEOS${Math.floor(100000 + Math.random() * 900000)}`;

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name,
            country: country || 'Global',
            sponsorCode: sponsorCode || 'DEOS100245',
            memberCode: code,
          },
        },
      });

      if (error) {
        console.error('Supabase Auth signUp failed:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create Member Record in Supabase public.Member table
        const memberPayload = {
          id: data.user.id,
          memberCode: code,
          name: name,
          email: cleanEmail,
          passwordHash: 'supabase_auth_managed',
          country: country || 'Global',
          plan: 'growth',
          role: cleanEmail.includes('admin') ? 'super_admin' : 'member',
          status: 'active',
          rank: 'Member',
          sponsorId: sponsorCode || null,
          walletBalance: 0.00,
          usdtBalance: 0.00,
          binaryLeftVolume: 0.00,
          binaryRightVolume: 0.00,
          updatedAt: new Date().toISOString(),
        };

        const { error: memberInsertError } = await supabase
          .from('Member')
          .upsert(memberPayload);

        if (memberInsertError) {
          console.warn('Member table record creation notice:', memberInsertError);
        }

        // Create MemberSite Record (Dynamic Subdomain)
        try {
          await supabase.from('MemberSite').upsert({
            id: `site_${data.user.id}`,
            memberId: data.user.id,
            subdomain: code.toLowerCase(),
            dnsStatus: 'active',
            sslStatus: 'active',
            updatedAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('MemberSite insert notice:', e);
        }

        // Create Initial Ledger Audit Row
        try {
          await supabase.from('LedgerTransaction').insert({
            id: `txn_${Date.now()}`,
            memberId: data.user.id,
            type: 'coin_deposit',
            amount: 0.00,
            currency: 'DEOS',
            description: 'Wallet initialized on account registration',
            status: 'Completed',
            referenceId: code,
          });
        } catch (e) {
          console.warn('LedgerTransaction insert notice:', e);
        }

        // Check if email confirmation is required
        if (!data.session) {
          return {
            success: true,
            requiresEmailConfirmation: true,
          };
        }

        setUser(data.user);
        setSession(data.session);
        await fetchMemberProfile(data.user);
        return { success: true, requiresEmailConfirmation: false };
      }

      return { success: false, error: 'User creation failed on Supabase backend.' };
    } catch (err: any) {
      console.error('Unexpected error during signUp:', err);
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Production Sign In
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const cleanEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        console.error('Supabase Auth signIn failed:', error);
        return { success: false, error: error.message };
      }

      if (data.user && data.session) {
        setUser(data.user);
        setSession(data.session);
        await fetchMemberProfile(data.user);
        return { success: true };
      }

      return { success: false, error: 'Login failed: no active session returned from Supabase.' };
    } catch (err: any) {
      console.error('Unexpected error during signIn:', err);
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Production Sign Out
  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
      }
      setUser(null);
      setSession(null);
      setMember(null);
    } catch (err) {
      console.error('Unexpected error during signOut:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update Plan Tier
  const updatePlan = async (plan: PlanTier) => {
    if (user && member) {
      try {
        await supabase
          .from('Member')
          .update({ plan, updatedAt: new Date().toISOString() })
          .eq('id', user.id);
        
        setMember((prev) => (prev ? { ...prev, plan } : null));
      } catch (err) {
        console.error('Error updating member plan:', err);
      }
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchMemberProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        member,
        session,
        isLoading,
        isAuthenticated: Boolean(session && user && member),
        signUp,
        signIn,
        signOut,
        updatePlan,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
