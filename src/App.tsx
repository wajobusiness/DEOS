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
import { SuperAdminPanel } from './views/SuperAdminPanel';

export function App() {
  const { member, isAuthenticated, isLoading, signOut, updatePlan } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Handle Supabase Email Verification Callback in URL
  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash.includes('access_token') || hash.includes('type=signup') || search.includes('code=')) {
      console.log('[DEOS Auth] Email verification / signup callback detected.');
      window.history.replaceState({}, document.title, window.location.pathname);
      setCurrentView('dashboard');
    }
  }, []);

  const handleNavigate = (view: ViewType) => {
    const publicViews: ViewType[] = ['landing', 'marketplace'];
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
      setIsAdminMode(true);
      setCurrentView('admin');
    } else {
      setIsAdminMode(false);
      setCurrentView('dashboard');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentView('landing');
  };

  // Loading Screen while authenticating session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A12] flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Connecting to DEOS Platform...</p>
      </div>
    );
  }

  // 1. Unauthenticated Visitor Flow (Public Landing Page or Public Marketplace)
  if (!isAuthenticated) {
    if (currentView === 'marketplace') {
      return (
        <>
          <MarketplaceHome onNavigate={handleNavigate} isPublicGuest={true} />
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            initialMode={authModalMode}
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
          onSuccess={() => {
            setCurrentView('dashboard');
          }}
        />
      </>
    );
  }

  // 2. Authenticated New User: Must Complete Onboarding (Plan Selection -> Wallet Payment -> Video Tour)
  // At this point, the user does not have access to the full user dashboard
  if (member && member.hasCompletedOnboarding === false) {
    return (
      <OnboardingWizard
        currentUser={member}
        onComplete={(purchasedPlan: PlanTier) => {
          updatePlan(purchasedPlan);
          setCurrentView('dashboard');
        }}
        onCancel={handleLogout}
      />
    );
  }

  // 3. Authenticated Full Operating System Shell (User Dashboard, Wallet, CRM, etc.)
  const activeMember = member || {
    id: 'DEOS_ACTIVE',
    name: 'Entrepreneur',
    email: 'entrepreneur@deos.com',
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
          {currentView === 'binary' && <BinaryNetwork />}
          {currentView === 'partner' && <PartnerCenter currentUser={activeMember} />}
          {currentView === 'deposit' && <DepositFlow onNavigate={handleNavigate} />}
          {currentView === 'wallet' && (
            <WalletDashboard currentUser={activeMember} onNavigate={handleNavigate} />
          )}
          {currentView === 'marketplace' && (
            <MarketplaceHome onNavigate={handleNavigate} isPublicGuest={false} />
          )}
          {currentView === 'sellers' && <SellersDashboard />}
          {currentView === 'builder' && <WebsiteBuilder />}
          {currentView === 'domains' && <DomainIntegration />}
          {currentView === 'ai-center' && <AIBusinessCenter />}
          {currentView === 'crm' && <CRMDashboard />}
          {currentView === 'marketing' && <MarketingCenter />}
          {currentView === 'academy' && <AcademyHub />}
          {currentView === 'events' && <EventsWebinars />}
          {currentView === 'team' && <TeamManagement />}
          {currentView === 'settings' && <UserSettings currentUser={activeMember} />}
          {currentView === 'support' && <SupportCommunity />}
          {currentView === 'analytics' && <AnalyticsOverview />}
          {currentView === 'admin' && <SuperAdminPanel />}
        </main>
      </div>
    </div>
  );
}

export default App;
