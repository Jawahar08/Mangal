// MangalSutra 2.0: Core Application Orchestrator

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { AuthModal } from './components/auth/AuthModal';
import { RecoveryModal } from './components/auth/RecoveryModal';

import { HomeView } from './components/home/HomeView';
import { DiscoverView } from './components/discover/DiscoverView';
import { MatchesView } from './components/matches/MatchesView';
import { ChatView } from './components/chat/ChatView';
import { TrustDashboard } from './components/trust/TrustDashboard';
import { ProfileView } from './components/profile/ProfileView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { MarriageIntelligenceHub } from './components/intelligence/MarriageIntelligenceHub';

const MainRouter: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="main-content">
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'discover' && <DiscoverView />}
      {activeTab === 'matches' && <MatchesView />}
      {activeTab === 'messages' && <ChatView />}
      {activeTab === 'trust' && <TrustDashboard />}
      {activeTab === 'intelligence' && <MarriageIntelligenceHub />}
      {activeTab === 'profile' && <ProfileView />}
      {activeTab === 'roadmap' && <RoadmapView />}
      {activeTab === 'onboarding' && <OnboardingFlow />}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="page-wrapper">
        <Navbar />
        <MainRouter />
        <Footer />
        <ToastContainer />
        <AuthModal />
        <RecoveryModal />
      </div>
    </AppProvider>
  );
};

export default App;
