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
  const [currentView, setCurrentView] = useState<ViewType>('landing');
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

  // When user successfully authenticates, transition from landing to dashboard
  useEffect(() => {
    if (isAuthenticated && currentView === 'landing') {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated]);

  const handleNavigate = (view: ViewType) => {
    // Check if the requested view is protected and user is not authenticated
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

  // Loading Screen while authenticating session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A12] flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Connecting to DEOS Production Backend...</p>
      </div>
    );
  }

  // Public Landing page
  if (currentView === 'landing' || (!isAuthenticated && currentView !== 'marketplace')) {
    return (
      <>
        <LandingPage
          onEnterApp={(targetView?: ViewType) => {
            if (targetView === 'marketplace') {
              setCurrentView('marketplace');
            } else if (!isAuthenticated) {
              setAuthModalMode(targetView === 'onboarding' ? 'register' : 'login');
              setIsAuthModalOpen(true);
            } else {
              setCurrentView(targetView || 'dashboard');
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

  // Onboarding Wizard sequence (Authenticated)
  if (currentView === 'onboarding') {
    return (
      <OnboardingWizard
        onComplete={(purchasedPlan: PlanTier) => {
          updatePlan(purchasedPlan);
          setCurrentView('dashboard');
        }}
        onCancel={() => {
          setCurrentView('dashboard');
        }}
      />
    );
  }

  // Fallback guard: member must be present in authenticated shell
  if (!member) {
    return (
      <LandingPage
        onEnterApp={() => {
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        }}
      />
    );
  }

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
        currentUser={member}
        isAdminMode={isAdminMode}
        onToggleAdminMode={handleToggleAdminMode}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Command Bar */}
        <Header
          currentUser={member}
          currentView={currentView}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigate={handleNavigate}
        />

        {/* View Canvas Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <UserDashboard currentUser={member} onNavigate={handleNavigate} />
          )}
          {currentView === 'binary' && <BinaryNetwork />}
          {currentView === 'partner' && <PartnerCenter currentUser={member} />}
          {currentView === 'deposit' && <DepositFlow onNavigate={handleNavigate} />}
          {currentView === 'wallet' && (
            <WalletDashboard currentUser={member} onNavigate={handleNavigate} />
          )}
          {currentView === 'marketplace' && (
            <MarketplaceHome onNavigate={handleNavigate} />
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
          {currentView === 'settings' && <UserSettings currentUser={member} />}
          {currentView === 'support' && <SupportCommunity />}
          {currentView === 'analytics' && <AnalyticsOverview />}
          {currentView === 'admin' && <SuperAdminPanel />}
        </main>
      </div>
    </div>
  );
}

export default App;
