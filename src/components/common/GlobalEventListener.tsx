import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export function GlobalEventListener() {
  // Play a notification sound
  function playSound() {
    const ctx = new window.AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.value = 0.1;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    setTimeout(() => { o.stop(); ctx.close(); }, 180);
  }

  // Speak the toast message
  function speak(text: string) {
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.rate = 1.1;
      window.speechSynthesis.speak(utter);
    }
  }

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/api/events/stream`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[SSE] Event received:', data);
        let title = '';
        let description = '';
        let variant: "default" | "destructive" | undefined = undefined;
        let style = undefined;
        if (data.eventType === "student_registered") {
          title = "🎉 Student Registered";
          description = `${data.studentName || data.name || "A student"} has been registered successfully!`;
          variant = "default";
          toast({ title, description, variant });
          // Dispatch custom event for students update
          window.dispatchEvent(new Event('students-updated'));
        } else if (data.eventType === "student_registration_failed") {
          title = "Student Registration Failed";
          description = "Registration failed.";
          variant = "destructive";
          if (data.reason === "duplicate" || data.reason === "duplicate_error") {
            title = "⚠️ Duplicate Registration";
            description = `A student with fingerprint ID ${data.fingerprint_id} is already registered.`;
            style = {
              background: '#fffbe6',
              color: '#7c5700',
              border: '1px solid #ffe58f',
            };
            variant = undefined;
            toast({ title, description, style });
            playSound();
            speak(`${title}. ${description}`);
            return;
          } else if (data.reason === "server_error") {
            title = "❌ Registration Error";
            description = `A server error occurred while registering ${data.name || "the student"}. Please try again.`;
          }
          toast({ title, description, variant, style });
        } else if (data.eventType === "attendance_marked") {
          title = "Attendance Marked";
          description = `${data.studentName || "A student"} was marked ${data.status || ''}.`;
          variant = data.status === "absent" ? "destructive" : "default";
          toast({ title, description, variant });
          // Dispatch custom event for attendance update
          window.dispatchEvent(new Event('attendance-updated'));
        } else {
          return;
        }
        playSound();
        speak(`${title}. ${description}`);
      } catch (e) {
        console.error('[SSE] Error parsing event data:', e);
      }
    };
    eventSource.onerror = () => {
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, []);
  return null;
}
