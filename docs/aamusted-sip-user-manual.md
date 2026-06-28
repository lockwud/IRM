# AAMUSTED SIP Portal User Manual

This guide explains how the Student Internship Programme portal works from coordinator setup through student and supervisor use.

## 1. Getting started

The system has three portals:

- Coordinator Portal: manages programme data, configurations, staff onboarding, records, reports, support tickets and templates.
- Supervisor Portal: manages assigned interns, supervision visits and lesson note reviews.
- Student Portal: lets students record their accepted placement school, download internship documents, fill IRB pages, prepare lesson notes and raise support tickets.

### Login rules

- Students can log in with their school email or index number.
- A newly created student’s first password is their index number, for example `5221040348`.
- Staff and coordinators use the account details created during staff onboarding.
- New users should change their password after first login.

If login fails, confirm that you selected the correct portal role on the login page.

## 2. Coordinator workflow

### Dashboard

The coordinator dashboard gives a live overview of the programme:

- Total students
- Active placements
- Pending records or actions
- Completed SIP records
- Recent activity
- Upcoming supervisor visits
- Support tickets

Use the date filters such as Today, This week, This month and All time to view dashboard data for a selected period.

### Student management

The coordinator can:

- Add students.
- View student records.
- Check student account details.
- See placement, region, programme and status.

When a student is added, the system creates an account for that student. The default student password is the student index number.

### Staff onboarding

The coordinator can onboard:

- Coordinators
- Supervisors
- Other approved staff users

Supervisors can be assigned to more than one region. Their staff ID should be generated or filled automatically where possible, and their account should be created during onboarding.

### School directory

The coordinator maintains the list of approved or known schools.

Students may still add a school if their accepted school is not found. Those suggestions can be reviewed and kept in the school directory.

Schools include:

- Region
- Municipality or district
- Community or town
- School category
- Available spaces or capacity

### Placement workflow

The student chooses the school where they have been accepted for internship.

The coordinator does not need to approve the student’s school choice as a placement decision. The coordinator’s role is mainly to keep records, assign supervisors and maintain programme visibility.

Typical placement flow:

1. Student downloads or fills the internship letter.
2. Student submits the letter to a school.
3. If accepted, the student records the accepted school in the Student Portal.
4. If the school is not listed, the student can add it.
5. Coordinator sees the placement record and may assign a supervisor.

### Supervisor assignment

Coordinators assign supervisors to students after placement records are available.

A supervisor can supervise interns across multiple regions, so region assignment should not be limited to one region.

### Visit scheduling

The coordinator can schedule supervision visit windows. A visit schedule should use a date range, not only a single date.

Supervisors can reschedule visits where needed. Students should see the latest visit window in their portal.

### IRB configuration

The coordinator configures the digital Internship Record Book.

The fixed current IRB sections are:

- IRB 1 — School Familiarization
- IRB 2 — Observation of Mentor Lessons
- IRB 3 — Curriculum Planning
- IRB 4 — Lesson Planning
- IRB 5 — Teaching Practice

From IRB 6 onward, the coordinator can add future configurable sections with:

- Section title
- Instructions or subtitle
- Fields
- Field type
- Required or optional setting

Students only fill the IRB. They do not configure it.

### IRB submissions

The coordinator can view submitted IRB records and delete records where necessary. This section is for submitted data, not analytics.

### Lesson note format configuration

The coordinator configures the lesson note structure used by students.

The lesson note format should support:

- Weekly notes
- Optional termly notes
- Subject
- Topic
- Week ending date
- Week
- Class
- Learning indicators
- Performance indicators
- Teaching and learning resources
- Teaching days selected by the student
- Starter, main activity and reflection for each selected day

### Internship letter configuration

The coordinator manages the internship letter template:

- Letterhead
- Logo
- Institution name
- School name placeholders
- Letter body
- Signatories
- Footer information

The coordinator can save and download the template. Students download completed letters with their personal and placement details merged into the template.

### Support desk

Students and supervisors can raise support tickets. The coordinator handles support tickets through the Support Desk.

Support works like a ticket queue with a chat-style response area. The coordinator can respond to tickets and track their status.

### Reports and audit logs

The coordinator can generate reports for:

- Student placement records
- Supervisor workload
- IRB completion
- Lesson note activity
- Visit records
- Support activity

Audit logs show important actions such as account creation, placement updates, supervisor assignment and template changes.

## 3. Student workflow

### Student dashboard

The student dashboard shows:

- Accepted placement school
- IRB progress
- Lesson note status
- Next supervisor visit
- Notifications

Students should only see their own data.

### Recording an accepted school

The student chooses the school that accepted their internship letter.

If the school is in the directory:

1. Open My Placement.
2. Select the accepted school.
3. Save the placement record.

If the school is not found:

1. Click the school-not-found option.
2. Enter the school name.
3. Select region.
4. Select municipality or district.
5. Select community or town.
6. Save the new accepted school.

The internship letter should update to use the selected accepted school.

### Internship letter

Students use the Documents page to:

- Fill or confirm student details.
- Confirm accepted school details.
- Preview the internship letter.
- Download the completed letter as PDF.

