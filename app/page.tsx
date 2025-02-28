import Header from '../components/Header';
import CountryList from '../components/CountryList';

export default function Home() {
  return (
    <div className="min-h-screen bg-very-light-gray dark:bg-very-dark-blue-dm transition-colors duration-300">
      <Header />
      <main>
        <CountryList />
      </main>
    </div>
  );
}
