import { Menu, X, CreditCard, Table, Images, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/use-storage';
import { useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ isOpen, onClose, currentPage, onPageChange }: SidebarProps) {
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const toggleDarkMode = () => {
    updateSettings({ ...settings, darkMode: !settings.darkMode });
  };

  const menuItems = [
    { id: 'cards', label: 'Cards', icon: CreditCard, color: 'text-blue-500' },
    { id: 'excel', label: 'Excel', icon: Table, color: 'text-green-500' },
    { id: 'gallery', label: 'Gallery', icon: Images, color: 'text-pink-500' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 overlay active"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <nav className={`slide-menu fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl z-40 ${isOpen ? 'open' : ''}`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Card Manager</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Personal Data Manager</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <ul className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="mb-2">
                <button
                  onClick={() => {
                    onPageChange(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className={`${item.color} mr-3 h-5 w-5`} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={toggleDarkMode}
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            {settings.darkMode ? (
              <>
                <Sun className="mr-2 h-4 w-4" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4" />
                Dark Mode
              </>
            )}
          </Button>
        </div>
      </nav>
    </>
  );
}
