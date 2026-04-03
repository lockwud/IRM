
const people = [
  { name: "Robert Fox", email: "robert.fox@example.com", phone: "(671) 555-0110", category: "Employee", location: "Accra", gender: "Male" },
  { name: "Emily Fisher", email: "emily.fisher@example.com", phone: "(406) 555-0120", category: "Supervisor", location: "Kumasi", gender: "Female" },
  { name: "Albert Flores", email: "albert.flores@example.com", phone: "(907) 555-0130", category: "Mentor", location: "Tamale", gender: "Male" },
  { name: "Floyd Miles", email: "floyd.miles@example.com", phone: "(907) 555-0140", category: "Mentee", location: "Koforidua", gender: "Male" },
  { name: "Adrian McCoy", email: "adrian.mccoy@example.com", phone: "(314) 555-0150", category: "Mentee", location: "Takoradi", gender: "Female" },
];

export default function PeopleTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow mt-6">
      <div className="font-semibold mb-3">People</div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left font-medium">Name</th>
              <th className="p-2 text-left font-medium">Email</th>
              <th className="p-2 text-left font-medium">Phone</th>
              <th className="p-2 text-left font-medium">Category</th>
              <th className="p-2 text-left font-medium">Location</th>
              <th className="p-2 text-left font-medium">Gender</th>
            </tr>
          </thead>
          <tbody>
            {people.map((p, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.email}</td>
                <td className="p-2">{p.phone}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">{p.location}</td>
                <td className="p-2">{p.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
