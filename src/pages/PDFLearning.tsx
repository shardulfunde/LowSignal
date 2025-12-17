import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Upload, FileText, BookOpen, MessageCircle, HelpCircle, Wifi } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";

const PDFLearning = () => {
  const { language, t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

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

  const savedPdfs = [
    { name: "Class 8 Science Chapter 5", pages: 12 },
    { name: "Basic Mathematics Guide", pages: 24 },
    { name: "English Grammar Notes", pages: 8 },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar language={getLanguageLabel()} isOnline={isOnline} showBack title={t('pdfLearning.title')} />

      {/* Online Notice */}
      <div className="px-4 py-2 bg-secondary/10 border-b border-secondary/20 flex items-center justify-center gap-2">
        <Wifi className="w-4 h-4 text-secondary" />
        <p className="text-sm font-semibold text-secondary">{t('pdfLearning.aiRequiresInternet')}</p>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6">
        {!selectedPdf ? (
          <>
            {/* Upload Section */}
            <div className="p-8 rounded-xl border-2 border-dashed border-border bg-card mb-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">{t('pdfLearning.uploadPdf')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('pdfLearning.uploadDesc')}
              </p>
              <Button className="w-full h-12">
                <Upload className="w-5 h-5 mr-2" />
                {t('pdfLearning.chooseFile')}
              </Button>
            </div>

            {/* Saved PDFs */}
            <h3 className="text-lg font-bold text-foreground mb-4">{t('pdfLearning.yourPdfs')}</h3>
            <div className="space-y-3">
              {savedPdfs.map((pdf, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPdf(pdf.name)}
                  className="w-full p-4 rounded-xl bg-card border border-border text-left hover:border-primary/30 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">{pdf.name}</h4>
                      <p className="text-sm text-muted-foreground">{pdf.pages} {t('pdfLearning.pages')}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* PDF Viewer */}
            <div className="rounded-xl bg-card border border-border p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-destructive" />
                <div>
                  <h2 className="font-bold text-foreground">{selectedPdf}</h2>
                  <p className="text-sm text-muted-foreground">Page 1 of 12</p>
                </div>
              </div>
              <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">PDF Preview</p>
              </div>
            </div>

            {/* AI Actions */}
            <h3 className="text-lg font-bold text-foreground mb-4">What would you like to do?</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-14 justify-start text-left"
                disabled={!isOnline}
              >
                <BookOpen className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="font-semibold">{t('pdfLearning.explainPage')}</p>
                  <p className="text-xs text-muted-foreground">{t('pdfLearning.explainPageDesc')}</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full h-14 justify-start text-left"
                disabled={!isOnline}
              >
                <MessageCircle className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="font-semibold">{t('pdfLearning.summarize')}</p>
                  <p className="text-xs text-muted-foreground">{t('pdfLearning.summarizeDesc')}</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full h-14 justify-start text-left"
                disabled={!isOnline}
              >
                <HelpCircle className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="font-semibold">{t('pdfLearning.askQuestions')}</p>
                  <p className="text-xs text-muted-foreground">{t('pdfLearning.askQuestionsDesc')}</p>
                </div>
              </Button>
            </div>

            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setSelectedPdf(null)}
            >
              {t('pdfLearning.backToPdfs')}
            </Button>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default PDFLearning;
