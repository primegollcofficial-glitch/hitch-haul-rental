import React, { useState } from 'react';
import { NavTab } from './types';
import { DataProvider } from './DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { FleetView } from './components/FleetView';
import { BookingView } from './components/BookingView';
import { ReturnVideoView } from './components/ReturnVideoView';
import { AboutView } from './components/AboutView';
import { TestimonialsView } from './components/TestimonialsView';
import { AreasView } from './components/AreasView';
import { FaqView } from './components/FaqView';
import { ContactView } from './components/ContactView';
import { AdminView } from './components/AdminView';
import { SpecsModal } from './components/SpecsModal';
import { TermsModal } from './components/TermsModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedTrailerId, setSelectedTrailerId] = useState<string>('');
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);

  // Sync tab navigation and scroll to top
  const handleNavigate = (tab: NavTab) => {
    setActiveTab(tab);
  };

  const handleSelectTrailer = (trailerId: string) => {
    setSelectedTrailerId(trailerId);
  };

  return (
    <DataProvider>
      <div className="min-h-screen bg-[#121414] text-[#e2e2e2] flex flex-col font-sans overflow-x-hidden selection:bg-[#ff6b00] selection:text-black">
        {/* Top Navbar */}
        <Navbar activeTab={activeTab} onNavigate={handleNavigate} />

        {/* Main Content Area */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <HomeView
              onNavigate={handleNavigate}
              onSelectTrailer={handleSelectTrailer}
            />
          )}

          {(activeTab === 'fleet' || activeTab === 'rates') && (
            <FleetView
              onNavigate={handleNavigate}
              onSelectTrailer={handleSelectTrailer}
              onOpenSpecs={() => setIsSpecsOpen(true)}
            />
          )}

          {activeTab === 'areas' && (
            <AreasView onNavigate={handleNavigate} />
          )}

          {activeTab === 'booking' && (
            <BookingView
              selectedTrailerId={selectedTrailerId}
              onNavigate={handleNavigate}
              onSelectTrailer={handleSelectTrailer}
            />
          )}

          {activeTab === 'return' && (
            <ReturnVideoView onNavigate={handleNavigate} />
          )}

          {activeTab === 'about' && (
            <AboutView onNavigate={handleNavigate} />
          )}

          {activeTab === 'testimonials' && (
            <TestimonialsView
              onNavigate={handleNavigate}
              onSelectTrailer={handleSelectTrailer}
            />
          )}

          {activeTab === 'faq' && (
            <FaqView
              onNavigate={handleNavigate}
              onOpenSpecs={() => setIsSpecsOpen(true)}
            />
          )}

          {activeTab === 'contact' && (
            <ContactView onNavigate={handleNavigate} />
          )}

          {activeTab === 'admin' && (
            <AdminView />
          )}
        </main>

        {/* Footer */}
        <Footer
          onNavigate={handleNavigate}
          onOpenSpecs={() => setIsSpecsOpen(true)}
          onOpenTerms={() => setIsTermsOpen(true)}
        />

        {/* Technical Specifications Modal */}
        <SpecsModal
          isOpen={isSpecsOpen}
          onClose={() => setIsSpecsOpen(false)}
        />

        {/* Rental Terms & Conditions Modal */}
        <TermsModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
        />
      </div>
    </DataProvider>
  );
};

export default App;
