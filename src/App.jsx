import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import AppLayout from '@/components/layout/AppLayout';
import HomeFeed from '@/pages/HomeFeed';
import ReportEditor from '@/pages/ReportEditor';
import AnalystDashboard from '@/pages/AnalystDashboard';
import ReportView from '@/pages/ReportView';
import PaymentPage from '@/pages/PaymentPage';
import AboutPage from '@/pages/AboutPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import CalculationsPage from '@/pages/CalculationsPage';
import EditProfilePage from '@/pages/EditProfilePage';
import AnalyticsPage from '@/pages/AnalyticsPage';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/editor" element={<ReportEditor />} />
        <Route path="/dashboard" element={<AnalystDashboard />} />
        <Route path="/report" element={<ReportView />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/calculations" element={<CalculationsPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>
      <Route path="/pay" element={<PaymentPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App