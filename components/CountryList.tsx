'use client';
import { useState, useEffect } from 'react';
import CountryCard from './CountryCard';
import Search from './Search';

type Country = {
  name: {
    common: string;
    official: string;
  };
  population: number;
  region: string;
  capital?: string[];
  flags: {
    svg: string;
    png: string;
  };
  cca3: string;
};

export default function CountryList() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch('https://restcountries.com/v3.1/all');
        
        // If API fails, use local data
        if (!response.ok) {
          const localData = await fetch('/data.json');
          const data = await localData.json();
          setCountries(data);
          setFilteredCountries(data);
        } else {
          const data = await response.json();
          setCountries(data);
          setFilteredCountries(data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching countries:', err);
        
        // Try to use local data as fallback
        try {
          const localData = await fetch('/data.json');
          const data = await localData.json();
          setCountries(data);
          setFilteredCountries(data);
          setLoading(false);
        } catch (fallbackErr) {
          setError('Failed to load countries. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    // Filter countries based on search term and region
    const results = countries.filter((country) => {
      const matchesSearch = country.name.common
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion 
        ? country.region === selectedRegion 
        : true;
      
      return matchesSearch && matchesRegion;
    });
    
    setFilteredCountries(results);
  }, [searchTerm, selectedRegion, countries]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-very-dark-blue-lm dark:text-white">Loading countries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Search onSearch={handleSearch} onRegionChange={handleRegionChange} />
      
      {filteredCountries.length === 0 ? (
        <div className="container mx-auto px-4 py-16 text-center text-very-dark-blue-lm dark:text-white">
          <p>No countries found matching your criteria.</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16">
            {filteredCountries.map((country) => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 