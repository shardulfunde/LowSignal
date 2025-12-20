import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Onboarding from "./pages/Onboarding";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/learning-paths" element={<LearningPaths />} />
            <Route path="/learning-paths/:id" element={<LearningPaths />} />
            <Route path="/learning/topic" element={<LearningTopicPage />} />
            <Route path="/doubt-solver" element={<DoubtSolver />} />
            <Route path="/pdf-learning" element={<PDFLearning />} />
            <Route path="/study-chat" element={<AIStudyChat />} />
            <Route path="/test-generator" element={<TestGenerator />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/about" element={<About />} />
            <Route path="/pitch-deck" element={<PitchDeck />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
