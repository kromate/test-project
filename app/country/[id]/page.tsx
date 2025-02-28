'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from '../../../components/Icons';
import Header from '../../../components/Header';

type Country = {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  population: number;
  region: string;
  subregion?: string;
  capital?: string[];
  flags: {
    svg: string;
    png: string;
  };
  tld?: string[];
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
  borders?: string[];
  cca3: string;
};

export default function CountryDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [country, setCountry] = useState<Country | null>(null);
  const [borderCountries, setBorderCountries] = useState<{ name: string; code: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        // Try API first
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${id}`);
        
        if (!response.ok) {
          // If API fails, use local data
          const localResponse = await fetch('/data.json');
          const allCountries = await localResponse.json();
          const countryData = allCountries.find((c: Country) => c.cca3 === id);
          
          if (!countryData) {
            throw new Error('Country not found');
          }
          
          setCountry(countryData);
          
          // Find border countries from local data
          if (countryData.borders && countryData.borders.length > 0) {
            const borderData = countryData.borders.map((borderCode: string) => {
              const borderCountry = allCountries.find((c: Country) => c.cca3 === borderCode);
              return {
                name: borderCountry?.name.common || borderCode,
                code: borderCode
              };
            });
            setBorderCountries(borderData);
          }
        } else {
          const data = await response.json();
          const countryData = data[0];
          setCountry(countryData);
          
          // Fetch border countries from API
          if (countryData.borders && countryData.borders.length > 0) {
            const borderResponse = await fetch(
              `https://restcountries.com/v3.1/alpha?codes=${countryData.borders.join(',')}`
            );
            
            if (borderResponse.ok) {
              const borderData = await borderResponse.json();
              const formattedBorders = borderData.map((border: Country) => ({
                name: border.name.common,
                code: border.cca3
              }));
              setBorderCountries(formattedBorders);
            }
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching country:', err);
        setError('Failed to load country details. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchCountry();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-very-light-gray dark:bg-very-dark-blue-dm transition-colors duration-300">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-very-dark-blue-lm dark:text-white">Loading country details...</p>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-very-light-gray dark:bg-very-dark-blue-dm transition-colors duration-300">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-red-500">{error || 'Country not found'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 inline-flex items-center px-6 py-3 bg-white dark:bg-dark-blue shadow-md rounded-md text-very-dark-blue-lm dark:text-white"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>
      </div>
    );
  }

  // Helper function to extract values from objects
  const getValues = (obj: Record<string, any> | undefined): string => {
    if (!obj) return 'N/A';
    return Object.values(obj).map((val) => 
      typeof val === 'object' && val !== null && 'name' in val ? val.name : val
    ).join(', ');
  };

  // Get native name if available
  const getNativeName = (): string => {
    if (!country.name.nativeName) return 'N/A';
    const nativeNames = Object.values(country.name.nativeName);
    return nativeNames.length > 0 ? nativeNames[0].common : 'N/A';
  };

  return (
    <div className="min-h-screen bg-very-light-gray dark:bg-very-dark-blue-dm transition-colors duration-300">
      <Header />
      <div className="container mx-auto px-6 py-16">
        <Link href="/">
          <button className="flex items-center gap-2 px-8 py-2 shadow-md rounded-md bg-white dark:bg-dark-blue text-very-dark-blue-lm dark:text-white mb-16">
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
        </Link>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 items-center">
          <div className="relative aspect-[4/3] w-full max-w-2xl shadow-md">
            <Image
              src={country.flags.svg || country.flags.png}
              alt={`Flag of ${country.name.common}`}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-8 text-very-dark-blue-lm dark:text-white">
              {country.name.common}
            </h1>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-12">
              <div className="space-y-3 text-very-dark-blue-lm dark:text-white">
                <p><span className="font-semibold">Native Name:</span> {getNativeName()}</p>
                <p><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
                <p><span className="font-semibold">Region:</span> {country.region}</p>
                <p><span className="font-semibold">Sub Region:</span> {country.subregion || 'N/A'}</p>
                <p><span className="font-semibold">Capital:</span> {country.capital?.join(', ') || 'N/A'}</p>
              </div>

              <div className="space-y-3 text-very-dark-blue-lm dark:text-white">
                <p><span className="font-semibold">Top Level Domain:</span> {country.tld?.join(', ') || 'N/A'}</p>
                <p><span className="font-semibold">Currencies:</span> {getValues(country.currencies)}</p>
                <p><span className="font-semibold">Languages:</span> {getValues(country.languages)}</p>
              </div>
            </div>

            {borderCountries.length > 0 && (
              <div className="text-very-dark-blue-lm dark:text-white">
                <h2 className="font-semibold text-lg mb-4">Border Countries:</h2>
                <div className="flex flex-wrap gap-3">
                  {borderCountries.map((border) => (
                    <Link key={border.code} href={`/country/${border.code}`}>
                      <span className="inline-block px-6 py-1 bg-white dark:bg-dark-blue shadow-md rounded-sm text-very-dark-blue-lm dark:text-white text-sm">
                        {border.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 