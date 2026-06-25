# AAMUSTED SIP end-to-end workflow and backend plan

This document explains how the Student Internship Programme portal should work from coordinator setup through student placement, supervision, IRB/Whitebook submission, post-internship review, and backend implementation.

## 1. Roles in the system

### Coordinator

The coordinator manages the programme structure and official administrative records.

Coordinator responsibilities:

- Manage students.
- Manage partner schools.
- Review schools suggested by students.
- Review and approve placement requests.
- Assign supervisors to students, schools, municipalities, districts, towns, communities, and multiple regions.
- Schedule supervision visit windows using a date range.
- Configure IRB / Whitebook sections.
- Configure the internship letter template.
- Keep backup records of post-internship materials received.
- View reports, audit logs, placement records, visit records, and IRB submissions.

Important rule:

The coordinator does not serve as the main receiver/reviewer of post-internship materials. Supervisors receive and review them. The coordinator only keeps administrative backup records.

### Student intern

The student uses the student portal to complete their internship workflow.

Student responsibilities:

- Select a placement school.
- If the school is missing, add the school details for coordinator review.
- Submit placement request.
- Download and submit the internship letter to the school.
- Fill configured IRB / Whitebook sections.
- Submit lesson notes where applicable.
- View assigned supervisor.
- View supervision visit window and any rescheduled visit date.
- Submit post-internship materials to the supervisor.

### Supervisor

The supervisor handles the field supervision and review work.

Supervisor responsibilities:

- View assigned interns.
- View assigned schools and regions.
- View coordinator-created supervision visit windows.
- Reschedule exact visit dates when needed.
- Complete visit records after supervision.
- Review lesson notes / IRB items where required.
- Receive and review post-internship materials.
- Submit feedback and status updates.

## 2. Complete system workflow

```text
Coordinator configures programme settings
→ Coordinator configures IRB/Whitebook and internship letter templates
→ Students log in
→ Students select an existing school or add a missing school
→ Students submit placement request
→ Coordinator reviews the placement request
→ Coordinator approves/rejects placement
→ Coordinator assigns supervisor
→ Coordinator schedules supervision date range
→ Supervisor sees assigned visit window
→ Supervisor can reschedule the exact supervision date
→ Student sees updated visit schedule
→ Supervisor goes for field supervision
→ Supervisor marks visit completed
→ Student fills IRB/Whitebook
→ Student submits post-internship materials to supervisor
→ Supervisor reviews final materials
→ Coordinator records backup/received copies
→ Reports and audit logs are updated
```

## 3. Coordinator user guide

### Dashboard

The dashboard gives the coordinator a quick view of the whole programme:

- total interns;
- active placements;
- pending approvals;
- completed SIP;
- recent activity;
- placement progress.

The dashboard should say `Welcome, {username}`.

### Students

Use this page to:

- add student records;
- update student details;
- view student status;
- confirm programme, department, region, and placement school.

Search should be handled through the global search, not table-level search.

### Schools

Use this page to:

- add approved partner schools;
- import schools;
- view school capacity;
- review school details;
- later approve/reject student-suggested schools.

If a student cannot find their school, they can add it from the student portal. That school should appear for coordinator review.

### Placements

Use this page to:

- view placement requests;
- approve or reject student placement choices;
- create placement records for one or multiple students;
- assign students to a school;
- assign a supervisor where known.

Placement should capture:

- student;
- school;
- municipality/district;
- community/town;
- region;
- supervisor;
- status.

### Supervisors

Use this page to:

- assign a supervisor;
- auto-populate staff ID after selecting the supervisor;
- assign the supervisor to multiple regions;
- define workload/capacity;
- monitor assigned interns and completed visits.

Supervisors are not restricted to one region.

### Visits

Coordinator creates a visit window, not a single visit day.

Required fields:

- student;
- supervisor;
- school;
- start date;
- end date;
- preferred time.

The supervisor can later reschedule the exact visit date. The student sees that update.

Visit statuses:

- Scheduled;
- Rescheduled;
- Completed;
- Missed;
- Cancelled.

### IRB submissions

Use this page to:

- view submitted IRB/Whitebook pages;
- open submitted student data;
- delete invalid/test submissions;
- monitor submitted records only.

This page should not show analytics. It is for submitted records.

### Configurations

Coordinator configuration pages include:

- IRB Configuration;
- Internship Letter.

#### IRB Configuration

The coordinator configures how the Whitebook looks.

Rules:

- IRB 1 to IRB 5 are fixed core pages.
- IRB 6 and above are future configurable sections.
- Coordinator can add section title, subtitle/instructions, fields, field type, and required status.
- Each section can be downloaded as PDF.
- The full template can be downloaded as PDF.

Core IRB sections:

1. School Familiarization
2. Observation of Mentor Lessons
3. Curriculum Planning
4. Lesson Planning
5. Teaching Practice
6. Future configurable sections

#### Internship Letter

The coordinator configures:

- letterhead logo;
- letterhead name;
- subheading;
- school preview name;
- school address;
- body template;
- signatories;
- footer contact.

Students download the completed PDF and submit it to the school.

### Post-internship backup

This is a coordinator record page only.

The supervisor receives/reviews the actual post-internship materials. The coordinator records:

- backup received;
- awaiting backup;
- supervisor revision noted;
- administrative remarks.

## 4. Student user guide

### Placement selection

Student flow:

```text
Open My Placement
→ Choose a listed school
→ If school is missing, click School not found?
→ Enter school name, municipality/district, community/town, region
→ Submit placement request
→ Wait for coordinator approval
```

