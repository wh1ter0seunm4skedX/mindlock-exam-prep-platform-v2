import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Dashboard from '@/pages/Dashboard';
import Questions from '@/pages/Questions';
import Study from '@/pages/Study';
import Admin from '@/pages/Admin';
import Exam from '@/pages/Exam';
import '@/lib/firebase'; // Import Firebase initialization

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/study/:questionId" element={<Study />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/exam" element={<Exam />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
