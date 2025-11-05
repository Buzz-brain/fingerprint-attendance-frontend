import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export function GlobalEventListener() {
  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/api/events/stream`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[SSE] Event received:', data);
        if (data.eventType === "student_registered") {
          toast({
            title: "🎉 Student Registered",
            description: `${data.studentName || data.name || "A student"} has been registered successfully!`,
            variant: "default",
          });
        } else if (data.eventType === "student_registration_failed") {
          let title = "Student Registration Failed";
          let description = "Registration failed.";
          let variant: "default" | "destructive" | undefined = "destructive";
          let style = undefined;
          if (data.reason === "duplicate" || data.reason === "duplicate_error") {
            title = "⚠️ Duplicate Registration";
            description = `A student with fingerprint ID ${data.fingerprint_id} is already registered.`;
            // Use a yellow background and dark text for warning
            style = {
              background: '#fffbe6',
              color: '#7c5700',
              border: '1px solid #ffe58f',
            };
            variant = undefined; // Don't pass variant for warning
            toast({ title, description, style });
            return;
          } else if (data.reason === "server_error") {
            title = "❌ Registration Error";
            description = `A server error occurred while registering ${data.name || "the student"}. Please try again.`;
          }
          toast({ title, description, variant, style });
        } else if (data.eventType === "attendance_marked") {
          toast({
            title: "Attendance Marked",
            description: `${data.studentName || "A student"} was marked ${data.status || ''}.`,
            variant: data.status === "absent" ? "destructive" : "default",
          });
        }
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
