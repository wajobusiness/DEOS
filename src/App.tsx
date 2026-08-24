import React, { useState, useEffect } from 'react';
import { ViewType, PlanTier } from './types';
import { useAuth } from './context/AuthContext';

// Layout Shell Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandPalette } from './components/layout/CommandPalette';
import { AuthModal } from './components/auth/AuthModal';

// Views
import { LandingPage } from './views/LandingPage';
import { OnboardingWizard } from './views/OnboardingWizard';
import { UserDashboard } from './views/UserDashboard';
import { UserStoreView } from './views/UserStoreView';
import { StoresDirectory } from './views/StoresDirectory';
import { BinaryNetwork } from './views/BinaryNetwork';
import { PartnerCenter } from './views/PartnerCenter';
import { DepositFlow } from './views/DepositFlow';
import { WalletDashboard } from './views/WalletDashboard';
import { MarketplaceHome } from './views/MarketplaceHome';
import { SellersDashboard } from './views/SellersDashboard';
import { WebsiteBuilder } from './views/WebsiteBuilder';
import { DomainIntegration } from './views/DomainIntegration';
import { AIBusinessCenter } from './views/AIBusinessCenter';
import { CRMDashboard } from './views/CRMDashboard';
import { MarketingCenter } from './views/MarketingCenter';
import { AcademyHub } from './views/AcademyHub';
import { EventsWebinars } from './views/EventsWebinars';
import { TeamManagement } from './views/TeamManagement';
import { UserSettings } from './views/UserSettings';
import { SupportCommunity } from './views/SupportCommunity';
import { AnalyticsOverview } from './views/AnalyticsOverview';
import { BackofficePortal } from './views/BackofficePortal';

