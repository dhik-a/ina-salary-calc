import { useLang } from '../i18n/useLang';

export function PrivacyPage() {
  const { lang } = useLang();

  const content = lang === 'id' ? (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Kebijakan Privasi</h1>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Pendahuluan</h2>
          <p>
            Kami menghargai privasi Anda. Halaman ini menjelaskan bagaimana kami menggunakan data
            ketika Anda menggunakan Kalkulator Gaji kami.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Google AdSense</h2>
          <p>
            Situs ini menggunakan Google AdSense untuk menampilkan iklan yang relevan. Google dapat
            menggunakan cookie dan teknologi pelacakan lainnya untuk:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Menampilkan iklan berdasarkan minat Anda</li>
            <li>Melacak kinerja iklan</li>
            <li>Mencegah penipuan dan penyalahgunaan</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Cookie dan Pelacakan</h2>
          <p>
            Google menggunakan DoubleClick DART cookie untuk melacak aktivitas pengguna antar situs.
            Kami juga dapat menggunakan cookie lainnya untuk meningkatkan pengalaman pengguna.
          </p>
          <p>
            Informasi yang dikumpulkan dapat mencakup alamat IP Anda, jenis browser, dan halaman
            yang Anda kunjungi.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Penargetan Berdasarkan Lokasi</h2>
          <p>
            Google dapat menggunakan alamat IP Anda untuk menentukan lokasi Anda dan menampilkan
            iklan yang relevan dengan wilayah Anda.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Data Kalkulator</h2>
          <p>
            Data gaji yang Anda masukkan di kalkulator ini tidak disimpan di server kami. Semua
            perhitungan dilakukan di browser Anda. Namun, Google Analytics dapat mengumpulkan data
            penggunaan umum.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Hak Anda</h2>
          <p>Anda memiliki hak untuk:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Mengatur preferensi iklan Google</li>
            <li>Keluar dari pelacakan iklan tertarget</li>
            <li>Menggunakan browser dengan fitur privasi yang lebih ketat</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Tautan Privasi Pihak Ketiga</h2>
          <p>Untuk mengelola preferensi iklan Google:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:underline">
                Google Ads Settings
              </a>
            </li>
            <li>
              <a href="https://aboutads.info" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:underline">
                About Ads (Digital Advertising Alliance)
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Perubahan Kebijakan</h2>
          <p>
            Kami dapat memperbarui kebijakan privasi ini kapan saja. Perubahan akan berlaku segera
            setelah dipublikasikan di halaman ini.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Hubungi Kami</h2>
          <p>
            Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui
            GitHub di <a href="https://github.com/dhik-a/ina-salary-calc" target="_blank" rel="noopener noreferrer"
            className="text-blue-600 hover:underline">proyek kami</a>.
          </p>
        </section>
      </div>
    </>
  ) : (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Privacy Policy</h1>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Introduction</h2>
          <p>
            We respect your privacy. This page explains how we handle data when you use the
            Salary Calculator.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Google AdSense</h2>
          <p>
            This site uses Google AdSense to display relevant advertisements. Google may use cookies
            and other tracking technologies to:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Display ads based on your interests</li>
            <li>Track ad performance</li>
            <li>Prevent fraud and abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Cookies and Tracking</h2>
          <p>
            Google uses the DoubleClick DART cookie to track user activity across sites. We may also
            use other cookies to improve your experience.
          </p>
          <p>
            Information collected may include your IP address, browser type, and pages you visit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Location-Based Targeting</h2>
          <p>
            Google may use your IP address to determine your location and display ads relevant to
            your region.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Calculator Data</h2>
          <p>
            Salary data you enter in the calculator is not stored on our servers. All calculations
            are performed in your browser. However, Google Analytics may collect general usage data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Configure Google ad preferences</li>
            <li>Opt out of targeted ad tracking</li>
            <li>Use browsers with stricter privacy features</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Third-Party Privacy Links</h2>
          <p>To manage Google ad preferences:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:underline">
                Google Ads Settings
              </a>
            </li>
            <li>
              <a href="https://aboutads.info" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:underline">
                About Ads (Digital Advertising Alliance)
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Policy Changes</h2>
          <p>
            We may update this privacy policy at any time. Changes will take effect immediately
            upon posting on this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us via GitHub at our{' '}
            <a href="https://github.com/dhik-a/ina-salary-calc" target="_blank" rel="noopener noreferrer"
            className="text-blue-600 hover:underline">project repository</a>.
          </p>
        </section>
      </div>
    </>
  );

  return (
    <div className="max-w-3xl mx-auto">
      {content}
    </div>
  );
}
