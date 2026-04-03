
const companies = [
  { name: "Practical Heart", industry: "Web Design", location: "New York City, NY", status: "Active" },
  { name: "Google", industry: "Search Engine", location: "New York City, NY", status: "Active" },
  { name: "TripleUnder", industry: "Travel Reviews", location: "New York City, NY", status: "Inactive" },
];

export default function CompaniesTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow mt-6">
      <div className="font-semibold mb-3">Companies</div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left font-medium">Name</th>
              <th className="p-2 text-left font-medium">Industry</th>
              <th className="p-2 text-left font-medium">Location</th>
              <th className="p-2 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.industry}</td>
                <td className="p-2">{c.location}</td>
                <td className="p-2">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
