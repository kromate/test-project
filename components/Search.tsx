'use client';
import { useState } from 'react';
import { SearchIcon, ChevronDownIcon } from './Icons';

type SearchProps = {
  onSearch: (searchTerm: string) => void;
  onRegionChange: (region: string) => void;
};

export default function Search({ onSearch, onRegionChange }: SearchProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'All'];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleRegionSelect = (region: string) => {
    const newRegion = region === 'All' ? '' : region;
    setSelectedRegion(newRegion);
    onRegionChange(newRegion);
    setIsDropdownOpen(false);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-0">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between md:items-center">
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-dark-gray dark:text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for a country..."
            onChange={handleSearchChange}
            className="w-full py-4 pl-16 pr-4 shadow-md rounded-lg bg-white dark:bg-dark-blue text-very-dark-blue-lm dark:text-white focus:outline-none"
          />
        </div>

        <div className="relative w-52">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between py-4 px-6 shadow-md rounded-lg bg-white dark:bg-dark-blue text-very-dark-blue-lm dark:text-white focus:outline-none"
          >
            <span>{selectedRegion || 'Filter by Region'}</span>
            <ChevronDownIcon className="h-5 w-5" />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-lg shadow-lg bg-white dark:bg-dark-blue">
              <ul className="py-2">
                {regions.map((region) => (
                  <li
                    key={region}
                    onClick={() => handleRegionSelect(region)}
                    className="px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-very-dark-blue-lm dark:text-white cursor-pointer"
                  >
                    {region}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 