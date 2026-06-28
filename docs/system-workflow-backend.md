# AAMUSTED SIP system workflow, API endpoints, and data schemas

This document explains how the Student Internship Programme system works from coordinator setup through student placement, supervision, IRB/Whitebook, lesson notes, internship letters, visits, and system settings.

It also lists the API endpoints and database schemas needed for the backend. It does not include backend implementation steps.

## 1. Main user roles

### Coordinator

The coordinator manages the programme setup and controls the main records.

Coordinator responsibilities:

- Manage students.
- Manage partner schools.
- Approve, reject, or create placement requests.
- Assign supervisors to students, schools, and multiple regions.
- Configure the IRB/Whitebook template.
- Configure the lesson note format.
- Configure the internship letter template, logo, letterhead, school name, and signatories.
- Schedule supervision visit windows using a date range.
- Monitor IRB submissions.
- Manage settings, appearance, notifications, reports, audit logs, and bulk uploads.

The coordinator does not fill student IRB pages or lesson notes.

### Student intern

The student completes the internship workflow from the student portal.

Student responsibilities:

- Select a placement school.
- Add a school if it is not found.
- Download the internship letter generated from the coordinator template.
- Submit the internship letter to the school physically or by email.
- Fill and submit IRB/Whitebook sections.
- Create weekly lesson notes by default.
- Optionally create termly lesson notes.
- Select only the teaching days needed for a lesson note.
- Preview and download IRB sections and lesson notes as PDF-ready sheets.
- Track mentor and supervisor review status.
- View visit schedules and supervisor rescheduled dates.
- Download documents.

### Supervisor

The supervisor handles field supervision, lesson-note review, and visits for assigned interns.

Supervisor responsibilities:

- View assigned interns.
- Review full lesson notes submitted by students.
- Approve lesson notes or request revision.
- Add an overall supervisor comment during review.
- View coordinator-created visit windows.
- Reschedule the exact visit date within or around the visit window.
- Mark visits as completed.
- View notifications and update personal settings.

Supervisors can be assigned to multiple regions.

### Mentor

Mentors are not full system users.

The mentor section is only part of the student workflow. When a student needs mentor input or review, it is recorded through the student’s lesson note process. Mentors do not receive a separate dashboard.

## 2. End-to-end system workflow

### Step 1: Coordinator configures the system

Before students start, the coordinator sets up:

- Academic year.
- Programme settings.
- Partner schools.
- Supervisor assignments.
- IRB/Whitebook template.
- Lesson note format.
- Internship letter template.
- Notification settings.
- Appearance and portal preferences.

The configuration controls what students see and fill.

### Step 2: Coordinator imports or creates students

Students can be added manually or through bulk upload.

Each student record should include:

- Student ID.
- Full name.
- Email.
- Programme.
- Department.
- Year.
- Status.
- Region or preferred region.

### Step 3: Student selects placement school

The student opens My Placement and selects a preferred school.

If the school exists:

1. Student selects the school.
2. Student submits placement request.
3. Coordinator reviews the request.

If the school does not exist:

1. Student adds the school name and location details.
2. The system creates a new-school suggestion.
3. Coordinator reviews the school and placement request.

### Step 4: Coordinator approves placement

The coordinator approves or rejects placement requests.

When approved:

- Student status becomes active.
- Placement school is attached to the student.
- Supervisor can be assigned.
- Student can continue internship workflow.

When rejected:

- Student can submit another request.

### Step 5: Internship letter workflow

The coordinator configures the letter template:

- Logo.
- Letterhead.
- School name.
- Letter body.
- Footer contact.
- One or more signatories.

The student downloads the internship letter after placement. The coordinator can also generate or download it.

The student submits the letter to the school physically or by email.

### Step 6: IRB/Whitebook configuration

The coordinator configures the IRB template.

Fixed sections:

1. IRB 1 — School Familiarization
2. IRB 2 — Observation of Mentor Lessons
3. IRB 3 — Curriculum Planning
4. IRB 4 — Lesson Planning
5. IRB 5 — Teaching Practice

From IRB 6 onward, the coordinator can add configurable sections.

For configurable sections, the coordinator controls:

- Section title.
- Instruction/subtitle.
- Fields.
- Field type.
- Required status.