### Internship letter

Student flow:

```text
Open Documents / Internship Letter
→ Fill school details and internship date range
→ Download PDF
→ Submit PDF to selected school physically or by email
```

### IRB / Whitebook

Student flow:

```text
Open Whitebook (IRB)
→ Fill each configured page
→ Save draft
→ Submit page
→ Supervisor/coordinator can view submitted data
```

### Supervisor visits

Student sees:

- original coordinator visit window;
- supervisor rescheduled exact date if available;
- visit time;
- visit status.

The student does not reschedule supervision visits.

### Post-internship

Student submits final materials to the assigned supervisor, not primarily to the coordinator.

## 5. Supervisor user guide

### Assigned interns

Supervisor sees all interns assigned to them, including:

- student name;
- school;
- municipality/district;
- community/town;
- region;
- IRB progress;
- visit status.

### Visit schedule

Supervisor flow:

```text
Open Visit Schedule
→ View coordinator-created date range
→ If necessary, reschedule exact visit date
→ Student sees the new date
→ After field supervision, mark visit completed
```

### Lesson/IRB review

Supervisor can review assigned student submissions and approve/request revision where required.

### Post-internship materials

Supervisor receives and reviews:

- teaching portfolio;
- research report;
- reflection report;
- final assessment material;
- any other configured deliverable.

Coordinator only keeps backup records.

## 6. Recommended backend build order

1. Authentication and role-based login.
2. Users, students, coordinators, supervisors.
3. Regions, districts, municipalities, communities.
4. Schools and student-suggested schools.
5. Placement requests and approval flow.
6. Supervisor assignments with multiple regions.
7. Visit windows and supervisor rescheduling.
8. Internship letter templates and generated letters.
9. IRB templates, fields, and student submissions.
10. Post-internship supervisor review and coordinator backup records.
11. Notifications.
12. Reports and audit logs.

## 7. Backend endpoints

### Auth

```text
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/change-password
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
```

### Users

```text
GET    /api/users
POST   /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

### Students

```text
GET    /api/students
POST   /api/students
GET    /api/students/:id
PATCH  /api/students/:id
DELETE /api/students/:id
GET    /api/students/:id/dashboard
```

### Schools

```text
GET    /api/schools
POST   /api/schools
GET    /api/schools/:id
PATCH  /api/schools/:id
DELETE /api/schools/:id
GET    /api/schools/suggestions
PATCH  /api/schools/:id/approve
PATCH  /api/schools/:id/reject
```

### Student placement requests

```text
POST   /api/student/placement-requests
GET    /api/student/placement-requests/me
DELETE /api/student/placement-requests/:id
POST   /api/student/schools/suggest
```

### Coordinator placements

```text
GET    /api/coordinator/placement-requests
POST   /api/coordinator/placements
PATCH  /api/coordinator/placement-requests/:id/approve
PATCH  /api/coordinator/placement-requests/:id/reject
PATCH  /api/coordinator/placements/:id/assign-supervisor
```

### Supervisors

```text
GET    /api/supervisors
POST   /api/supervisors
GET    /api/supervisors/:id
PATCH  /api/supervisors/:id
DELETE /api/supervisors/:id
POST   /api/supervisors/:id/regions
DELETE /api/supervisors/:id/regions/:regionId
GET    /api/supervisors/:id/interns
```

### Visits

```text
POST   /api/coordinator/visits
GET    /api/coordinator/visits
PATCH  /api/coordinator/visits/:id
DELETE /api/coordinator/visits/:id

GET    /api/supervisor/visits
PATCH  /api/supervisor/visits/:id/reschedule
PATCH  /api/supervisor/visits/:id/complete

GET    /api/student/visits
GET    /api/student/supervisor
```

### IRB / Whitebook

```text
GET    /api/coordinator/irb-template
PUT    /api/coordinator/irb-template
POST   /api/coordinator/irb-sections
PATCH  /api/coordinator/irb-sections/:id
DELETE /api/coordinator/irb-sections/:id
GET    /api/coordinator/irb-sections/:id/download
GET    /api/coordinator/irb-template/download

GET    /api/student/irb
POST   /api/student/irb/:sectionId/save-draft
POST   /api/student/irb/:sectionId/submit

GET    /api/coordinator/irb-submissions
GET    /api/coordinator/irb-submissions/:id
DELETE /api/coordinator/irb-submissions/:id
```

### Internship letter

```text
GET    /api/coordinator/internship-letter-template
PUT    /api/coordinator/internship-letter-template
GET    /api/coordinator/internship-letter-template/download

GET    /api/student/internship-letter
POST   /api/student/internship-letter/generate
GET    /api/student/internship-letter/download
```

### Post-internship

```text
POST   /api/student/post-internship
GET    /api/student/post-internship

GET    /api/supervisor/post-internship
PATCH  /api/supervisor/post-internship/:id/review

GET    /api/coordinator/post-internship-backups
PATCH  /api/coordinator/post-internship-backups/:id/received
PATCH  /api/coordinator/post-internship-backups/:id/missing
```

### Notifications

```text
GET    /api/notifications
POST   /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
POST   /api/notifications/device
DELETE /api/notifications/device
```

### Reports and audit

```text
GET    /api/reports/dashboard
GET    /api/reports/placements
GET    /api/reports/supervisors
GET    /api/reports/visits
GET    /api/reports/irb
GET    /api/audit-logs
```

### Settings and appearance

```text
GET    /api/settings
PATCH  /api/settings
GET    /api/settings/appearance
PATCH  /api/settings/appearance
```

