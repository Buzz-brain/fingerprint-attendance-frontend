import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Students', path: '/students' },
    { name: 'Devices', path: '/devices' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 z-50 h-full w-64 border-l bg-card shadow-xl md:hidden"
          >
            <div className="flex items-center justify-between border-b p-4">
              <span className="text-lg font-semibold">Menu</span>
              <button
                onClick={onClose}
                className="rounded-lg p-2 transition-colors hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
