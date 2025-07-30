import { useState, useEffect } from 'react';
import { Card } from '@shared/schema';
import { LocalStorage } from '@/lib/storage';
import { useCards } from '@/hooks/use-storage';
import { useToast } from '@/hooks/use-toast';
import { CardForm } from '@/components/cards/card-form';
import { CardGrid } from '@/components/cards/card-grid';
import { CardDetails } from '@/components/cards/card-details';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { FilterOptions, SortOptions } from '@/lib/types';

interface CardsPageProps {
  onShowAddForm: () => void;
  showAddForm: boolean;
  onCloseAddForm: () => void;
}

export default function CardsPage({ onShowAddForm, showAddForm, onCloseAddForm }: CardsPageProps) {
  const { cards, refreshCards } = useCards();
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortOptions>({ field: 'name', direction: 'asc' });
  const { toast } = useToast();

  useEffect(() => {
    let filtered = cards;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(card =>
        `${card.firstName} ${card.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.city) {
      filtered = filtered.filter(card => card.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }
    if (filters.identity) {
      filtered = filtered.filter(card => card.identity.toLowerCase().includes(filters.identity!.toLowerCase()));
    }
    if (filters.gender) {
      filtered = filtered.filter(card => card.gender === filters.gender);
    }
    if (filters.maritalStatus) {
      filtered = filtered.filter(card => card.maritalStatus === filters.maritalStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sort.field === 'name') {
        aValue = `${a.firstName} ${a.surname}`.toLowerCase();
        bValue = `${b.firstName} ${b.surname}`.toLowerCase();
      } else {
        aValue = a.idNumber;
        bValue = b.idNumber;
      }

      if (sort.direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    setFilteredCards(filtered);
  }, [cards, searchTerm, filters, sort]);

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
  };

  const handleDeleteCard = (card: Card) => {
    if (confirm(`Are you sure you want to delete ${card.firstName} ${card.surname}?`)) {
      LocalStorage.deleteCard(card.id);
      refreshCards();
      toast({
        title: "Card Deleted",
        description: "Card has been deleted successfully",
      });
    }
  };

  const handleFormSuccess = () => {
    refreshCards();
    setEditingCard(null);
  };

  const handleAddMedia = (cardId: string) => {
    // TODO: Implement media upload
    toast({
      title: "Add Media",
      description: "Media upload functionality will be implemented",
    });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex space-x-2">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="flex-1"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button
          onClick={() => setShowSort(!showSort)}
          variant="outline"
          className="flex-1"
        >
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort
        </Button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-card border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Filters</h3>
            <Button onClick={clearFilters} variant="ghost" size="sm">
              Clear
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">City</label>
              <Input
                placeholder="Filter by city"
                value={filters.city || ''}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Identity</label>
              <Input
                placeholder="Filter by identity"
                value={filters.identity || ''}
                onChange={(e) => setFilters({ ...filters, identity: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Gender</label>
              <Select value={filters.gender || 'all'} onValueChange={(value) => setFilters({ ...filters, gender: value === 'all' ? undefined : value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Marital Status</label>
              <Select value={filters.maritalStatus || 'all'} onValueChange={(value) => setFilters({ ...filters, maritalStatus: value === 'all' ? undefined : value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Sort Options */}
      {showSort && (
        <div className="bg-card border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold">Sort by</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Field</label>
              <Select value={sort.field} onValueChange={(value: 'name' | 'id') => setSort({ ...sort, field: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="id">ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Direction</label>
              <Select value={sort.direction} onValueChange={(value: 'asc' | 'desc') => setSort({ ...sort, direction: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">A-Z / 0-9</SelectItem>
                  <SelectItem value="desc">Z-A / 9-0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <CardGrid
        cards={filteredCards}
        onCardClick={handleCardClick}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
      />

      {/* Add/Edit Card Form */}
      <CardForm
        isOpen={showAddForm || !!editingCard}
        onClose={() => {
          onCloseAddForm();
          setEditingCard(null);
        }}
        onSuccess={handleFormSuccess}
        editCard={editingCard}
      />

      {/* Card Details */}
      <CardDetails
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onAddMedia={handleAddMedia}
      />
    </div>
  );
}
