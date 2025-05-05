
import React, { useState, useEffect } from 'react';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import api from '@/services/api';
import { Salon, ServiceCategory } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, MapPinIcon, FilterIcon } from 'lucide-react';
import SalonCard from '@/components/SalonCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import BottomNavigation from '@/components/BottomNavigation';

const Search: React.FC = () => {
  const { userLocation, requestLocation } = useLocationContext();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Salon[]>([]);
  const [allSalons, setAllSalons] = useState<Salon[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [salonsData, categoriesData] = await Promise.all([
          api.salons.getAll(),
          api.services.getServiceCategories()
        ]);
        
        setAllSalons(salonsData);
        setSearchResults(salonsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching search data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await api.salons.search(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleCategoryFilter = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setSearchResults(allSalons);
    } else {
      setSelectedCategory(categoryId);
      
      // Filter salons that have services in this category
      const filtered = allSalons.filter(salon => 
        salon.services.some(service => service.categoryId === categoryId)
      );
      
      setSearchResults(filtered);
    }
  };
  
  const handleLocationSearch = async () => {
    if (!userLocation) {
      requestLocation();
      return;
    }
    
    setIsSearching(true);
    try {
      const nearbySalons = await api.salons.getNearby(
        userLocation.latitude,
        userLocation.longitude,
        10 // 10km radius
      );
      setSearchResults(nearbySalons);
    } catch (error) {
      console.error('Nearby search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div className="pb-20">
      <header className="bg-white p-6 pt-12 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Find Salons</h1>
        
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search salons, services..."
            className="pr-10 beauty-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            disabled={isSearching}
          >
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="text-sm"
            onClick={handleLocationSearch}
          >
            <MapPinIcon className="h-4 w-4 mr-1" />
            {userLocation ? 'Nearby' : 'Use location'}
          </Button>
          
          <div className="flex overflow-x-auto py-2 gap-2 hide-scrollbar">
            <FilterIcon className="h-5 w-5 text-gray-500 mr-1" />
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === category.id
                    ? "bg-beauty-primary hover:bg-beauty-primary/90"
                    : "hover:bg-muted"
                }`}
                onClick={() => handleCategoryFilter(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </header>
      
      <main className="p-6">
        {isLoading || isSearching ? (
          <div className="py-12">
            <LoadingSpinner size="lg" className="mx-auto" />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {searchResults.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No salons found</p>
            <p className="text-gray-500 mt-2">Try a different search or filter</p>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Search;
