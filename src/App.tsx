import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { LanguageToggle } from './components/LanguageToggle';
import { useLang } from './i18n/useLang';
import { Footer } from './components/Footer';
import { TabNav } from './components/TabNav';
import { GrossToNetPage } from './pages/GrossToNetPage';
import { NetToGrossPage } from './pages/NetToGrossPage';

function AppLayout() {
  const { t, lang, setLang } = useLang();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{t('appTitle')}</h1>
            <LanguageToggle value={lang} onChange={setLang} />
          </div>
          <TabNav />
          <div className="mt-6">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/hitung-gaji-bersih" replace />} />
          <Route path="/hitung-gaji-bersih" element={<GrossToNetPage />} />
          <Route path="/hitung-gaji-kotor" element={<NetToGrossPage />} />
        </Route>
      </Routes>
    </LanguageProvider>
  );
}

export default App;
