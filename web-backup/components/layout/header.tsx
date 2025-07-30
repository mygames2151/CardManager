import { Menu, Plus, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  currentPage: string;
  onMenuOpen: () => void;
  onAddClick?: () => void;
}

export function Header({ currentPage, onMenuOpen, onAddClick }: HeaderProps) {
  const pageTitle = {
    cards: 'Cards',
    excel: 'Excel',
    gallery: 'Gallery',
  }[currentPage] || 'App';

  const showAddButton = currentPage === 'cards' || currentPage === 'excel';
  const addIcon = currentPage === 'excel' ? FileSpreadsheet : Plus;
  const AddIcon = addIcon;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuOpen}
            className="mr-4 p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{pageTitle}</h1>
        </div>
        
        {showAddButton && onAddClick && (
          <Button
            onClick={onAddClick}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2"
            size="sm"
          >
            <AddIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