export function App() {
  const { member, isAuthenticated, isLoading, signOut, updatePlan } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [targetStoreUser, setTargetStoreUser] = useState<string>('');
  const [activeReferralCode, setActiveReferralCode] = useState<string>(() => {
    try {
      return sessionStorage.getItem('eviona_active_ref') || 'EVO-ID-100245';
    } catch {
      return 'EVO-ID-100245';
    }
  });

  // Handle URL Routing (/backoffice, /stores, /store, /join, Affiliate Links, and Email Verification Callbacks)
  useEffect(() => {
    const handleUrlRouting = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;

      // Parse Query Params for ?ref=EVO-ID-... and &leg=... and ?user=...
      const rawQuery = search || (hash.includes('?') ? `?${hash.split('?')[1]}` : '');
      const urlParams = new URLSearchParams(rawQuery);
      const refParam = urlParams.get('ref');
      const legParam = urlParams.get('leg');
      const userParam = urlParams.get('user') || urlParams.get('store');

      if (refParam) {
        sessionStorage.setItem('eviona_active_ref', refParam);
        setActiveReferralCode(refParam);
        if (legParam) {
          sessionStorage.setItem('eviona_active_leg', legParam);
        }
        if (pathname.includes('/join') || hash.includes('join') || search.includes('ref=')) {
          setAuthModalMode('register');
          setIsAuthModalOpen(true);
        }
      }

      // Handle Stores Directory Route (/stores)
      if (pathname === '/stores' || hash.startsWith('#/stores')) {
        setCurrentView('stores');
        return;
      }

      // Handle Isolated Store Route (/store, /store?user=..., /s/...)
      if (pathname.startsWith('/store') || hash.startsWith('#/store') || search.includes('store') || pathname.startsWith('/s/')) {
        const storeUser = userParam || refParam || (pathname.split('/store/')[1]) || (pathname.split('/s/')[1]) || '';
        if (storeUser) {
          setTargetStoreUser(storeUser);
          sessionStorage.setItem('eviona_active_ref', storeUser);
        }
        setCurrentView('store');
        return;
      }

      // Handle Backoffice Route
      if (pathname.startsWith('/backoffice') || hash.startsWith('#/backoffice')) {
        console.log('[Eviona Router] /backoffice administrative route accessed.');
        setCurrentView('admin');
        setIsAdminMode(true);
        return;
      }

      // Handle Supabase Auth Callbacks
      if (hash.includes('access_token') || hash.includes('type=signup') || search.includes('code=')) {
        console.log('[Eviona Auth] Email verification / signup callback detected.');
        window.history.replaceState({}, document.title, window.location.pathname);
        setCurrentView('dashboard');
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, []);

  const handleNavigate = (view: ViewType) => {
    if (view === 'admin') {
      window.history.pushState(null, '', '/backoffice');
      setIsAdminMode(true);
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentView === 'admin') {
      window.history.pushState(null, '', '/');
      setIsAdminMode(false);
    }

    const publicViews: ViewType[] = ['landing', 'marketplace', 'store', 'stores'];
    if (!publicViews.includes(view) && !isAuthenticated) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAdminMode = () => {
    if (!isAdminMode) {
      handleNavigate('admin');
    } else {
      handleNavigate('dashboard');
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.history.pushState(null, '', '/');
    setCurrentView('landing');
  };

  // Loading Screen while authenticating session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A12] flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Connecting to Eviona Ecosystem...</p>
      </div>
    );
  }

  // 1. Dedicated Super Admin & Staff Portal at /backoffice
  if (currentView === 'admin') {
    return (
      <BackofficePortal
        currentUser={member}
        onNavigateToMemberOS={() => handleNavigate('dashboard')}
      />
    );
  }

  // 2. Unauthenticated Visitor Flow (Public Landing Page, Public Marketplace, Stores Directory, or Public User Store)
  if (!isAuthenticated) {
    if (currentView === 'stores') {
      return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8 max-w-7xl mx-auto">
          <StoresDirectory
            onNavigate={handleNavigate}
            onOpenStore={(slug) => {
              setTargetStoreUser(slug);
              setCurrentView('store');
            }}
          />
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            initialMode={authModalMode}
            defaultSponsorCode={activeReferralCode}
            onSuccess={() => setCurrentView('dashboard')}
          />
        </div>
      );
    }

    if (currentView === 'store') {
      return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8 max-w-7xl mx-auto">
          <UserStoreView
            isPublicDirect={true}
            targetUserSlug={targetStoreUser || activeReferralCode}
            onNavigate={handleNavigate}
          />
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            initialMode={authModalMode}
            defaultSponsorCode={activeReferralCode}
            onSuccess={() => setCurrentView('dashboard')}
          />
        </div>
      );
    }

    if (currentView === 'marketplace') {
      return (
        <>
          <MarketplaceHome onNavigate={handleNavigate} isPublicGuest={true} />
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            initialMode={authModalMode}
            defaultSponsorCode={activeReferralCode}
            onSuccess={() => {
              setCurrentView('dashboard');
            }}
          />
        </>
      );
    }

    return (
      <>
        <LandingPage
          onEnterApp={(targetView?: ViewType) => {
            if (targetView === 'marketplace') {
              setCurrentView('marketplace');
            } else if (targetView === 'store') {
              setCurrentView('store');
            } else if (targetView === 'stores') {
              setCurrentView('stores');
            } else {
              setAuthModalMode(targetView === 'onboarding' ? 'register' : 'login');
              setIsAuthModalOpen(true);
            }
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          defaultSponsorCode={activeReferralCode}
          onSuccess={() => {
            setCurrentView('dashboard');
          }}
        />
      </>
    );
  }

  // 3. Authenticated New User: Must Complete Onboarding (Plan Selection -> Wallet Payment -> Video Tour)
  if (member && member.hasCompletedOnboarding === false) {
    return (
      <OnboardingWizard
        currentUser={member}
        onComplete={async (purchasedPlan: PlanTier) => {
          await updatePlan(purchasedPlan);
          setCurrentView('dashboard');
        }}
        onCancel={handleLogout}
      />
    );
  }

  // 4. Authenticated Full Operating System Shell (User Dashboard, Store, Wallet, CRM, etc.)
  const activeMember = member || {
    id: 'EVO-ID-100245',
    memberCode: 'EVO-ID-100245',
    name: 'Entrepreneur',
    email: 'entrepreneur@evionaecosystem.com',
    phone: '',
    country: 'Global',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    plan: 'growth',
    role: 'member',
    status: 'active',
    memberSince: new Date().toLocaleDateString(),
    renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    rank: 'Member',
    nextRank: 'Director',
    walletBalance: 0.00,
    tokenBalance: 0.00,
    availableBalance: 0.00,
    binaryVolume: 0,
    activeReferrals: 0,
    hasCompletedOnboarding: true,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans antialiased">
      {/* ⌘K Global Search Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Dark Sidebar Navigation Shell */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={activeMember}
        isAdminMode={isAdminMode}
        onToggleAdminMode={handleToggleAdminMode}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Command Bar */}
        <Header
          currentUser={activeMember}
          currentView={currentView}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigate={handleNavigate}
        />

        {/* View Canvas Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <UserDashboard currentUser={activeMember} onNavigate={handleNavigate} />
          )}
          {currentView === 'store' && (
            <UserStoreView currentUser={activeMember} targetUserSlug={targetStoreUser} onNavigate={handleNavigate} />
          )}
          {currentView === 'stores' && (
            <StoresDirectory
              currentUser={activeMember}
              onNavigate={handleNavigate}
              onOpenStore={(slug) => {
                setTargetStoreUser(slug);
                setCurrentView('store');
              }}
            />
          )}
          {currentView === 'binary' && <BinaryNetwork />}
          {currentView === 'partner' && <PartnerCenter currentUser={activeMember} />}
          {currentView === 'deposit' && <DepositFlow onNavigate={handleNavigate} />}
          {currentView === 'wallet' && (
            <WalletDashboard currentUser={activeMember} onNavigate={handleNavigate} />
          )}
          {currentView === 'marketplace' && (
            <MarketplaceHome onNavigate={handleNavigate} isPublicGuest={false} currentUser={activeMember} />
          )}
          {currentView === 'sellers' && (
            <SellersDashboard
              currentUser={activeMember}
              onNavigate={handleNavigate}
              onOpenStore={(slug) => {
                setTargetStoreUser(slug);
                setCurrentView('store');
              }}
            />
          )}
          {currentView === 'builder' && <WebsiteBuilder currentUser={activeMember} onNavigate={handleNavigate} />}
          {currentView === 'domains' && <DomainIntegration />}
          {currentView === 'ai-center' && <AIBusinessCenter />}
          {currentView === 'crm' && <CRMDashboard />}
          {currentView === 'marketing' && <MarketingCenter />}
          {currentView === 'academy' && <AcademyHub />}
          {currentView === 'events' && <EventsWebinars />}
          {currentView === 'team' && <TeamManagement />}
          {currentView === 'settings' && <UserSettings currentUser={activeMember} onNavigate={handleNavigate} />}
          {currentView === 'support' && <SupportCommunity />}
          {currentView === 'analytics' && <AnalyticsOverview currentUser={activeMember} />}
        </main>
      </div>
    </div>
  );
}

export default App;
