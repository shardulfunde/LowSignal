import { Check } from "lucide-react";

interface LanguageCardProps {
  code: string;
  name: string;
  nativeName: string;
  isSelected: boolean;
  onSelect: (code: string) => void;
}

const LanguageCard = ({ code, name, nativeName, isSelected, onSelect }: LanguageCardProps) => {
  return (
    <button
      onClick={() => onSelect(code)}
      className={`w-full p-5 rounded-xl border-2 transition-all active:scale-[0.98] text-left ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">{nativeName}</h3>
          <p className="text-sm text-muted-foreground mt-1">{name}</p>
        </div>
        {isSelected && (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </div>
    </button>
  );
};

export default LanguageCard;
