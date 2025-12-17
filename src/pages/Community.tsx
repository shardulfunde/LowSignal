import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, MessageSquare, Plus } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import MentorCard from "@/components/MentorCard";
import CommunityQuestion from "@/components/CommunityQuestion";
import { Button } from "@/components/ui/button";

const mentors = [
  {
    name: "Priya Sharma",
    subject: "Mathematics",
    availability: "Mon-Fri, 4-7 PM",
    rating: 4.8,
    studentsHelped: 234,
    avatarInitial: "P",
  },
  {
    name: "Rahul Patil",
    subject: "Science & Physics",
    availability: "Daily, 5-8 PM",
    rating: 4.9,
    studentsHelped: 189,
    avatarInitial: "R",
  },
  {
    name: "Sunita Devi",
    subject: "English & Hindi",
    availability: "Sat-Sun, All day",
    rating: 4.7,
    studentsHelped: 156,
    avatarInitial: "S",
  },
];

const questions = [
  {
    question: "Can someone explain how photosynthesis works in simple words? My textbook is too complicated.",
    author: "Ankit",
    village: "Rampur",
    upvotes: 12,
    replies: 5,
    timeAgo: "2 hours ago",
    subject: "Science",
  },
  {
    question: "What is the difference between 'their', 'there', and 'they're'? I always get confused.",
    author: "Meera",
    village: "Chandapur",
    upvotes: 8,
    replies: 3,
    timeAgo: "5 hours ago",
    subject: "English",
  },
  {
    question: "How do I solve this: If a train travels 60 km in 1 hour, how long to travel 150 km?",
    author: "Ravi",
    village: "Karjat",
    upvotes: 15,
    replies: 7,
    timeAgo: "1 day ago",
    subject: "Math",
  },
];

const Community = () => {
  const { language, t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeTab, setActiveTab] = useState<"mentors" | "questions">("mentors");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getLanguageLabel = () => {
    if (language === "hi") return "हिंदी";
    if (language === "mr") return "मराठी";
    return "EN";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar language={getLanguageLabel()} isOnline={isOnline} showBack title={t('community.title')} />

      {/* Tabs */}
      <div className="sticky top-[60px] z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab("mentors")}
              className={`flex-1 py-3 flex items-center justify-center gap-2 font-semibold transition-colors border-b-2 ${activeTab === "mentors"
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent"
                }`}
            >
              <Users className="w-5 h-5" />
              {t('community.tabs.mentors')}
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`flex-1 py-3 flex items-center justify-center gap-2 font-semibold transition-colors border-b-2 ${activeTab === "questions"
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent"
                }`}
            >
              <MessageSquare className="w-5 h-5" />
              {t('community.tabs.questions')}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6">
        {activeTab === "mentors" ? (
          <>
            <p className="text-muted-foreground mb-4">
              {t('community.mentorsDesc')}
            </p>
            <div className="space-y-4">
              {mentors.map((mentor, index) => (
                <MentorCard
                  key={index}
                  name={mentor.name}
                  subject={mentor.subject}
                  availability={mentor.availability}
                  rating={mentor.rating}
                  studentsHelped={mentor.studentsHelped}
                  avatarInitial={mentor.avatarInitial}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">{t('community.questionsDesc')}</p>
            </div>
            <Button className="w-full mb-4">
              <Plus className="w-5 h-5 mr-2" />
              {t('community.askQuestion')}
            </Button>
            <div className="space-y-4">
              {questions.map((q, index) => (
                <CommunityQuestion
                  key={index}
                  question={q.question}
                  author={q.author}
                  village={q.village}
                  upvotes={q.upvotes}
                  replies={q.replies}
                  timeAgo={q.timeAgo}
                  subject={q.subject}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Community;
