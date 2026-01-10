import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Home from "./pages/Home";
import LearningPaths from "./pages/LearningPaths";
import LearningTopicPage from "./pages/LearningTopicPage";
import DoubtSolver from "./pages/DoubtSolver";
import PDFLearning from "./pages/PDFLearning";
import AIStudyChat from "./pages/AIStudyChat";
import TestGenerator from "./pages/TestGenerator";
import Leaderboard from "./pages/Leaderboard";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import PitchDeck from "./pages/PitchDeck";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning-paths"
              element={
                <ProtectedRoute>
                  <LearningPaths />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning-paths/:id"
              element={
                <ProtectedRoute>
                  <LearningPaths />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning/topic"
              element={
                <ProtectedRoute>
                  <LearningTopicPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doubt-solver"
              element={
                <ProtectedRoute>
                  <DoubtSolver />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pdf-learning"
              element={
                <ProtectedRoute>
                  <PDFLearning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/study-chat"
              element={
                <ProtectedRoute>
                  <AIStudyChat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test-generator"
              element={
                <ProtectedRoute>
                  <TestGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/pitch-deck" element={<PitchDeck />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