Students only fill the configured IRB sections. They do not configure the IRB.

### Step 7: Student fills IRB/Whitebook

The student opens Whitebook/IRB and fills each section.

The student can:

- Save a section as draft.
- Submit a section.
- Preview the section as a portrait sheet.
- Download the section as PDF-ready output.

The coordinator can view submitted IRB data and delete invalid submissions if needed.

### Step 8: Lesson note configuration

The coordinator configures the lesson note format.

Configuration includes:

- Weekly or termly planning structure.
- Student-fill fields.
- Font size.
- Heading size.
- Line spacing.
- Table density.

Weekly is the default.

Termly is optional.

### Step 9: Student creates lesson notes

The student opens Lesson Notes.

The student can:

- View existing lesson notes in a table.
- Toggle between weekly and termly.
- Create a new lesson note.
- Select the teaching days needed.
- Fill starter, main activity, and reflection for each selected day.
- Preview before saving.
- Edit before saving.
- Submit for review.
- Download the lesson note as PDF-ready output.

The student does not need to fill all IRB sections before previewing or downloading a lesson note.

### Step 10: Lesson note review

Review flow:

1. Student submits lesson note.
2. Mentor review status is recorded first.
3. Supervisor reviews after mentor review.
4. Supervisor approves or requests revision.

The supervisor review page opens as a full page, not a modal.

The supervisor can see:

- Student.
- Class.
- Mentor review status.
- Supervisor status.
- Learning indicators.
- Performance indicators.
- Teaching/learning resources.
- Teaching days table.
- Overall decision comment.

The supervisor does not comment inside every day row.

### Step 11: Visit scheduling

The coordinator schedules a visit window, not a single day.

A visit window includes:

- Student.
- Supervisor.
- School.
- Start date.
- End date.
- Preferred time.

The supervisor can reschedule the exact visit date. The student sees the updated supervision date in their portal.

### Step 12: Visit completion

After the school visit, the supervisor marks the visit as completed.

The system updates:

- Student visit status.
- Supervisor dashboard metrics.
- Notifications.
- Audit log.

### Step 13: Notifications

Notifications are created for important workflow changes:

- Placement submitted.
- Placement approved/rejected.
- New school suggested.
- Internship letter downloaded.
- IRB section saved/submitted.
- Lesson note submitted.
- Lesson note approved/revision requested.
- Visit scheduled.
- Visit rescheduled.
- Visit completed.

### Step 14: Appearance and settings

Each user can customize their portal appearance.

Appearance settings include:

- Theme mode: light, dark, or system.
- Base colour.
- Theme colour.
- Chart colour.
- Font.
- Radius.
- Density/style.

The selected colour should affect:

- Sidebar active states.
- Buttons.
- Profile avatar placeholder.
- Login accent colour.

## 3. API endpoints needed

Base path suggestion: `/api/v1`

### Auth

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | Login by role and credentials |
| POST | `/auth/logout` | Logout current user |
| GET | `/auth/me` | Get current session user |
| POST | `/auth/change-password` | Change password while logged in |
| POST | `/auth/forgot-password` | Request reset instructions |
| POST | `/auth/reset-password` | Reset password using token |
| POST | `/auth/refresh` | Refresh session token |

### Users and profiles

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/users` | List users |
| POST | `/users` | Create user |
| GET | `/users/:id` | Get user |
| PATCH | `/users/:id` | Update user |
| DELETE | `/users/:id` | Deactivate/delete user |
| GET | `/users/:id/profile` | Get role profile |
| PATCH | `/users/:id/profile` | Update role profile |

### Students

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/students` | List students |
| POST | `/students` | Add student |
| GET | `/students/:id` | Get student |
| PATCH | `/students/:id` | Update student |
| DELETE | `/students/:id` | Delete/deactivate student |
| POST | `/students/import` | Bulk upload students |
| GET | `/students/:id/dashboard` | Student dashboard data |

