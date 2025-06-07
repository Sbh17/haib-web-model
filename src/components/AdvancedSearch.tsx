
import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Clock, DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Salon, Service } from '@/types';
import { cn } from '@/lib/utils';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

export interface SearchFilters {
  query: string;
  location: string;
  priceRange: [number, number];
  rating: number;
  services: string[];
  sortBy: 'relevance' | 'rating' | 'price' | 'distance';
  availability: 'any' | 'today' | 'tomorrow' | 'week';
}

const serviceCategories = [
  'Hair Cut & Styling',
  'Hair Coloring',
  'Manicure & Pedicure',
  'Facial Treatment',
  'Massage Therapy',
  'Eyebrow & Lashes',
  'Makeup',
  'Waxing',
  'Skin Care'
];

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    priceRange: [0, 200],
    rating: 0,
    services: [],
    sortBy: 'relevance',
    availability: 'any'
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    // Update active filters for display
    const active: string[] = [];
    if (filters.query) active.push(`"${filters.query}"`);
    if (filters.location) active.push(`Near ${filters.location}`);
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) {
      active.push(`$${filters.priceRange[0]}-$${filters.priceRange[1]}`);
    }
    if (filters.rating > 0) active.push(`${filters.rating}+ stars`);
    if (filters.services.length > 0) {
      active.push(`${filters.services.length} service${filters.services.length > 1 ? 's' : ''}`);
    }
    if (filters.availability !== 'any') {
      active.push(`Available ${filters.availability}`);
    }
    setActiveFilters(active);
  }, [filters]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleServiceToggle = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    handleFilterChange('services', newServices);
  };

  const clearAllFilters = () => {
    const defaultFilters: SearchFilters = {
      query: '',
      location: '',
      priceRange: [0, 200],
      rating: 0,
      services: [],
      sortBy: 'relevance',
      availability: 'any'
    };
    setFilters(defaultFilters);
    onSearch(defaultFilters);
  };

  const removeFilter = (filterText: string) => {
    if (filterText.startsWith('"') && filterText.endsWith('"')) {
      handleFilterChange('query', '');
    } else if (filterText.startsWith('Near ')) {
      handleFilterChange('location', '');
    } else if (filterText.includes('$')) {
      handleFilterChange('priceRange', [0, 200]);
    } else if (filterText.includes('stars')) {
      handleFilterChange('rating', 0);
    } else if (filterText.includes('service')) {
      handleFilterChange('services', []);
    } else if (filterText.startsWith('Available ')) {
      handleFilterChange('availability', 'any');
    }
  };

  return (
    <Card className={cn('p-4', className)}>
      {/* Main Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search salons, services..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={isExpanded ? "default" : "outline"}
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {filter}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeFilter(filter)}
              />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 text-xs">
            Clear all
          </Button>
        </div>
      )}

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="space-y-6 pt-4 border-t">
          {/* Sort By */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sort by</label>
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="distance">Nearest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-3 block flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange('priceRange', value)}
              max={200}
              step={10}
              className="w-full"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="text-sm font-medium mb-3 block flex items-center">
              <Star className="h-4 w-4 mr-1" />
              Minimum Rating
            </label>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map((rating) => (
                <Button
                  key={rating}
                  variant={filters.rating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange('rating', rating)}
                  className="flex items-center gap-1"
                >
                  <Star className="h-3 w-3" />
                  {rating === 0 ? 'Any' : `${rating}+`}
                </Button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="text-sm font-medium mb-3 block flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Availability
            </label>
            <Select value={filters.availability} onValueChange={(value) => handleFilterChange('availability', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any time</SelectItem>
                <SelectItem value="today">Available today</SelectItem>
                <SelectItem value="tomorrow">Available tomorrow</SelectItem>
                <SelectItem value="week">Available this week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Services */}
          <div>
            <label className="text-sm font-medium mb-3 block">Services</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {serviceCategories.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={filters.services.includes(service)}
                    onCheckedChange={() => handleServiceToggle(service)}
                  />
                  <label
                    htmlFor={service}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {service}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AdvancedSearch;
