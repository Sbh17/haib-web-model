
import React, { useState, useEffect } from 'react';
import { Clock, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SearchSuggestionsProps {
  onSearchSelect: (query: string) => void;
  className?: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ onSearchSelect, className = '' }) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const trendingSearches = [
    'Hair cut and styling',
    'Manicure and pedicure',
    'Facial treatment',
    'Hair coloring',
    'Eyebrow threading',
    'Massage therapy'
  ];

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const handleSearchSelect = (query: string) => {
    // Add to recent searches
    const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
    onSearchSelect(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <Card className={`p-4 ${className}`}>
      {recentSearches.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-sm font-medium text-gray-700">
              <Clock className="h-4 w-4 mr-2" />
              Recent Searches
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearRecentSearches}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </Button>
          </div>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-auto p-2 text-sm"
                onClick={() => handleSearchSelect(search)}
              >
                <Search className="h-3 w-3 mr-2 text-gray-400" />
                {search}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <div className="flex items-center mb-3 text-sm font-medium text-gray-700">
          <TrendingUp className="h-4 w-4 mr-2" />
          Popular Searches
        </div>
        <div className="space-y-2">
          {trendingSearches.map((search, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left h-auto p-2 text-sm"
              onClick={() => handleSearchSelect(search)}
            >
              <Search className="h-3 w-3 mr-2 text-gray-400" />
              {search}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SearchSuggestions;
