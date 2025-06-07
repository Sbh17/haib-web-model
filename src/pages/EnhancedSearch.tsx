
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/context/LocationContext';
import api from '@/services/api';
import { Salon } from '@/types';
import SalonCard from '@/components/SalonCard';
import AdvancedSearch, { SearchFilters } from '@/components/AdvancedSearch';
import LoadingSpinner from '@/components/LoadingSpinner';
import BottomNavigation from '@/components/BottomNavigation';

const EnhancedSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userLocation } = useLocation();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [filteredSalons, setFilteredSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    priceRange: [0, 200],
    rating: 0,
    services: [],
    sortBy: 'relevance',
    availability: 'any'
  });

  useEffect(() => {
    const fetchSalons = async () => {
      setIsLoading(true);
      try {
        const allSalons = await api.salons.getAll();
        setSalons(allSalons);
        setFilteredSalons(allSalons);
      } catch (error) {
        console.error('Error fetching salons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalons();
  }, []);

  useEffect(() => {
    applyFilters(filters);
  }, [filters, salons]);

  const applyFilters = (currentFilters: SearchFilters) => {
    let filtered = [...salons];

    // Text search
    if (currentFilters.query) {
      const query = currentFilters.query.toLowerCase();
      filtered = filtered.filter(salon =>
        salon.name.toLowerCase().includes(query) ||
        salon.description.toLowerCase().includes(query) ||
        salon.address.toLowerCase().includes(query) ||
        salon.services.some(service => 
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
        )
      );
    }

    // Location filter
    if (currentFilters.location) {
      const location = currentFilters.location.toLowerCase();
      filtered = filtered.filter(salon =>
        salon.city.toLowerCase().includes(location) ||
        salon.address.toLowerCase().includes(location)
      );
    }

    // Rating filter
    if (currentFilters.rating > 0) {
      filtered = filtered.filter(salon => salon.rating >= currentFilters.rating);
    }

    // Price range filter
    filtered = filtered.filter(salon => {
      const salonPrices = salon.services.map(s => s.price);
      const minPrice = Math.min(...salonPrices);
      const maxPrice = Math.max(...salonPrices);
      return maxPrice >= currentFilters.priceRange[0] && minPrice <= currentFilters.priceRange[1];
    });

    // Services filter
    if (currentFilters.services.length > 0) {
      filtered = filtered.filter(salon =>
        currentFilters.services.some(serviceFilter =>
          salon.services.some(service =>
            service.name.toLowerCase().includes(serviceFilter.toLowerCase())
          )
        )
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (currentFilters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          const aMinPrice = Math.min(...a.services.map(s => s.price));
          const bMinPrice = Math.min(...b.services.map(s => s.price));
          return aMinPrice - bMinPrice;
        case 'distance':
          // For now, just random order since we don't have real coordinates
          return Math.random() - 0.5;
        default:
          return 0; // relevance - keep original order
      }
    });

    setFilteredSalons(filtered);

    // Update URL params
    const params = new URLSearchParams();
    if (currentFilters.query) params.set('q', currentFilters.query);
    if (currentFilters.location) params.set('location', currentFilters.location);
    if (currentFilters.rating > 0) params.set('rating', currentFilters.rating.toString());
    if (currentFilters.sortBy !== 'relevance') params.set('sort', currentFilters.sortBy);
    
    setSearchParams(params);
  };

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <header className="bg-beauty-primary text-white p-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={goBack} className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Search Salons</h1>
            <p className="text-sm opacity-90">
              {filteredSalons.length} salon{filteredSalons.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
      </header>

      <main className="p-4">
        {/* Advanced Search */}
        <AdvancedSearch onSearch={handleSearch} className="mb-6" />

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSalons.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No salons found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button
                  onClick={() => handleSearch({
                    query: '',
                    location: '',
                    priceRange: [0, 200],
                    rating: 0,
                    services: [],
                    sortBy: 'relevance',
                    availability: 'any'
                  })}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSalons.map(salon => (
                  <SalonCard key={salon.id} salon={salon} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default EnhancedSearch;
