import { NavLink } from 'react-router-dom';
import { useLang } from '../i18n/useLang';

export function TabNav() {
  const { t } = useLang();
  const baseClass =
    'flex-1 text-center px-4 py-2 font-medium text-sm border-b-2 transition-colors';
  const activeClass = 'border-blue-600 text-blue-700';
  const inactiveClass =
    'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

  return (
    <nav className="flex border-b border-gray-200">
      <NavLink
        to="/hitung-gaji-bersih"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        {t('tabGrossToNet')}
      </NavLink>
      <NavLink
        to="/hitung-gaji-kotor"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        {t('tabNetToGross')}
      </NavLink>
    </nav>
  );
}
