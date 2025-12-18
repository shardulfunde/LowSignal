import { 
  ArrowLeft, 
  Linkedin, 
  Brain, 
  Layout, 
  Server, 
  Code2, 
  Globe, 
  Heart 
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  
  const team = [
    {
      name: "Shardul Funde",
      role: "AI Head",
      description: "Leading the development of intelligent tutoring systems and personalized learning models.",
      linkedin: "https://www.linkedin.com/in/shardulfunde/",
      icon: Brain,
      color: "bg-violet-100 text-violet-600",
      borderColor: "hover:border-violet-200"
    },
    {
      name: "Sweta Patel",
      role: "Frontend Developer",
      description: "Crafting intuitive and accessible user interfaces for a seamless learning experience.",
      linkedin: "https://www.linkedin.com/in/sweta-patel-2aa130333/",
      icon: Layout,
      color: "bg-pink-100 text-pink-600",
      borderColor: "hover:border-pink-200"
    },
    {
      name: "Pratik Naik",
      role: "AI & Backend Developer",
      description: "Bridging the gap between complex AI logic and robust server-side architecture.",
      linkedin: "https://www.linkedin.com/in/pratik-naik-067b22314/",
      icon: Code2,
      color: "bg-emerald-100 text-emerald-600",
      borderColor: "hover:border-emerald-200"
    },
    {
      name: "Anas Dharar",
      role: "Backend Developer",
      description: "Building scalable infrastructure to ensure fast and reliable access for all students.",
      linkedin: "https://www.linkedin.com/in/anasdharar/",
      icon: Server,
      color: "bg-blue-100 text-blue-600",
      borderColor: "hover:border-blue-200"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/80 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/home" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <h1 className="font-bold text-lg text-slate-800">About Us</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-12">
        
        {/* Mission Section */}
        <section className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-2">
            <Globe className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Democratizing Education
          </h2>
          <p className="text-slate-500 leading-relaxed max-w-xl mx-auto">
            We are a team of passionate developers building the future of learning. 
            Our mission is to make high-quality, AI-powered education accessible 
            to students in every village, in their own language.
          </p>
        </section>

        {/* Team Grid */}
        <section>
          <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">
              Meet the Team
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {team.map((member, index) => (
              <div 
                key={index}
                className={`group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${member.borderColor}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${member.color}`}>
                    <member.icon className="w-6 h-6" />
                  </div>
                  <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-xs font-semibold text-primary/80 uppercase tracking-wide mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Note */}
        <div className="text-center pt-8 border-t border-slate-200/60">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Education Initiative. Built with ❤️ for students.
          </p>
        </div>

      </main>
    </div>
  );
};

export default About;