The student submits the letter to the school in person or by email.

### IRB

Students fill the IRB sections configured by the coordinator.

Students can:

- Select an IRB section.
- Fill only the fields for that section.
- Save draft.
- Submit the page.
- Preview the filled sheet in portrait format.
- Download an individual section as PDF.

The student does not need to complete all sections before previewing a section.

### Lesson notes

Students can create weekly or termly lesson notes.

Default mode is weekly. Termly is optional.

Lesson note creation flow:

1. Open Lesson Notes.
2. Choose weekly or termly.
3. Click Create lesson note.
4. Enter subject, topic, class, week and week-ending date.
5. Enter learning indicators, performance indicators and resources.
6. Add only the teaching days that have lessons.
7. Fill starter, main activity and reflection for each selected day.
8. Preview the lesson note.
9. Save or submit.

Students can also download the completed lesson note.

### AI lesson-note guide

The AI lesson-note guide helps students draft lesson-note ideas.

Use it for:

- Learning indicators
- Performance indicators
- Resources
- Starter activities
- Main activities
- Reflections

The AI chat opens as a side assistant. Chat history is saved to the backend database for the logged-in student.

If chat history shows a permission error, restart the backend after applying the latest build and migrations.

### Support

Students can click Contact support to raise a ticket. The coordinator responds through the support desk.

## 4. Supervisor workflow

### Dashboard

The supervisor dashboard shows:

- Assigned interns
- Pending lesson reviews
- Upcoming visits
- Average IRB progress
- Completed visits

The supervisor should only see students assigned to them.

### Assigned interns

Supervisors can view assigned interns and their progress.

They can check:

- Placement school
- Region and municipality
- IRB progress
- Lesson note status
- Visit status

### Lesson note review

Lesson note review opens as a full page, not a modal.

The supervisor can:

- Review the full lesson note.
- Add comments at relevant sections.
- Approve the lesson note.
- Request revision.

The review page should remain clear on mobile and desktop.

### Visit schedule

Supervisors can view scheduled visits and reschedule them where necessary. Visit schedules use date ranges.

Students can see the updated supervision visit window.

### Support

Supervisors can raise support tickets if they need help with account access, assigned students, visit schedules or review workflow.

## 5. Mobile and home screen use

The Student Portal and Supervisor Portal are designed to work on mobile browsers and as installable web apps.

### iPhone or iPad

1. Open Safari.
2. Go to the portal URL.
3. Log in or open the correct login role page.
4. Tap the Share button.
5. Tap Add to Home Screen.
6. Confirm the app name.

The app will open in a standalone view from the home screen.

### Android

1. Open Chrome.
2. Go to the portal URL.
3. Tap the browser menu.
4. Tap Add to Home screen or Install app.
5. Confirm.

### Mobile tips

- Use portrait orientation.
- Keep the browser updated.
- If a screen looks old after an update, refresh the page or clear site cache.
- Tables and long forms should scroll inside their content area instead of breaking the whole page.

## 6. AI and backend setup notes

The AI lesson-note guide uses Gemini when configured.

Backend environment variables:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash
```

AI chat history uses PostgreSQL. After pulling the latest backend changes, run:

```bash
cd /home/python/Documents/project/Irm_backend
npx prisma migrate dev
npx prisma generate
```

Then restart the backend server.

If the backend was already running before the AI history routes were added, restart it. Otherwise the browser may still receive old 403 responses.

## 7. Common troubleshooting

### Student sees all students

The student dashboard should use student-specific endpoints only. Log out and log in again as a student. If the problem continues, check that the frontend is not calling coordinator-only endpoints from student pages.

### 403 permission error

This means the logged-in role cannot access that endpoint, or the backend is still running an old build.

Fix:

1. Confirm the correct portal role.
2. Restart the backend.
3. Rebuild the backend if running from compiled output.
4. Confirm migrations were applied.

### AI history does not load

Confirm:

- Student is logged in.
- Backend has the AI routes.
- PostgreSQL migration for AI chat tables has been applied.
- Backend has been restarted.

### Student cannot log in after being added

Use the student email or index number. The first password is the student index number.

Example:

- Email: `5221040348@st.aamusted.edu.gh`
- Initial password: `5221040348`

### Internship letter shows the wrong school

Record the accepted school again from My Placement. The Documents page should use the student’s active accepted placement.

## 8. Recommended operating flow

1. Coordinator sets programme settings and templates.
2. Coordinator onboards staff and students.
3. Coordinator configures IRB and lesson-note formats.
4. Student logs in and changes password if required.
5. Student downloads internship letter.
6. Student submits letter to a school.
7. Student records the accepted school.
8. Coordinator assigns supervisor.
9. Coordinator schedules supervision visit range.
10. Supervisor reviews assigned interns and visit schedule.
11. Student fills IRB sections.
12. Student prepares lesson notes.
13. Mentor reviews lesson notes first.
14. Supervisor reviews and approves or requests revision.
15. Student and supervisor raise support tickets when needed.
16. Coordinator monitors support, reports and audit logs.

