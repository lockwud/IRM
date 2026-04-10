
export type NoteCardProps = {
  subject: string;
  className: string;
  strand: string;
  subStrand: string;
  date: string;
  weekEnding: string;
  tags: string[];
  onClick?: () => void;
};

export default function NoteCard({ subject, className, strand, subStrand, date, weekEnding, tags, onClick }: NoteCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-irm-card border border-irm-border rounded-xl p-5 flex flex-col gap-3 shadow cursor-pointer hover:border-irm-primary transition-colors"
    >
      <div className="flex flex-wrap gap-1 mb-1">
        {tags.map((tag) => (
          <span key={tag} className="text-xs font-semibold text-irm-primary bg-blue-100 rounded-full px-2.5 py-0.5">
            {tag}
          </span>
        ))}
      </div>
      <div className="font-bold text-base text-irm-text">{subject}</div>
      <div className="text-sm text-irm-text-secondary">
        <span className="font-medium">Class:</span> {className}
      </div>
      <div className="text-sm text-irm-text-secondary">
        <span className="font-medium">Strand:</span> {strand}
      </div>
      <div className="text-sm text-irm-text-secondary">
        <span className="font-medium">Sub-strand:</span> {subStrand}
      </div>
      <div className="flex items-center mt-1">
        <span className="text-xs text-irm-text-muted">{date}</span>
        <span className="text-xs text-irm-text-muted ml-auto">Week: {weekEnding}</span>
      </div>
    </div>
  );
}
