import { useState, useEffect } from "react";
import { 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  Brain, 
  Zap, 
  Layers, 
  Globe, 
  Cpu, 
  TrendingUp, 
  Target, 
  Users, 
  Code2, 
  FileText, 
  Trophy, 
  WifiOff,
  Sliders,
  MessageSquare
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const PitchDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const slides = [
    // --- SLIDE 1: THE HOOK ---
    {
      id: 1,
      bg: "bg-slate-950",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-mono tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE PLATFORM
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
            Low<span className="text-emerald-500">Signal</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-slate-400 font-light max-w-3xl leading-snug">
            High Impact Learning.<br />
            <span className="text-white font-medium">Zero Noise.</span>
          </p>
        </div>
      ),
    },

    // --- SLIDE 2: THE PROBLEM ---
    {
      id: 2,
      bg: "bg-white",
      text: "text-slate-900",
      content: (
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto px-4">
          <div className="space-y-8">
            <div className="p-3 bg-rose-50 w-fit rounded-xl text-rose-600">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h2 className="text-5xl font-extrabold text-slate-900 leading-tight">
              The "Signal" Problem.
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              The internet gives you infinite information but zero structure. 
              Students drown in generic videos and confusing search results.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                 <h4 className="font-bold text-slate-800 mb-1">The Context Gap</h4>
                 <p className="text-slate-600">
                   "A 10-year-old and a PhD student get the exact same Google result for 'Gravity'. That is broken."
                 </p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                 <h4 className="font-bold text-slate-800 mb-1">The Language Gap</h4>
                 <p className="text-slate-600">
                   "A student thinking in Marathi shouldn't be forced to learn Physics in English first."
                 </p>
              </div>
            </div>
          </div>

          <div className="h-[500px] bg-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
            <div className="text-center opacity-40 space-y-4">
              <Users className="w-20 h-20 mx-auto" />
              <h3 className="text-3xl font-bold">NOISE</h3>
              <p className="text-lg">Too much content. Not enough guidance.</p>
            </div>
          </div>
        </div>
      ),
    },

    // --- SLIDE 3: HIGH LEVEL SOLUTION ---
    {
      id: 3,
      bg: "bg-emerald-950",
      content: (
        <div className="text-center max-w-6xl mx-auto space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight">
              We Filter the Noise.
            </h2>
            <p className="text-2xl text-emerald-100/80 font-light max-w-3xl mx-auto">
              LowSignal is an intelligent engine that generates <span className="text-emerald-400 font-bold">Personalized Structure</span> on demand.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { icon: Layers, title: "Structured", desc: "Not random videos. Ordered, logical learning paths built just for you." },
              { icon: Target, title: "Personalized", desc: "Content adapts to your Age, Language (Hindi/Marathi/English), and Skill Level." },
              { icon: Zap, title: "Instant", desc: "Real-time doubt solving and test generation via streaming AI." }
            ].map((item, i) => (
              <div key={i} className="bg-emerald-900/40 border border-emerald-800 p-8 rounded-3xl hover:bg-emerald-900/60 transition-colors">
                 <item.icon className="w-10 h-10 text-emerald-400 mb-6" />
                 <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                 <p className="text-emerald-100/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    // --- SLIDE 4: THE ARCHITECTURE (Consolidated) ---
    {
      id: 4,
      bg: "bg-slate-950",
      content: (
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono mb-2 border border-indigo-500/30">
              <Cpu className="w-3 h-3" /> BACKEND PIPELINE
            </div>
            <h2 className="text-4xl font-bold">The <span className="text-indigo-400">Planner-Expander</span> Engine</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              We don't ask AI to "just write a course." We treat it like a software architect.
            </p>
            
            <div className="space-y-8 relative">
              {/* Connector Line */}
              <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-indigo-900/50"></div>

              {/* Step 1: Planning */}
              <div className="flex gap-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-900/50 shrink-0">1</div>
                <div>
                   <h4 className="text-xl font-bold text-white flex items-center gap-2">
                     The Planner <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Qwen-235b</span>
                   </h4>
                   <p className="text-slate-500 text-sm mt-2">
                     <b>Input:</b> "Physics, Age 12, Marathi"<br/>
                     <b>Action:</b> Designs a strict syllabus. No content yet, just the logical structure of 6-8 topics.
                   </p>
                </div>
              </div>

              {/* Step 2: Expanding */}
              <div className="flex gap-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-900/50 shrink-0">2</div>
                <div>
                   <h4 className="text-xl font-bold text-white flex items-center gap-2">
                     The Expander <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Parallel Processing</span>
                   </h4>
                   <p className="text-slate-500 text-sm mt-2">
                     <b>Action:</b> Takes the syllabus and runs <span className="text-emerald-400">8 parallel AI agents</span>. Each agent generates explanations & quizzes simultaneously.
                   </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0D1117] rounded-3xl p-6 border border-slate-800 shadow-2xl font-mono text-xs overflow-hidden relative group">
             <div className="flex gap-1.5 mb-4 opacity-50">
               <div className="w-3 h-3 rounded-full bg-red-500"/>
               <div className="w-3 h-3 rounded-full bg-yellow-500"/>
               <div className="w-3 h-3 rounded-full bg-green-500"/>
             </div>
             
             <div className="space-y-3 text-slate-400 leading-relaxed">
                <div className="text-slate-500"># low_signal_engine.py</div>
                <div>
                   <span className="text-purple-400">def</span> <span className="text-blue-400">create_course</span>(subject, age, lang):
                </div>
                
                <div className="pl-4 border-l-2 border-indigo-500/20">
                  <span className="text-slate-500"># Step 1: Structural Planning</span><br/>
                  <span className="text-white">syllabus</span> = planner.invoke({"{"} subject, age {"}"})
                </div>

                <div className="pl-4 border-l-2 border-emerald-500/20">
                  <span className="text-slate-500"># Step 2: Parallel Expansion (Batch)</span><br/>
                  <span className="text-white">full_course</span> = expander.<span className="text-yellow-400">batch</span>([<br/>
                  &nbsp;&nbsp;{"{"} <span className="text-green-400">"topic"</span>: t, <span className="text-green-400">"lang"</span>: lang {"}"} <span className="text-purple-400">for</span> t <span className="text-purple-400">in</span> syllabus<br/>
                  ])
                </div>

                <div>
                   <span className="text-purple-400">return</span> <span className="text-blue-400">Course</span>(structure=syllabus, content=full_course)
                </div>
             </div>

             <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-emerald-900/30 border border-emerald-500/30 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Processing Batch</span>
             </div>
          </div>
        </div>
      ),
    },

    // --- SLIDE 5: FEATURE - LEARNING PATHS ---
    {
      id: 5,
      bg: "bg-white",
      text: "text-slate-900",
      content: (
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="p-4 bg-emerald-100 w-fit rounded-2xl text-emerald-600">
              <Layers className="w-10 h-10" />
            </div>
            <h2 className="text-5xl font-bold text-slate-900">Personalized Learning Paths</h2>
            
            <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-emerald-500">
              <p className="text-xl text-slate-700 italic font-medium">
                "We don't search a database for 'Physics'. We build a Physics course from scratch, specifically for you, in 3 seconds."
              </p>
            </div>

            <ul className="space-y-3 pt-2">
              {[
                "Age-Adaptive: 10yo gets analogies, 20yo gets formulas.",
                "Language-Native: Generates content in Marathi/Hindi directly.",
                "Zero-Hallucination: Strictly ordered topics."
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-slate-600 font-medium items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>

            <button onClick={() => navigate('/learning-paths')} className="mt-4 text-white bg-emerald-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 hover:gap-4 transition-all shadow-lg shadow-emerald-200">
               Generate Your Path <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="relative">
            {/* INPUT UI CARD */}
            <div className="absolute -top-10 -left-10 z-20 bg-white p-5 rounded-2xl shadow-2xl border border-slate-100 w-72 animate-in slide-in-from-left-4 fade-in duration-1000">
               <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Create Path</div>
               </div>
               <div className="space-y-3">
                 <div className="space-y-1">
                   <div className="text-[10px] font-semibold text-slate-400 uppercase">Subject</div>
                   <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">Thermodynamics</div>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Age</div>
                      <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">18</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Lang</div>
                      <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">Hindi</div>
                    </div>
                 </div>
               </div>
            </div>

            {/* OUTPUT RESULT */}
            <div className="bg-slate-900 text-white p-10 pt-16 rounded-3xl shadow-2xl overflow-hidden relative">
               <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
               <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                     <span>Generated Path</span>
                     <span>Confidence: 99.8%</span>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-emerald-500/30 flex justify-between items-center group cursor-default">
                    <div>
                      <div className="text-emerald-400 text-xs font-bold mb-0.5">TOPIC 01</div>
                      <div className="font-medium text-slate-200">ऊष्मा और तापमान (Heat & Temp)</div>
                    </div>
                    <div className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] rounded font-bold">Unlocks First</div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 flex justify-between items-center opacity-60">
                    <div>
                      <div className="text-slate-500 text-xs font-bold mb-0.5">TOPIC 02</div>
                      <div className="font-medium text-slate-300">ऊष्मप्रवैगिकी का प्रथम नियम</div>
                    </div>
                    <div className="px-2 py-1 bg-slate-700 text-slate-400 text-[10px] rounded font-bold">Locked</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      ),
    },

    // --- SLIDE 6: FEATURE - DOUBT SOLVER (CORRECTED) ---
    {
      id: 6,
      bg: "bg-emerald-950",
      content: (
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="p-4 bg-emerald-900 w-fit rounded-2xl text-emerald-400">
              <Zap className="w-10 h-10" />
            </div>
            <h2 className="text-5xl font-bold text-white">Instant Doubt Solver</h2>
            
            <div className="p-6 bg-emerald-900/30 rounded-2xl border-l-4 border-emerald-400">
              <p className="text-xl text-emerald-100 italic font-medium">
                "Getting stuck on one small math step can stop your progress for days. We unblock you in 2 seconds."
              </p>
            </div>

            <p className="text-lg text-emerald-100/70">
              Our AI doesn't just "chat". It takes a specific <b>Topic</b> and your <b>Doubt</b> to give a precise, context-aware explanation.
            </p>

            <button onClick={() => navigate('/doubt-solver')} className="text-emerald-400 font-bold flex items-center gap-2 hover:gap-3 transition-all">
               Try Asking a Doubt <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* CORRECTED VISUAL: TOPIC + DOUBT INPUT */}
          <div className="relative">
             {/* INPUT FORM OVERLAY */}
             <div className="absolute -top-6 -left-10 z-20 bg-white p-5 rounded-2xl shadow-2xl border border-slate-100 w-72 animate-in slide-in-from-left-4 fade-in duration-1000">
               <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <div className="text-xs font-bold text-slate-500 uppercase">Ask a Question</div>
               </div>
               
               <div className="space-y-4">
                 <div className="space-y-1">
                   <div className="text-[10px] font-semibold text-slate-400 uppercase">Topic</div>
                   <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
                     Photosynthesis
                   </div>
                 </div>

                 <div className="space-y-1">
                   <div className="text-[10px] font-semibold text-slate-400 uppercase">Your Doubt</div>
                   <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 h-20">
                     How do plants make food at night without sun?
                   </div>
                 </div>

                 <div className="w-full py-2 bg-emerald-600 text-white text-center rounded-lg font-bold text-xs shadow-md">
                    Asking...
                 </div>
               </div>
            </div>

            {/* STREAMING RESULT */}
            <div className="bg-black text-white p-10 pt-24 rounded-3xl shadow-2xl border border-emerald-900 relative">
               <div className="absolute top-4 right-4 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded animate-pulse">
                 ● STREAMING
               </div>
               <div className="space-y-4">
                  <div className="bg-emerald-900/40 p-5 rounded-xl border border-emerald-500/30">
                     <span className="text-emerald-300 font-bold">Answer:</span><br/>
                     Great question! Plants don't actually perform photosynthesis at night. Instead, they use stored energy (starch)...
                     <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse"/>
                  </div>
               </div>
            </div>
          </div>
        </div>
      ),
    },

    // --- SLIDE 7: FEATURE - TEST GENERATOR ---
    {
      id: 7,
      bg: "bg-white",
      text: "text-slate-900",
      content: (
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="p-4 bg-orange-100 w-fit rounded-2xl text-orange-600">
              <Code2 className="w-10 h-10" />
            </div>
            <h2 className="text-5xl font-bold text-slate-900">Infinite Test Generator</h2>
            
            <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-orange-500">
              <p className="text-xl text-slate-700 italic font-medium">
                "Textbooks run out of practice questions. Our engine never does."
              </p>
            </div>

            <p className="text-lg text-slate-600">
              Generate unique quizzes on any topic instantly. Our system strictly follows data rules so you never get a broken question.
            </p>

            <button onClick={() => navigate('/test-generator')} className="text-orange-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
               Generate a Quiz <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="relative">
             {/* INPUT FORM OVERLAY */}
             <div className="absolute -top-10 -left-10 z-20 bg-white p-5 rounded-2xl shadow-2xl border border-slate-100 w-72 animate-in slide-in-from-left-4 fade-in duration-1000">
               <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Sliders className="w-4 h-4 text-orange-500" />
                  <div className="text-xs font-bold text-slate-500 uppercase">Test Config</div>
               </div>
               
               <div className="space-y-4">
                 <div className="space-y-1">
                   <div className="text-[10px] font-semibold text-slate-400 uppercase">Topic</div>
                   <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
                     Newton Laws
                   </div>
                 </div>

                 <div className="space-y-1">
                   <div className="text-[10px] font-semibold text-slate-400 uppercase">Difficulty</div>
                   <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-200">
                      <div className="flex-1 text-center py-1 text-[10px] text-slate-400">Easy</div>
                      <div className="flex-1 text-center py-1 text-[10px] bg-orange-500 text-white rounded font-bold shadow-sm">Hard</div>
                   </div>
                 </div>

                 <div className="space-y-1">
                   <div className="flex justify-between">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Questions</div>
                      <div className="text-[10px] font-bold text-orange-600">15</div>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[75%] bg-orange-500 rounded-full"></div>
                   </div>
                 </div>
               </div>
            </div>

            {/* OUTPUT RESULT */}
            <div className="bg-slate-900 text-white p-10 pt-20 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full" />
                <div className="flex justify-between items-center mb-6">
                   <h4 className="font-bold">Physics Quiz: Hard</h4>
                   <span className="bg-orange-500 text-black text-xs font-bold px-2 py-1 rounded">Generated in 1.2s</span>
                </div>
                <div className="space-y-3">
                   <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-orange-500 transition-colors cursor-pointer">
                      A. Momentum is conserved
                   </div>
                   <div className="p-4 bg-slate-800 rounded-xl border border-orange-500 transition-colors cursor-pointer relative overflow-hidden">
                      <div className="absolute inset-0 bg-orange-500/10" />
                      B. Energy is lost
                   </div>
                   <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-orange-500 transition-colors cursor-pointer">
                      C. Velocity increases
                   </div>
                </div>
            </div>
          </div>
        </div>
      ),
    },

    // --- SLIDE 8: COMING SOON ---
    {
      id: 8,
      bg: "bg-slate-950",
      content: (
        <div className="max-w-6xl mx-auto space-y-12 text-center animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">Expanding the Horizon</h2>
            <p className="text-slate-400">The roadmap to a complete education ecosystem</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 text-left">
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <FileText className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="font-bold text-lg text-white mb-2">PDF Learning</h3>
              <p className="text-sm text-slate-400">
                Upload any document. AI converts it into an interactive lesson with quizzes.
              </p>
            </div>
            
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <Trophy className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="font-bold text-lg text-white mb-2">Leaderboards</h3>
              <p className="text-sm text-slate-400">
                Gamified progress tracking to foster healthy competition among peers.
              </p>
            </div>
            
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <Users className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="font-bold text-lg text-white mb-2">Community</h3>
              <p className="text-sm text-slate-400">
                Peer-to-peer mentorship and topic-based study groups.
              </p>
            </div>

            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <WifiOff className="w-8 h-8 text-rose-400 mb-4" />
              <h3 className="font-bold text-lg text-white mb-2">Offline Mode</h3>
              <p className="text-sm text-slate-400">
                Lightweight AI models that run on-device for rural accessibility.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // --- SLIDE 9: MISSION ---
    {
      id: 9,
      bg: "bg-black",
      content: (
        <div className="text-center max-w-4xl mx-auto space-y-12 animate-in fade-in duration-1000">
           <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-slate-400 font-bold tracking-wide uppercase text-xs border border-slate-800">
                 <Globe className="w-4 h-4" /> The Vision
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
                 Democratizing <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Intelligence.</span>
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
                 We believe high-quality, structured guidance shouldn't be a luxury. 
                 By using efficient AI, we bring the best tutor in the world to every student's pocket.
              </p>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-900 pt-12">
              {[
                 { label: "Languages", val: "3+" },
                 { label: "Wait Time", val: "< 2s" },
                 { label: "Cost", val: "$0" },
                 { label: "Access", val: "100%" },
              ].map((stat, i) => (
                 <div key={i}>
                    <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                    <div className="text-xs font-mono text-slate-500 uppercase">{stat.label}</div>
                 </div>
              ))}
           </div>
        </div>
      )
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden flex flex-col selection:bg-emerald-500/30">
      
      {/* Navigation Bar */}
      <div className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <Link to="/home" className="font-bold text-xl tracking-tighter flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
          LowSignal <span className="opacity-50 font-normal">Pitch Deck</span>
        </Link>
        <div className="text-sm font-mono opacity-60">
          Slide {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Slide Content */}
      <div className={`flex-1 flex items-center justify-center p-6 md:p-12 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${slides[currentSlide].bg}`}>
        <div className="w-full animate-in zoom-in-95 duration-500 key={currentSlide}">
          {slides[currentSlide].content}
        </div>
      </div>

      {/* Controls */}
      <div className="fixed bottom-0 w-full p-6 md:p-8 flex justify-between items-end z-50 mix-blend-difference text-white">
        {/* Progress Dots */}
        <div className="flex gap-2 mb-2">
           {slides.map((_, idx) => (
             <button 
               key={idx}
               onClick={() => setCurrentSlide(idx)}
               className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"}`}
             />
           ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-4 rounded-full bg-white text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2 pr-6 disabled:opacity-50 disabled:hover:scale-100"
          >
            <span className="font-bold">Next</span> <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default PitchDeck;