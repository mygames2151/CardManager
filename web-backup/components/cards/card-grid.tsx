import { Card } from '@shared/schema';
import { MoreVertical, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CardGridProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (card: Card) => void;
}

export function CardGrid({ cards, onCardClick, onEditCard, onDeleteCard }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">No cards yet</h3>
        <p className="text-gray-500 dark:text-gray-500">Add your first card to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`rounded-xl p-4 shadow-md relative cursor-pointer ${
            card.gender === 'male' ? 'male-card' : 'female-card'
          }`}
          onClick={() => onCardClick(card)}
        >
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-gray-200 p-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onEditCard(card)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDeleteCard(card)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="text-center">
            {card.profilePicture ? (
              <img
                src={card.profilePicture}
                alt={`${card.firstName} ${card.surname}`}
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-white"
              />
            ) : (
              <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-white bg-opacity-20 flex items-center justify-center border-2 border-white">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
            
            <div className="text-white">
              <h3 className="font-semibold text-sm">{card.firstName} {card.surname}</h3>
              <p className="text-xs opacity-90">ID: {card.idNumber}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
