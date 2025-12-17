export type Language = 'en' | 'hi' | 'mr';

export const translations = {
  en: {
    common: {
      lowSignal: "LowSignal",
      friendlyCompanion: "Your friendly learning companion",
      chooseLanguage: "Choose your language",
      pickLanguage: "Pick the language you're most comfortable with",
      downloadMore: "Download more languages",
      learnAnytime: "Learn anytime, anywhere",
      worksOffline: "Works even without internet",
      letsBegin: "Let's Begin",
      madeWithLove: "Made with",
      forRuralLearners: "for rural learners",
      youAreOffline: "You're offline",
      offlineMessage: "but don't worry, saved lessons still work!",
      requiresInternet: "Requires internet connection",
      connectInternet: "Connect to internet to use this feature",
      back: "Back",
    },
    home: {
      greeting: {
        morning: "Good morning",
        afternoon: "Good afternoon",
        evening: "Good evening",
      },
      readyToLearn: "Ready to learn something new today?",
      streak: "Day Streak!",
      doingGreat: "You're doing great — keep it up!",
      features: {
        learningPaths: "Learning Paths",
        learningPathsDesc: "Math, Science & Coding lessons",
        askDoubts: "Ask Doubts",
        askDoubtsDesc: "Get AI help for your questions",
        learnPdf: "Learn from PDF",
        learnPdfDesc: "Upload notes & understand them",
        aiChat: "AI Study Chat",
        aiChatDesc: "Learn through conversation",
        testYourself: "Test Yourself",
        testYourselfDesc: "Practice quizzes anytime",
        villageRanks: "Village Ranks",
        villageRanksDesc: "See how your village is doing",
        findMentor: "Find a Mentor",
        findMentorDesc: "Connect with helpful teachers",
        communityHelp: "Community Help",
        communityHelpDesc: "Ask & answer questions together",
      }
    },
    learningPaths: {
      title: "Learning Paths",
      badges: "Badges",
      keepGoing: "Keep going!",
      progressMessage: "You're making real progress.",
      continueLearning: "Continue Learning",
      yourCourses: "Your Courses",
      courses: {
        basicMath: "Basic Math",
        basicMathDesc: "Numbers, fractions, and everyday calculations",
        everydayScience: "Everyday Science",
        everydayScienceDesc: "Understand the world around you",
        introCoding: "Intro to Coding",
        introCodingDesc: "Learn to think like a programmer",
        englishBasics: "English Basics",
        englishBasicsDesc: "Reading, writing, and speaking skills",
      }
    },
    doubtSolver: {
      title: "Ask Doubts",
      connectToAsk: "Connect to internet to ask questions",
      tryAsking: "Try asking:",
      typeQuestion: "Type your question...",
      initialMessage: "Hello! I'm your AI tutor. Ask me any question about your studies. I can explain concepts, solve problems, and help you understand better.",
      suggestions: {
        photosynthesis: "What is photosynthesis?",
        fractions: "Explain fractions simply",
        electricity: "How does electricity work?",
        coding: "What is coding?",
      }
    },
    pdfLearning: {
      title: "Learn from PDF",
      aiRequiresInternet: "AI features require internet",
      uploadPdf: "Upload a PDF",
      uploadDesc: "Upload your textbook or notes to learn with AI",
      chooseFile: "Choose PDF File",
      yourPdfs: "Your PDFs",
      pages: "pages",
      explainPage: "Explain this page",
      explainPageDesc: "Get a simple explanation",
      summarize: "Summarize",
      summarizeDesc: "Get key points",
      askQuestions: "Ask questions",
      askQuestionsDesc: "Test your understanding",
      backToPdfs: "← Back to PDFs",
    },
    aiChat: {
      title: "AI Study Chat",
      connectToChat: "Connect to internet to chat with AI",
      placeholder: "What do you want to learn?",
      initialMessage: "Hi there! 😊 I'm your friendly study buddy. I can help you learn anything. What topic would you like to explore today?",
      suggestions: {
        explain: "Explain simply",
        examples: "Give examples",
        questions: "Ask me questions",
        fun: "Make it fun",
      }
    },
    testGenerator: {
      title: "Test Generator",
      selectTopic: "Select Topic",
      chooseTopic: "Choose a topic",
      difficultyLevel: "Difficulty Level",
      difficulties: {
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
      },
      questionsIn: "Questions will be in:",
      generateTest: "Generate Test",
      practiceOffline: "Practice Offline",
      practiceOfflineDesc: "Generate tests now and save them for offline practice later",
      newTest: "New Test",
      saveOffline: "Save Offline",
      topics: {
        math: "Basic Math",
        fractions: "Fractions",
        science: "Everyday Science",
        plants: "Plants & Animals",
        electricity: "Electricity",
        english: "English Grammar",
      }
    },
    leaderboard: {
      title: "Village Ranks",
      yourVillage: "Your Village",
      pointsToNext: "Just 750 points to #3!",
      keepLearning: "Keep learning — every lesson helps your village climb",
      thisMonth: "This Month",
      updateNote: "Rankings update every Sunday at midnight",
      students: "students",
    },
    community: {
      title: "Community",
      tabs: {
        mentors: "Mentors",
        questions: "Questions",
      },
      mentorsDesc: "Connect with volunteer teachers who can help you with your studies",
      questionsDesc: "Help others or get help from the community",
      askQuestion: "Ask a Question",
      studentsHelped: "students helped",
    },
    aiResponses: {
      chat: {
        explain: "Sure! Let me break it down for you step by step. First, let's understand the basic concept...",
        example: "Here's a real-life example you might find relatable:\n\nImagine you're at a market buying vegetables...",
        question: "Great idea! Here's a question for you:\n\nIf you have 3 apples and your friend gives you 2 more, how many apples do you have now?",
        default: "That's interesting! Let me help you understand \"{0}\" better. What aspect would you like me to focus on?",
      },
      doubt: {
        default: "Great question! Let me explain \"{0}\" in a simple way...\n\nThis is a concept that helps us understand how things work in our daily life. Would you like me to give you an example or explain it further?",
      }
    },
    bottomNav: {
      home: "Home",
      learn: "Learn",
      chat: "Chat",
      ranks: "Ranks",
      community: "Community",
    },
    topBar: {
      online: "Online",
      offline: "Offline",
    },
    components: {
      featureCard: {
        offline: "Offline",
        online: "Online",
      },
      learningPathCard: {
        saved: "Saved",
        of: "of",
        lessons: "lessons",
        days: "days",
        streak: "streak",
        badges: "badges",
        encouragement: {
          start: "Ready to start? 🌱",
          great: "Great start! Keep going 💪",
          amazing: "You're doing amazing! ✨",
          almost: "Almost there! 🎯",
          finish: "So close to finishing! 🏆",
        }
      },
      leaderboardItem: {
        learners: "learners",
        you: "You",
        points: "points",
      },
      mentorCard: {
        helped: "helped",
        message: "Message",
      },
      communityQuestion: {
        replies: "replies",
      },
      notFound: {
        title: "404",
        message: "Oops! Page not found",
        returnHome: "Return to Home",
      }
    }
  },
  hi: {
    common: {
      lowSignal: "लो सिग्नल",
      friendlyCompanion: "आपका मित्रवत शिक्षण साथी",
      chooseLanguage: "अपनी भाषा चुनें",
      pickLanguage: "वह भाषा चुनें जिसमें आप सबसे अधिक सहज हों",
      downloadMore: "और भाषाएं डाउनलोड करें",
      learnAnytime: "कभी भी, कहीं भी सीखें",
      worksOffline: "बिना इंटरनेट के भी काम करता है",
      letsBegin: "शुरू करें",
      madeWithLove: "ग्रामीण छात्रों के लिए",
      forRuralLearners: "प्यार से बनाया गया",
      youAreOffline: "आप ऑफ़लाइन हैं",
      offlineMessage: "लेकिन चिंता न करें, सहेजे गए पाठ अभी भी काम करते हैं!",
      requiresInternet: "इंटरनेट कनेक्शन की आवश्यकता है",
      connectInternet: "इस सुविधा का उपयोग करने के लिए इंटरनेट से कनेक्ट करें",
      back: "वापस",
    },
    home: {
      greeting: {
        morning: "सुप्रभात",
        afternoon: "नमस्कार",
        evening: "शुभ संध्या",
      },
      readyToLearn: "आज कुछ नया सीखने के लिए तैयार हैं?",
      streak: "दिन की स्ट्रीक!",
      doingGreat: "आप बहुत अच्छा कर रहे हैं - इसे जारी रखें!",
      features: {
        learningPaths: "सीखने के रास्ते",
        learningPathsDesc: "गणित, विज्ञान और कोडिंग पाठ",
        askDoubts: "सवाल पूछें",
        askDoubtsDesc: "अपने सवालों के लिए AI मदद प्राप्त करें",
        learnPdf: "PDF से सीखें",
        learnPdfDesc: "नोट्स अपलोड करें और उन्हें समझें",
        aiChat: "AI स्टडी चैट",
        aiChatDesc: "बातचीत के माध्यम से सीखें",
        testYourself: "खुद को परखें",
        testYourselfDesc: "कभी भी क्विज़ का अभ्यास करें",
        villageRanks: "गांव की रैंकिंग",
        villageRanksDesc: "देखें कि आपका गांव कैसा प्रदर्शन कर रहा है",
        findMentor: "मेंटोर खोजें",
        findMentorDesc: "मददगार शिक्षकों से जुड़ें",
        communityHelp: "समुदाय सहायता",
        communityHelpDesc: "एक साथ सवाल पूछें और जवाब दें",
      }
    },
    learningPaths: {
      title: "सीखने के रास्ते",
      badges: "बैज",
      keepGoing: "चलते रहो!",
      progressMessage: "आप वास्तव में प्रगति कर रहे हैं।",
      continueLearning: "सीखना जारी रखें",
      yourCourses: "आपके पाठ्यक्रम",
      courses: {
        basicMath: "बुनियादी गणित",
        basicMathDesc: "संख्याएं, भिन्न और रोजमर्रा की गणनाएं",
        everydayScience: "दैनिक विज्ञान",
        everydayScienceDesc: "अपने आसपास की दुनिया को समझें",
        introCoding: "कोडिंग का परिचय",
        introCodingDesc: "एक प्रोग्रामर की तरह सोचना सीखें",
        englishBasics: "अंग्रेजी की मूल बातें",
        englishBasicsDesc: "पढ़ना, लिखना और बोलने का कौशल",
      }
    },
    doubtSolver: {
      title: "सवाल पूछें",
      connectToAsk: "सवाल पूछने के लिए इंटरनेट से कनेक्ट करें",
      tryAsking: "यह पूछने की कोशिश करें:",
      typeQuestion: "अपना सवाल टाइप करें...",
      initialMessage: "नमस्ते! मैं आपका AI ट्यूटर हूं। अपनी पढ़ाई के बारे में मुझसे कोई भी सवाल पूछें। मैं अवधारणाओं को समझा सकता हूं, समस्याओं को हल कर सकता हूं और आपको बेहतर समझने में मदद कर सकता हूं।",
      suggestions: {
        photosynthesis: "प्रकाश संश्लेषण क्या है?",
        fractions: "भिन्नों को सरलता से समझाएं",
        electricity: "बिजली कैसे काम करती है?",
        coding: "कोडिंग क्या है?",
      }
    },
    pdfLearning: {
      title: "PDF से सीखें",
      aiRequiresInternet: "AI सुविधाओं के लिए इंटरनेट की आवश्यकता है",
      uploadPdf: "PDF अपलोड करें",
      uploadDesc: "AI के साथ सीखने के लिए अपनी पाठ्यपुस्तक या नोट्स अपलोड करें",
      chooseFile: "PDF फ़ाइल चुनें",
      yourPdfs: "आपकी PDF",
      pages: "पृष्ठ",
      explainPage: "इस पृष्ठ को समझाएं",
      explainPageDesc: "एक सरल स्पष्टीकरण प्राप्त करें",
      summarize: "सारांशित करें",
      summarizeDesc: "मुख्य बिंदु प्राप्त करें",
      askQuestions: "सवाल पूछें",
      askQuestionsDesc: "अपनी समझ का परीक्षण करें",
      backToPdfs: "← PDF पर वापस जाएं",
    },
    aiChat: {
      title: "AI स्टडी चैट",
      connectToChat: "AI के साथ चैट करने के लिए इंटरनेट से कनेक्ट करें",
      placeholder: "आप क्या सीखना चाहते हैं?",
      initialMessage: "नमस्ते! 😊 मैं आपका मित्रवत अध्ययन साथी हूं। मैं आपको कुछ भी सीखने में मदद कर सकता हूं। आज आप किस विषय का पता लगाना चाहेंगे?",
      suggestions: {
        explain: "सरलता से समझाएं",
        examples: "उदाहरण दें",
        questions: "मुझसे सवाल पूछें",
        fun: "इसे मजेदार बनाएं",
      }
    },
    testGenerator: {
      title: "टेस्ट जेनरेटर",
      selectTopic: "विषय चुनें",
      chooseTopic: "एक विषय चुनें",
      difficultyLevel: "कठिनाई स्तर",
      difficulties: {
        easy: "आसान",
        medium: "मध्यम",
        hard: "कठिन",
      },
      questionsIn: "सवाल इसमें होंगे:",
      generateTest: "टेस्ट जेनरेट करें",
      practiceOffline: "ऑफ़लाइन अभ्यास करें",
      practiceOfflineDesc: "अभी टेस्ट जेनरेट करें और बाद में ऑफ़लाइन अभ्यास के लिए उन्हें सहेजें",
      newTest: "नया टेस्ट",
      saveOffline: "ऑफ़लाइन सहेजें",
      topics: {
        math: "बुनियादी गणित",
        fractions: "भिन्न",
        science: "दैनिक विज्ञान",
        plants: "पौधे और जानवर",
        electricity: "बिजली",
        english: "अंग्रेजी व्याकरण",
      }
    },
    leaderboard: {
      title: "गांव की रैंकिंग",
      yourVillage: "आपका गांव",
      pointsToNext: "#3 के लिए बस 750 अंक!",
      keepLearning: "सीखते रहें - हर पाठ आपके गांव को ऊपर चढ़ने में मदद करता है",
      thisMonth: "इस महीने",
      updateNote: "रैंकिंग हर रविवार आधी रात को अपडेट होती है",
      students: "छात्र",
    },
    community: {
      title: "समुदाय",
      tabs: {
        mentors: "मेंटोर",
        questions: "सवाल",
      },
      mentorsDesc: "स्वयंसेवक शिक्षकों से जुड़ें जो आपकी पढ़ाई में मदद कर सकते हैं",
      questionsDesc: "दूसरों की मदद करें या समुदाय से मदद लें",
      askQuestion: "एक सवाल पूछें",
      studentsHelped: "छात्रों की मदद की",
    },
    aiResponses: {
      chat: {
        explain: "ज़रूर! मैं इसे आपके लिए चरण-दर-चरण समझाता हूँ। सबसे पहले, आइए मूल अवधारणा को समझें...",
        example: "यहाँ एक वास्तविक जीवन का उदाहरण है जो आपको प्रासंगिक लग सकता है:\n\nकल्पना कीजिए कि आप बाज़ार में सब्ज़ियाँ खरीद रहे हैं...",
        question: "बहुत अच्छा विचार! यहाँ आपके लिए एक प्रश्न है:\n\nयदि आपके पास 3 सेब हैं और आपका दोस्त आपको 2 और देता है, तो अब आपके पास कितने सेब हैं?",
        default: "यह दिलचस्प है! मैं \"{0}\" को बेहतर ढंग से समझने में आपकी मदद करता हूँ। आप चाहते हैं कि मैं किस पहलू पर ध्यान केंद्रित करूँ?",
      },
      doubt: {
        default: "बहुत अच्छा सवाल! मैं \"{0}\" को सरल तरीके से समझाता हूँ...\n\nयह एक ऐसी अवधारणा है जो हमें यह समझने में मदद करती है कि हमारे दैनिक जीवन में चीजें कैसे काम करती हैं। क्या आप चाहेंगे कि मैं आपको एक उदाहरण दूँ या इसे और समझाऊँ?",
      }
    },
    bottomNav: {
      home: "होम",
      learn: "सीखें",
      chat: "चैट",
      ranks: "रैंक",
      community: "समुदाय",
    },
    topBar: {
      online: "ऑनलाइन",
      offline: "ऑफ़लाइन",
    },
    components: {
      featureCard: {
        offline: "ऑफ़लाइन",
        online: "ऑनलाइन",
      },
      learningPathCard: {
        saved: "सहेजा गया",
        of: "में से",
        lessons: "पाठ",
        days: "दिन",
        streak: "स्ट्रीक",
        badges: "बैज",
        encouragement: {
          start: "शुरू करने के लिए तैयार? 🌱",
          great: "शानदार शुरुआत! चलते रहो 💪",
          amazing: "आप अद्भुत कर रहे हैं! ✨",
          almost: "बस होने ही वाला है! 🎯",
          finish: "खत्म करने के बहुत करीब! 🏆",
        }
      },
      leaderboardItem: {
        learners: "शिक्षार्थी",
        you: "आप",
        points: "अंक",
      },
      mentorCard: {
        helped: "मदद की",
        message: "संदेश",
      },
      communityQuestion: {
        replies: "जवाब",
      },
      notFound: {
        title: "404",
        message: "ओह! पेज नहीं मिला",
        returnHome: "होम पर वापस जाएं",
      }
    }
  }
};
