import NoteCard from "./NoteCard";

const notes = [
  {
    title: "Product Team Meeting",
    description: "This monthly progress agenda is following this items: Introduction to Newest Product Plan, Monthly Revenue updates for each...",
    tags: ["Weekly", "Product"],
    author: "Floyd Miles",
    date: "Mar 5 04:25",
    avatarUrl: undefined,
  },
  {
    title: "Product Team Meeting",
    description: "This monthly progress agenda is following this items: Introduction to Newest Product Plan, Monthly Revenue updates for each...",
    tags: ["Monthly", "Business"],
    author: "Dianne Russell",
    date: "Apr 11 18:30",
    avatarUrl: undefined,
  },
  {
    title: "HR Interview",
    description: "This monthly progress agenda is following this items: Introduction to Newest Product Plan, Monthly Revenue updates for each...",
    tags: ["Personal", "Business"],
    author: "Annette Black",
    date: "Jun 23 14:31",
    avatarUrl: undefined,
  },
  {
    title: "Monthly Team Progress",
    description: "This monthly progress agenda is following this items: Introduction to Newest Product Plan, Monthly Revenue updates for each...",
    tags: ["Monthly", "Product"],
    author: "Robert Fox",
    date: "Jan 31 09:53",
    avatarUrl: undefined,
  },
  {
    title: "Product Team Meeting",
    description: "Some Summaries of this weeks meeting with some conclusion we get: Some of our product uploaded improved...",
    tags: ["Monthly", "Business"],
    author: "Brooklyn Simmons",
    date: "Aug 15 10:29",
    avatarUrl: undefined,
  },
  {
    title: "Document Images",
    description: "Report Document of Weekly Meetings",
    tags: ["Personal"],
    author: "Cameron Williamson",
    date: "Dec 30 21:28",
    avatarUrl: undefined,
  },
  {
    title: "Weekly Team Progress",
    description: "This weekly progress agenda is following this items: Introduction to Newest Product Plan, Monthly Revenue updates for each...",
    tags: ["Badge", "Product"],
    author: "Dianne Russell",
    date: "Feb 4 19:08",
    avatarUrl: undefined,
  },
  {
    title: "Revenue Progress",
    description: "Some Summaries of this weeks meeting with some conclusion we get: Some of our product uploaded improved...",
    tags: ["Business"],
    author: "Ronald Richards",
    date: "May 22 04:43",
    avatarUrl: undefined,
  },
  {
    title: "Monthly Products",
    description: "Report Document of Weekly Meetings",
    tags: ["Product"],
    author: "Albert Flores",
    date: "Oct 4 15:49",
    avatarUrl: undefined,
  },
];

export default function NotesPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notes</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-200 rounded bg-white font-medium hover:bg-gray-50">Sort By</button>
          <button className="px-4 py-2 border border-gray-200 rounded bg-white font-medium hover:bg-gray-50">Filter</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700">+ Add Notes</button>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {notes.map((note, idx) => (
          <NoteCard key={idx} {...note} />
        ))}
      </div>
    </div>
  );
}