### Schools

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/schools` | List partner schools |
| POST | `/schools` | Create school |
| GET | `/schools/:id` | Get school |
| PATCH | `/schools/:id` | Update school |
| DELETE | `/schools/:id` | Delete/deactivate school |
| POST | `/schools/suggestions` | Student suggests school |
| GET | `/schools/suggestions` | Coordinator views suggested schools |
| PATCH | `/schools/suggestions/:id` | Approve/reject suggested school |

### Placements

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/placements` | List placement requests |
| POST | `/placements` | Create placement request |
| GET | `/placements/:id` | Get placement |
| PATCH | `/placements/:id` | Update placement |
| POST | `/placements/:id/approve` | Approve placement |
| POST | `/placements/:id/reject` | Reject placement |
| POST | `/placements/bulk-assign` | Assign multiple students to a school |
| POST | `/placements/:id/assign-supervisor` | Assign supervisor |

### Supervisors

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/supervisors` | List supervisors |
| POST | `/supervisors` | Create/assign supervisor |
| GET | `/supervisors/:id` | Get supervisor |
| PATCH | `/supervisors/:id` | Update supervisor |
| DELETE | `/supervisors/:id` | Delete/deactivate supervisor |
| POST | `/supervisors/:id/regions` | Assign supervisor to multiple regions |
| GET | `/supervisors/:id/interns` | Get assigned interns |
| GET | `/supervisors/:id/dashboard` | Supervisor dashboard data |

### Internship letter

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/letter-template` | Get active internship letter template |
| PATCH | `/letter-template` | Update template |
| POST | `/letter-template/logo` | Upload logo |
| POST | `/letter-template/signatories` | Add signatory |
| PATCH | `/letter-template/signatories/:id` | Update signatory |
| DELETE | `/letter-template/signatories/:id` | Remove signatory |
| GET | `/students/:id/internship-letter` | Generate/download student letter |

### IRB/Whitebook configuration

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/irb/template` | Get active IRB template |
| PATCH | `/irb/template` | Save full template |
| POST | `/irb/sections` | Add configurable section |
| PATCH | `/irb/sections/:id` | Update section |
| DELETE | `/irb/sections/:id` | Remove configurable section |
| POST | `/irb/sections/:id/fields` | Add field |
| PATCH | `/irb/fields/:id` | Update field |
| DELETE | `/irb/fields/:id` | Remove field |
| GET | `/irb/template/download` | Download full IRB template |
| GET | `/irb/sections/:id/download` | Download section template |

### IRB submissions

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/irb/submissions` | Coordinator views submissions |
| POST | `/irb/submissions` | Student saves/submits section |
| GET | `/irb/submissions/:id` | View submission |
| PATCH | `/irb/submissions/:id` | Update draft |
| DELETE | `/irb/submissions/:id` | Delete invalid submission |
| POST | `/irb/submissions/:id/submit` | Submit draft |
| GET | `/students/:id/irb-progress` | Student IRB progress |

### Lesson note format

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/lesson-note-format` | Get active lesson note format |
| PATCH | `/lesson-note-format` | Save lesson note format |
| POST | `/lesson-note-format/fields` | Add configured field |
| PATCH | `/lesson-note-format/fields/:id` | Update configured field |
| DELETE | `/lesson-note-format/fields/:id` | Delete configured field |
| GET | `/lesson-note-format/download` | Download PDF-ready template |

### Lesson notes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/lesson-notes` | List lesson notes |
| POST | `/lesson-notes` | Create lesson note |
| GET | `/lesson-notes/:id` | View full lesson note |
| PATCH | `/lesson-notes/:id` | Edit draft/revision |
| DELETE | `/lesson-notes/:id` | Delete draft |
| POST | `/lesson-notes/:id/submit` | Submit for review |
| POST | `/lesson-notes/:id/mentor-review` | Record mentor status |
| POST | `/lesson-notes/:id/supervisor-review` | Approve/request revision |
| GET | `/lesson-notes/:id/download` | Download lesson note PDF |

### Visits

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/visits` | List visits |
| POST | `/visits` | Coordinator schedules visit window |
| GET | `/visits/:id` | Get visit |
| PATCH | `/visits/:id` | Update visit |
| POST | `/visits/:id/reschedule` | Supervisor sets exact visit date |
| POST | `/visits/:id/complete` | Mark visit completed |
| GET | `/students/:id/visits` | Student visit schedule |
| GET | `/supervisors/:id/visits` | Supervisor visit schedule |

### Notifications

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/notifications` | List user notifications |
| POST | `/notifications` | Create notification |
| PATCH | `/notifications/:id/read` | Mark one as read |
| PATCH | `/notifications/read-all` | Mark all as read |
| POST | `/notifications/device` | Save push device token |
| DELETE | `/notifications/device/:id` | Remove device token |

