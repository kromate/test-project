import Image from 'next/image';
import Link from 'next/link';

type CountryCardProps = {
  country: {
    name: {
      common: string;
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
};

export default function CountryCard({ country }: CountryCardProps) {
  return (
    <Link href={`/country/${country.cca3}`}>
      <div className="bg-white dark:bg-dark-blue rounded-lg shadow-md overflow-hidden h-full hover:transform hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="relative h-48 w-full">
          <Image
            src={country.flags.svg || country.flags.png}
            alt={`Flag of ${country.name.common}`}
            fill
            style={{ objectFit: 'cover' }}
            priority={false}
          />
        </div>
        <div className="p-6">
          <h2 className="font-bold text-lg mb-4 text-very-dark-blue-lm dark:text-white">
            {country.name.common}
          </h2>
          <div className="text-sm space-y-1 text-very-dark-blue-lm dark:text-white">
            <p>
              <span className="font-semibold">Population:</span>{' '}
              {country.population.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Region:</span> {country.region}
            </p>
            <p>
              <span className="font-semibold">Capital:</span>{' '}
              {country.capital?.join(', ') || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
} 