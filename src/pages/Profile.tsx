import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, MapPin, School, Calendar, Mail, Save, Loader2, Edit2, X, BookOpen, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  age: number | "";
  institution: string;
  location: string;
  email: string;
  displayName: string;
}

interface StoredItem {
  id?: string;
  topic?: string;
  subject?: string;
  timestamp?: any;
  [key: string]: any;
}

const Profile = () => {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const [formData, setFormData] = useState<UserProfile>({
    age: "",
    institution: "",
    location: "",
    email: currentUser?.email || "",
    displayName: currentUser?.displayName || "",
  });

  const [learningPaths, setLearningPaths] = useState<StoredItem[]>([]);
  const [tests, setTests] = useState<StoredItem[]>([]);

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

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.uid) return;
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setFormData({
            age: data.age || "",
            institution: data.institution || "",
            location: data.location || "",
            email: currentUser.email || "",
            displayName: currentUser.displayName || "",
          });
          setLearningPaths(data.learningPaths || []);
          setTests(data.tests || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? (value ? Number(value) : "") : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.uid) return;
    
    setSaving(true);
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        age: formData.age === "" ? null : Number(formData.age),
        institution: formData.institution,
        location: formData.location,
        updatedAt: new Date()
      });
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
        toast({
            title: "Error",
            description: "Failed to update profile",
            variant: "destructive",
        });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <TopBar 
        language={language === 'hi' ? 'हिंदी' : language === 'mr' ? 'मराठी' : 'EN'} 
        isOnline={isOnline} 
        title="My Profile" 
        showBack 
      />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 overflow-hidden mb-4 border-2 border-primary/20">
            {currentUser?.photoURL ? (
                <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-primary text-2xl font-bold">
                {currentUser?.displayName?.charAt(0) || "U"}
                </div>
            )}
            </div>
            <h2 className="text-xl font-bold">{currentUser?.displayName}</h2>
            <p className="text-muted-foreground">{currentUser?.email}</p>
        </div>

        {/* User Stats/Data Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">Personal Details</h3>
            {!isEditing && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="text-primary hover:text-primary/80 hover:bg-primary/5"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          {isEditing ? (
             <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700">Display Name</label>
                 <div className="relative">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input
                     type="text"
                     value={formData.displayName}
                     disabled
                     className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700">Email</label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input
                     type="email"
                     value={formData.email}
                     disabled
                     className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700">Age</label>
                 <div className="relative">
                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input
                     type="number"
                     name="age"
                     value={formData.age}
                     onChange={handleChange}
                     placeholder="Enter your age"
                     className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700">College / School</label>
                 <div className="relative">
                   <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input
                     type="text"
                     name="institution"
                     value={formData.institution}
                     onChange={handleChange}
                     placeholder="School or College name"
                     className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700">City / Village</label>
                 <div className="relative">
                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input
                     type="text"
                     name="location"
                     value={formData.location}
                     onChange={handleChange}
                     placeholder="Your city or village"
                     className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                   />
                 </div>
               </div>

               <div className="flex gap-3 pt-2">
                 <Button 
                   type="button" 
                   variant="outline" 
                   className="flex-1"
                   onClick={() => setIsEditing(false)}
                 >
                   <X className="w-4 h-4 mr-2" />
                   Cancel
                 </Button>
                 <Button 
                   type="submit" 
                   className="flex-1" 
                   disabled={saving}
                 >
                   {saving ? (
                     <>
                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                       Saving...
                     </>
                   ) : (
                     <>
                       <Save className="w-4 h-4 mr-2" />
                       Save
                     </>
                   )}
                 </Button>
               </div>
             </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium mb-1">Age</p>
                  <p className="font-semibold text-slate-900">{formData.age || "Not set"}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium mb-1">Location</p>
                  <p className="font-semibold text-slate-900">{formData.location || "Not set"}</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 font-medium mb-1">Institution</p>
                <div className="flex items-center gap-2">
                  <School className="w-4 h-4 text-slate-400" />
                  <p className="font-semibold text-slate-900">{formData.institution || "Not set"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Learning Paths List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-slate-800">Learning Paths</h3>
          </div>
          
          {learningPaths.length > 0 ? (
            <div className="space-y-3">
              {learningPaths.map((path, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                  <p className="font-semibold text-slate-800">{path.subject || path.topic || `Path #${idx + 1}`}</p>
                  {path.timestamp && (
                    <p className="text-xs text-slate-500 mt-1">Generated {new Date(path.timestamp && path.timestamp.seconds ? path.timestamp.seconds * 1000 : Date.now()).toLocaleDateString()}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <p>No learning paths generated yet.</p>
            </div>
          )}
        </div>

         {/* Tests Generated List */}
         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-slate-800">Generated Tests</h3>
          </div>
          
          {tests.length > 0 ? (
            <div className="space-y-3">
              {tests.map((test, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                  <p className="font-semibold text-slate-800">{test.topic || test.subject || `Test #${idx + 1}`}</p>
                   {test.timestamp && (
                     <p className="text-xs text-slate-500 mt-1">Generated {new Date(test.timestamp && test.timestamp.seconds ? test.timestamp.seconds * 1000 : test.timestamp || Date.now()).toLocaleDateString()}</p>
                   )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <p>No tests generated yet.</p>
            </div>
          )}
        </div>

      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
