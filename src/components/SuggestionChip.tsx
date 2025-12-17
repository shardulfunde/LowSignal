interface SuggestionChipProps {
  label: string;
  onClick: () => void;
}

const SuggestionChip = ({ label, onClick }: SuggestionChipProps) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors active:scale-[0.98]"
    >
      {label}
    </button>
  );
};

export default SuggestionChip;