### Settings and appearance

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/settings` | Get system settings |
| PATCH | `/settings` | Update system settings |
| GET | `/appearance` | Get current user appearance |
| PATCH | `/appearance` | Save current user appearance |

### Reports, audit, uploads

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/reports/:type` | Generate report |
| GET | `/audit-logs` | List audit logs |
| GET | `/audit-logs/:id` | View audit event |
| POST | `/uploads/bulk` | Upload spreadsheet |
| GET | `/uploads/templates/:type` | Download CSV/template |

## 4. Database schemas needed

The schema below is a model outline. Field names can be adapted to Prisma or SQL naming style.

### Enums

```prisma
enum UserRole {
  COORDINATOR
  SUPERVISOR
  STUDENT
  ADMIN
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum PlacementStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}

enum ReviewStatus {
  DRAFT
  PENDING
  APPROVED
  REVISION
}

enum VisitStatus {
  SCHEDULED
  RESCHEDULED
  COMPLETED
  CANCELLED
}

enum FieldType {
  SHORT_TEXT
  LONG_TEXT
  DATE
  CHECKBOX
  TABLE
  WEEKLY_TABLE
}

enum NotificationType {
  SYSTEM
  PLACEMENT
  IRB
  LESSON
  VISIT
  LETTER
}
```

### Core users

```prisma
model User {
  id           String     @id @default(cuid())
  email        String     @unique
  passwordHash String
  role         UserRole
  status       UserStatus @default(ACTIVE)
  firstName    String?
  lastName     String?
  phone        String?
  lastLoginAt  DateTime?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}
```

### Students

