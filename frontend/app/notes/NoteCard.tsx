
export type NoteCardProps = {
  title: string;
  description: string;
  tags: string[];
  author: string;
  date: string;
  avatarUrl?: string;
};

export default function NoteCard({ title, description, tags, author, date, avatarUrl }: NoteCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 min-w-[260px] max-w-[320px] flex flex-col gap-3 shadow">
      <div className="flex gap-2 mb-1">
        {tags.map(tag => (
          <span key={tag} className="text-xs font-semibold text-blue-600 bg-blue-100 rounded px-2 py-0.5 mr-1">
            {tag}
          </span>
        ))}
      </div>
      <div className="font-bold text-base mb-0.5">{title}</div>
      <div className="text-sm text-gray-700 flex-1">{description}</div>
      <div className="flex items-center mt-2">
        {avatarUrl && <img src={avatarUrl} alt={author} className="w-7 h-7 rounded-full mr-2" />}
        <span className="text-xs font-semibold text-gray-900">{author}</span>
        <span className="text-xs text-gray-500 ml-auto">{date}</span>
      </div>
    </div>
  );
}
