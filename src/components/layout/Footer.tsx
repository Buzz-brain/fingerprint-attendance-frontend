import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-primary p-2">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground">AttendanceHub</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Modern attendance management system powered by ESP32 fingerprint
              authentication. Real-time tracking, comprehensive analytics, and
              enterprise-grade security.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/attendance"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Attendance
                </Link>
              </li>
              <li>
                <Link
                  to="/students"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Students
                </Link>
              </li>
              <li>
                <Link
                  to="/devices"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Devices
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Connect</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-accent"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-accent"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-accent"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-accent"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} AttendanceHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
