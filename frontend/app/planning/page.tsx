"use client";
import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Select from "../components/Form/Select";
import Modal from "../components/Modal/Modal";
import { useModal } from "../lib/hooks/useModal";
import Input from "../components/Form/Input";
import Textarea from "../components/Form/Textarea";

interface LessonEvent {
  id: string;
  date: string;
  title: string;
  school: string;
  mentor: string;
  time: string;
  description?: string;
}

// Mock data
const mockEvents: LessonEvent[] = [
  {
    id: "1",
    date: "2024-04-01",
    title: "Database Design Workshop",
    school: "USTED",
    mentor: "Mr. Addo",
    time: "10:00 AM",
    description: "Learning database normalization and design principles",
  },
  {
    id: "2",
    date: "2024-04-05",
    title: "Web Development Basics",
    school: "STEP",
    mentor: "Ms. Owusu",
    time: "2:00 PM",
    description: "Introduction to HTML, CSS, and JavaScript",
  },
  {
    id: "3",
    date: "2024-04-10",
    title: "Security Protocols",
    school: "USTED",
    mentor: "Dr. Mensah",
    time: "11:00 AM",
    description: "Understanding cybersecurity best practices",
  },
];

export default function PlanningPage() {
  const { isOpen, open, close } = useModal();
  const [events, setEvents] = useState<LessonEvent[]>(mockEvents);
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 3, 1));
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    school: "",
    mentor: "",
    description: "",
  });

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const handleAddEvent = () => {
    const newId = (Math.max(...events.map(e => parseInt(e.id))) + 1).toString();
    setEvents([
      ...events,
      {
        id: newId,
        ...newEvent,
      },
    ]);
    setNewEvent({
      title: "",
      date: "",
      time: "",
      school: "",
      mentor: "",
      description: "",
    });
    close();
  };

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lesson Planning</h1>
          <p className="text-gray-600 mt-1">Schedule and plan your lessons</p>
        </div>
        <Button variant="primary" onClick={open}>
          + Schedule Lesson
        </Button>
      </div>

      {/* View Selector */}
      <Card className="p-4 flex items-center gap-2">
        {(["month", "week", "day"] as const).map((mode) => (
          <Button
            key={mode}
            variant={viewMode === mode ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode(mode)}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button>
        ))}
      </Card>

      {/* Calendar Controls */}
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
          >
            ← Previous
          </Button>
          <h2 className="text-xl font-bold min-w-[200px] text-center">{monthName}</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
          >
            Next →
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(new Date())}
        >
          Today
        </Button>
      </Card>

      {/* Calendar Grid */}
      <Card className="p-6 overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 mb-6">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-700 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] bg-gray-50 rounded-lg" />
          ))}

          {/* Days of month */}
          {days.map((day) => {
            const dayEvents = getEventsForDate(day);
            const isToday =
              day === new Date().getDate() &&
              currentMonth.getMonth() === new Date().getMonth() &&
              currentMonth.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={day}
                className={`min-h-[100px] p-2 rounded-lg border-2 ${
                  isToday ? "border-aamusted-gold bg-aamusted-gold/5" : "border-gray-200 bg-white"
                } hover:shadow-md transition-shadow`}
              >
                <p className={`text-sm font-semibold ${isToday ? "text-aamusted-blue" : "text-gray-700"}`}>
                  {day}
                </p>
                <div className="space-y-1 mt-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div key={event.id} className="text-xs bg-blue-100 text-blue-700 p-1 rounded truncate">
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <p className="text-xs text-gray-500">+{dayEvents.length - 2} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Events List */}
      {events.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Lessons</h2>
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-aamusted-gold/20 rounded-lg flex items-center justify-center">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-aamusted-blue">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {event.school} • {event.mentor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add Lesson Modal */}
      <Modal isOpen={isOpen} onClose={close} title="Schedule New Lesson" size="lg">
        <div className="space-y-4">
          <Input
            label="Lesson Title"
            placeholder="e.g., Database Design Workshop"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <Input
            label="Date"
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <Input
            label="Time"
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
          />
          <Select
            label="School"
            options={[
              { value: "USTED", label: "USTED" },
              { value: "STEP", label: "STEP" },
            ]}
            value={newEvent.school}
            onChange={(value) => setNewEvent({ ...newEvent, school: value as string })}
          />
          <Input
            label="Mentor Name"
            placeholder="e.g., Mr. Addo"
            value={newEvent.mentor}
            onChange={(e) => setNewEvent({ ...newEvent, mentor: e.target.value })}
          />
          <Textarea
            label="Description (Optional)"
            placeholder="Add lesson details..."
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            rows={4}
          />
          <div className="flex gap-2 pt-4">
            <Button variant="primary" onClick={handleAddEvent}>
              Schedule Lesson
            </Button>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
