import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { MobileMenu } from './MobileMenu';

export const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Check if user is authenticated and get username
  function parseJwt(token) {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }
  function isTokenValid(token) {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return false;
    return Date.now() < payload.exp * 1000;
  }
  const token = localStorage.getItem('token');
  const isAuthenticated = isTokenValid(token);
  const user = isAuthenticated ? parseJwt(token) : null;

  const { toast } = useToast();

  useEffect(() => {
    // Show login toast if just logged in
    if (isAuthenticated && location.state && location.state.justLoggedIn) {
      toast({ title: `Welcome, ${user?.username || 'User'}!`, description: 'You are now logged in.' });
      // Remove state so it doesn't show again
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast({ title: 'Logged out', description: 'You have been logged out.' });
    navigate('/login');
  };

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Students', path: '/students' },
    // { name: 'Devices', path: '/devices' }, 
    // { name: 'Reports', path: '/reports' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
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

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-lg"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>


            {isAuthenticated && (
              <>
                <span className="text-sm text-muted-foreground mr-2">{user?.username}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </nav>
  );
};
