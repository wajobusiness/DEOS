import React, { useState } from 'react';
import { ViewType, PlanTier } from './types';
import { useAuth } from './context/AuthContext';
import { currentUser as defaultMockUser } from './store/mockData';

// Layout Shell Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandPalette } from './components/layout/CommandPalette';

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
  const { member, isAuthenticated, signOut, updatePlan } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Active user profile (authenticated Supabase member or fallback template)
  const activeUser = member || defaultMockUser;

  const handleNavigate = (view: ViewType) => {
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

  // If user is viewing the Public Landing page (Screen 18)
  if (currentView === 'landing') {
    return (
      <LandingPage
        onEnterApp={(targetView?: ViewType) => {
          setCurrentView(targetView || 'dashboard');
        }}
      />
    );
  }

  // If user is in the revised Onboarding Wizard sequence (Book 2 & 17)
  if (currentView === 'onboarding') {
    return (
      <OnboardingWizard
        onComplete={(purchasedPlan: PlanTier) => {
          updatePlan(purchasedPlan);
          setCurrentView('dashboard');
        }}
        onCancel={() => {
          setCurrentView('landing');
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
        currentUser={activeUser}
        isAdminMode={isAdminMode}
        onToggleAdminMode={handleToggleAdminMode}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Command Bar */}
        <Header
          currentUser={activeUser}
          currentView={currentView}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigate={handleNavigate}
        />

        {/* View Canvas Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <UserDashboard currentUser={activeUser} onNavigate={handleNavigate} />
          )}
          {currentView === 'binary' && <BinaryNetwork />}
          {currentView === 'partner' && <PartnerCenter currentUser={activeUser} />}
          {currentView === 'deposit' && <DepositFlow onNavigate={handleNavigate} />}
          {currentView === 'wallet' && (
            <WalletDashboard currentUser={activeUser} onNavigate={handleNavigate} />
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
          {currentView === 'settings' && <UserSettings currentUser={activeUser} />}
          {currentView === 'support' && <SupportCommunity />}
          {currentView === 'analytics' && <AnalyticsOverview />}
          {currentView === 'admin' && <SuperAdminPanel />}
        </main>
      </div>
    </div>
  );
}

export default App;
