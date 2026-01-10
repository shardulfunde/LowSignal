import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Loader2, BookOpen, ChevronDown, ChevronRight, CheckCircle2 } from "lucide-react";

interface StoredTopic {
  name: string;
  explanation: string;
  questions: any[];
}

interface StoredPath {
  id: string;
  subject: string;
  age: number;
  language: string;
  topics: StoredTopic[];
  timestamp: any;
}

const SavedLearningPath = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState<StoredPath | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(0);

  useEffect(() => {
    const fetchPath = async () => {
      if (!currentUser?.uid || !id) return;
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          const paths = data.learningPaths || [];
          const foundPath = paths.find((p: any) => p.id === id);
          
          if (foundPath) {
            setPath(foundPath);
          } else {
            console.error("Path not found");
          }
        }
      } catch (error) {
        console.error("Error fetching path:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, [currentUser, id]);

  const toggleTopic = (idx: number) => {
    setExpandedTopic(expandedTopic === idx ? null : idx);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-lg font-semibold text-slate-800">Learning Path Not Found</p>
        <button onClick={() => navigate("/profile")} className="text-primary hover:underline">
          Back to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <TopBar 
        language="EN" 
        isOnline={navigator.onLine} 
        title={path.subject || "Learning Path"} 
        showBack 
      />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Header Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-primary/10 rounded-lg">
               <BookOpen className="w-6 h-6 text-primary" />
             </div>
             <div>
               <h1 className="text-xl font-bold text-slate-900">{path.subject}</h1>
               <p className="text-sm text-slate-500">
                 Generated on {new Date(path.timestamp?.seconds * 1000).toLocaleDateString()}
               </p>
             </div>
           </div>
           
           <div className="flex gap-4 mt-4 text-sm text-slate-600">
              <div className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                Age: {path.age}
              </div>
              <div className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                Language: {path.language}
              </div>
              <div className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                Topics: {path.topics?.length || 0}
              </div>
           </div>
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {path.topics?.map((topic, idx) => {
            const isExpanded = expandedTopic === idx;
            const hasContent = topic.explanation || (topic.questions && topic.questions.length > 0);

            return (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <button 
                  onClick={() => toggleTopic(idx)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-semibold text-sm border border-slate-200">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{topic.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     {hasContent ? (
                       <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full border border-green-200">
                         Saved
                       </span>
                     ) : (
                        <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200">
                         Pending
                       </span>
                     )}
                     {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                    {hasContent ? (
                      <div className="space-y-6">
                        {topic.explanation && (
                          <div>
                            <h4 className="font-semibold text-slate-700 mb-2">Explanation</h4>
                            <div className="text-slate-600 leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-xl border border-slate-200">
                              {topic.explanation}
                            </div>
                          </div>
                        )}

                        {topic.questions && topic.questions.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-slate-700 mb-2">Practice Questions</h4>
                            <div className="space-y-3">
                              {topic.questions.map((q: any, qIdx: number) => (
                                <div key={qIdx} className="bg-white p-4 rounded-xl border border-slate-200">
                                  <p className="font-medium text-slate-800 mb-2">{qIdx + 1}. {q.question}</p>
                                  <ul className="space-y-1.5 ml-4 list-disc text-slate-600">
                                    {q.options?.map((opt: string, optIdx: number) => (
                                      <li key={optIdx} className={optIdx === q.correct_index ? "text-green-600 font-medium" : ""}>
                                        {opt}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-500">
                        <p>No content saved for this topic yet.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </main>

      <BottomNav />
    </div>
  );
};

export default SavedLearningPath;
