import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 py-10 px-4 md:px-8 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center text-white font-black text-xs">C</div>
          <span className="font-black text-white">CineLens</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          {[
            { to: '/', label: 'Home' },
            { to: '/movies', label: 'Movies' },
            { to: '/genre/28', label: 'Action' },
            { to: '/genre/878', label: 'Sci-Fi' },
            { to: '/search', label: 'Search' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="hover:text-white transition-colors">{label}</Link>
          ))}
        </div>
        <p className="text-xs text-gray-600">
          Data from <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="text-fuchsia-500 hover:underline">TMDB</a>
        </p>
      </div>
    </footer>
  );
}
