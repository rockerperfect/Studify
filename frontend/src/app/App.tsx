import React, { useState, useEffect } from 'react';
import { LoginPage } from '../features/auth/LoginPage';
import { DashboardView } from '../features/dashboard/DashboardView';
import { LibraryView } from '../features/library/LibraryView';
import { AnalyzeView } from '../features/analyze/AnalyzeView';
import { PlannerView } from '../features/planner/PlannerView';
import { QuizView } from '../features/quiz/QuizView';
import { CalendarView } from '../features/planner/CalendarView';
import { SettingsView } from '../features/settings/SettingsView';
import { Sidebar, MobileNav } from '../components/layout/Sidebar';
import { AnalysisModal } from '../features/analyze/components/AnalysisModal';
import { Toast, useToast } from '../components/feedback/Toast';
import { TeacherInbox } from '../features/prs/TeacherInbox';
import { AdminDashboard } from '../features/admin/AdminDashboard';
import { getAllUploadedFiles } from '../services/fileUploadService';
import { useAuth } from '../context/AuthContext';

export default function App() {
  const { user, sessionReady } = useAuth();
  const isSignedIn = !!user;

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [analyzingResourceId, setAnalyzingResourceId] = useState<string | null>(null);
  const { toast, showToast, hideToast } = useToast();

  // Always use dark theme
  useEffect(() => {
    document.body.classList.remove('light-theme');
  }, []);

  const handleLoginSuccess = () => {
    setActiveView('dashboard');
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const handleAnalyze = (id: string) => {
    setAnalyzingResourceId(id);
  };

  const handleAddToPlan = (_id: string) => {
    showToast('Material added to study plan', 'success');
  };

  const handleAnalysisComplete = (_result: any) => {
    showToast('Analysis complete! Material added to library.', 'success');
    setAnalyzingResourceId(null);
  };

  // Wait for session check to avoid a flash between login ↔ app
  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#9B7CFF]/30 border-t-[#9B7CFF] rounded-full animate-spin" />
      </div>
    );
  }

  // Not signed in → go straight to Login/Register page
  if (!isSignedIn) {
    return <LoginPage onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Sidebar — Desktop */}
        <Sidebar activeView={activeView} onViewChange={handleViewChange} />

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 overflow-x-hidden">
          <div className="max-w-[1320px] mx-auto w-full">
            {activeView === 'dashboard' && <DashboardView onNavigate={handleViewChange} />}
            {activeView === 'library'   && <LibraryView onAnalyze={handleAnalyze} onAddToPlan={handleAddToPlan} />}
            {activeView === 'analyze'   && <AnalyzeView />}
            {activeView === 'planner'   && <PlannerView />}
            {activeView === 'quiz'      && <QuizView />}
            {activeView === 'calendar'  && <CalendarView />}
            {activeView === 'settings'  && <SettingsView />}
            {activeView === 'inbox'     && <TeacherInbox />}
            {activeView === 'admin'     && <AdminDashboard />}
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav activeView={activeView} onViewChange={handleViewChange} />
      </div>

      {/* Analysis Modal */}
      <AnalysisModal
        isOpen={analyzingResourceId !== null}
        onClose={() => setAnalyzingResourceId(null)}
        fileName={`Resource ${analyzingResourceId}`}
        onComplete={handleAnalysisComplete}
        fileMetadata={analyzingResourceId ? (() => {
          const files = getAllUploadedFiles();
          return files.find(f => f.id === analyzingResourceId)?.metadata;
        })() : undefined}
      />

      {/* Toast */}
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
    </div>
  );
}
