export type Student = {
  id: string; name: string; email: string; programme: string; department: string;
  year: number; school: string; region: string; status: "Active" | "Pending" | "Completed";
};
export type Placement = {
  id: string; student: string; school: string; municipality: string; community: string; region: string; supervisor: string;
  requested: string; status: "Pending" | "Approved" | "Rejected";
};
export type LessonNote = {
  id: string; student: string; subject: string; topic: string; week: string;
  mentor: "Pending" | "Approved" | "Revision"; supervisor: "Pending" | "Approved" | "Revision";
};
export type Visit = {
  id: string; student: string; supervisor: string; school: string;
  /** Coordinator creates a supervision window; supervisor may later choose an exact/rescheduled date. */
  startDate: string; endDate: string; rescheduledDate?: string; time: string; rescheduleReason?: string;
  status: "Scheduled" | "Rescheduled" | "Completed" | "Missed" | "Cancelled" | "Draft";
};
export type NotificationItem = { id: string; title: string; message: string; time: string; read: boolean; type: string };

export const seedStudents: Student[] = [
  { id:"5201040012",name:"Kwame Mensah",email:"kmensah@st.aamusted.edu.gh",programme:"B.Ed. Mathematics",department:"Mathematics Education",year:4,school:"Asokwa M/A JHS",region:"Ashanti",status:"Active" },
  { id:"5201040028",name:"Esi Asare",email:"easare@st.aamusted.edu.gh",programme:"B.Ed. English",department:"Languages Education",year:4,school:"Akropong D/A JHS",region:"Eastern",status:"Active" },
  { id:"5201040034",name:"Afia Amoah",email:"aamoah@st.aamusted.edu.gh",programme:"B.Ed. Early Childhood",department:"Early Childhood",year:4,school:"Wesley College Demo",region:"Ashanti",status:"Completed" },
  { id:"5201040041",name:"Kofi Boateng",email:"kboateng@st.aamusted.edu.gh",programme:"B.Ed. Science",department:"Science Education",year:4,school:"—",region:"Bono",status:"Pending" },
  { id:"5201040057",name:"Gifty Owusu",email:"gowusu@st.aamusted.edu.gh",programme:"B.Ed. ICT",department:"ICT Education",year:4,school:"Kumasi Technical SHS",region:"Ashanti",status:"Active" },
  { id:"5201040063",name:"Daniel Ofori",email:"dofori@st.aamusted.edu.gh",programme:"B.Ed. Social Studies",department:"Social Studies",year:4,school:"Mampong Presby JHS",region:"Ashanti",status:"Active" },
];
export const seedPlacements: Placement[] = [
  { id:"PL-1048",student:"Kofi Boateng",school:"Sunyani Senior High",municipality:"Sunyani Municipal",community:"New Town",region:"Bono",supervisor:"Unassigned",requested:"20 Jun 2026",status:"Pending" },
  { id:"PL-1047",student:"Nana Yeboah",school:"T.I. Ahmadiyya SHS",municipality:"Kumasi Metropolitan",community:"Asokwa",region:"Ashanti",supervisor:"Dr. S. Ofori",requested:"19 Jun 2026",status:"Pending" },
  { id:"PL-1046",student:"Esi Asare",school:"Akropong D/A JHS",municipality:"Akuapem North Municipal",community:"Akropong",region:"Eastern",supervisor:"Dr. A. Gyasi",requested:"18 Jun 2026",status:"Approved" },
  { id:"PL-1045",student:"Kwame Mensah",school:"Asokwa M/A JHS",municipality:"Kumasi Metropolitan",community:"Asokwa",region:"Ashanti",supervisor:"Dr. S. Ofori",requested:"17 Jun 2026",status:"Approved" },
  { id:"PL-1044",student:"Akua Frimpong",school:"St. Louis SHS",municipality:"Oforikrom Municipal",community:"Oduom",region:"Ashanti",supervisor:"Unassigned",requested:"16 Jun 2026",status:"Rejected" },
];
export const seedLessonNotes: LessonNote[] = [
  { id:"LN-220",student:"Kwame Mensah",subject:"Mathematics",topic:"Linear equations",week:"Week 6",mentor:"Approved",supervisor:"Pending" },
  { id:"LN-219",student:"Esi Asare",subject:"English Language",topic:"Comprehension skills",week:"Week 6",mentor:"Approved",supervisor:"Approved" },
  { id:"LN-218",student:"Gifty Owusu",subject:"Computing",topic:"Computer networks",week:"Week 5",mentor:"Revision",supervisor:"Pending" },
  { id:"LN-217",student:"Daniel Ofori",subject:"Social Studies",topic:"Ghanaian culture",week:"Week 5",mentor:"Approved",supervisor:"Revision" },
];
export const seedVisits: Visit[] = [
  { id:"VS-084",student:"Kwame Mensah",supervisor:"Dr. Samuel Ofori",school:"Asokwa M/A JHS",startDate:"2026-06-24",endDate:"2026-06-28",rescheduledDate:"2026-06-25",time:"10:00",status:"Rescheduled",rescheduleReason:"Supervisor adjusted the visit to fit the school timetable." },
  { id:"VS-085",student:"Esi Asare",supervisor:"Dr. Ama Gyasi",school:"Akropong D/A JHS",startDate:"2026-06-26",endDate:"2026-06-30",time:"09:30",status:"Scheduled" },
  { id:"VS-086",student:"Afia Amoah",supervisor:"Dr. Samuel Ofori",school:"Wesley College Demo",startDate:"2026-07-02",endDate:"2026-07-05",time:"11:00",status:"Scheduled" },
  { id:"VS-081",student:"Daniel Ofori",supervisor:"Dr. Samuel Ofori",school:"Mampong Presby JHS",startDate:"2026-06-16",endDate:"2026-06-19",time:"08:30",status:"Completed" },
];
export const seedNotifications: NotificationItem[] = [
  { id:"n1",title:"Placement approved",message:"Esi Asare’s placement at Akropong D/A JHS was approved.",time:"8 min ago",read:false,type:"placement" },
  { id:"n2",title:"Lesson note awaiting review",message:"Kwame Mensah submitted Mathematics — Week 6.",time:"32 min ago",read:false,type:"lesson" },
  { id:"n3",title:"Visit reminder",message:"Your visit to Asokwa M/A JHS starts tomorrow at 10:00 AM.",time:"1 hr ago",read:false,type:"visit" },
  { id:"n4",title:"IRB section complete",message:"Afia Amoah completed School Familiarization.",time:"2 hrs ago",read:true,type:"irb" },
];