```prisma
model Student {
  id          String   @id @default(cuid())
  userId      String?  @unique
  studentId   String   @unique
  name        String
  email       String
  programme   String
  department  String
  year        Int
  region      String?
  status      String   @default("Pending")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Supervisors

```prisma
model Supervisor {
  id          String   @id @default(cuid())
  userId      String?  @unique
  staffId     String   @unique
  name        String
  email       String?
  capacity    Int      @default(25)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SupervisorRegion {
  id           String @id @default(cuid())
  supervisorId String
  region       String
}
```

### Schools

```prisma
model School {
  id           String   @id @default(cuid())
  name         String
  category     String?
  region       String
  municipality String?
  district     String?
  community    String?
  address      String?
  capacity     Int      @default(0)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model SchoolSuggestion {
  id           String          @id @default(cuid())
  studentId    String
  name         String
  region       String?
  municipality String?
  district     String?
  community    String?
  address      String?
  status       PlacementStatus @default(PENDING)
  reviewedById String?
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
}
```

### Placements

```prisma
model Placement {
  id             String          @id @default(cuid())
  requestCode    String          @unique
  studentId      String
  schoolId       String?
  schoolName     String
  region         String
  municipality   String?
  community      String?
  supervisorId   String?
  status         PlacementStatus @default(PENDING)
  requestedAt    DateTime        @default(now())
  decidedAt      DateTime?
  decidedById    String?
  rejectionReason String?
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}
```

### Internship letter template

```prisma
model InternshipLetterTemplate {
  id                 String   @id @default(cuid())
  title              String
  logoUrl            String?
  letterhead         String
  letterheadSubline  String?
  body               String
  footerContact      String?
  isActive           Boolean  @default(true)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model LetterSignatory {
  id         String @id @default(cuid())
  templateId String
  name       String
  title      String?
  sortOrder  Int    @default(0)
}

model GeneratedLetter {
  id          String   @id @default(cuid())
  studentId   String
  placementId String?
  templateId  String
  fileUrl     String?
  generatedAt DateTime @default(now())
}
```

### IRB/Whitebook template and submissions

```prisma
model IrbTemplate {
  id        String   @id @default(cuid())
  name      String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model IrbSection {
  id          String   @id @default(cuid())
  templateId  String
  title       String
  subtitle    String?
  sortOrder   Int
  isFixed     Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model IrbField {
  id          String    @id @default(cuid())
  sectionId   String
  label       String
  type        FieldType
  required    Boolean   @default(false)
  sortOrder   Int
  options     Json?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model IrbSubmission {
  id          String       @id @default(cuid())
  studentId   String
  sectionId   String
  status      ReviewStatus @default(DRAFT)
  values      Json
  submittedAt DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

### Lesson note format and lesson notes

```prisma
model LessonNoteFormat {
  id           String   @id @default(cuid())
  name         String
  modeDefault  String   @default("Weekly")
  fontSize     String   @default("12px")
  headingSize  String   @default("16px")
  lineHeight   String   @default("1.65")
  tableDensity String   @default("Comfortable")
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model LessonNoteField {
  id        String    @id @default(cuid())
  formatId  String
  label     String
  type      FieldType
  required  Boolean   @default(false)
  sortOrder Int
}

model LessonNote {
  id                    String       @id @default(cuid())
  lessonCode            String       @unique
  studentId             String
  placementId           String?
  planType              String       @default("Weekly")
  subject               String
  topic                 String
  week                  String?
  weekEnding            DateTime?
  className             String?
  learningIndicators    String?
  performanceIndicators String?
  resources             String?
  termOverview          String?
  assessmentPlan        String?
  mentorStatus          ReviewStatus @default(PENDING)
  supervisorStatus      ReviewStatus @default(PENDING)
  supervisorComment     String?
  submittedAt           DateTime?
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt
}

model LessonNoteDay {
  id           String @id @default(cuid())
  lessonNoteId String
  day          String
  starter      String?
  main         String?
  reflection   String?
  sortOrder    Int
}
```

### Visits

```prisma
model Visit {
  id               String      @id @default(cuid())
  visitCode         String      @unique
  studentId         String
  placementId       String?
  supervisorId      String
  schoolId          String?
  schoolName        String
  startDate         DateTime
  endDate           DateTime
  preferredTime     String?
  rescheduledDate   DateTime?
  rescheduledTime   String?
  rescheduleReason  String?
  status            VisitStatus @default(SCHEDULED)
  completedAt       DateTime?
  completionNote    String?
  createdById       String?
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
}
```

### Notifications

```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String?
  title     String
  message   String
  type      NotificationType
  read      Boolean          @default(false)
  createdAt DateTime         @default(now())
}

model DeviceToken {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  platform  String?
  createdAt DateTime @default(now())
}
```

### Appearance and settings

```prisma
model AppearancePreference {
  id          String   @id @default(cuid())
  userId      String   @unique
  theme       String   @default("light")
  style       String   @default("maia")
  baseColor   String   @default("neutral")
  themeColor  String   @default("indigo")
  chartColor  String   @default("indigo")
  radius      String   @default("rounded")
  font        String   @default("Inter")
  heading     String   @default("medium")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SystemSetting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Files, uploads, and audit

```prisma
model FileAsset {
  id          String   @id @default(cuid())
  ownerId     String?
  entityType  String?
  entityId    String?
  fileName    String
  mimeType    String
  size        Int?
  url         String
  createdAt   DateTime @default(now())
}

model BulkUpload {
  id          String   @id @default(cuid())
  uploadedById String
  type        String
  fileAssetId String?
  status      String
  summary     Json?
  createdAt   DateTime @default(now())
}

model AuditLog {
  id          String   @id @default(cuid())
  actorId     String?
  action      String
  entityType  String
  entityId    String?
  before      Json?
  after       Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
}
```

## 5. Important backend rules

- A student can only submit placement requests for themselves.
- A student can add a school suggestion if the school is not found.
- A coordinator must approve placement before it becomes active.
- Supervisors can belong to multiple regions.
- A coordinator schedules a visit window using a start and end date.
- A supervisor can reschedule the exact visit date.
- A student must see the rescheduled visit date.
- IRB template configuration belongs to coordinators only.
- Students fill IRB sections but do not configure them.
- Lesson note format configuration belongs to coordinators only.
- Students fill lesson notes using the active format.
- Mentor review is recorded in the student lesson-note workflow; mentors do not need full accounts.
- Supervisor review happens on the full lesson note page.
- Every important action should write an audit log.
- Every important workflow change should create a notification.
