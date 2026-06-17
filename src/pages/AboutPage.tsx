import { useLang } from '../i18n/useLang';

export function AboutPage() {
  const { lang } = useLang();

  const content = lang === 'id' ? (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Tentang Kalkulator</h1>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Pengenalan</h2>
          <p>
            Kalkulator Gaji Indonesia membantu karyawan dan pengusaha menghitung gaji bersih dengan
            akurat berdasarkan regulasi perpajakan dan iuran kesejahteraan karyawan (BPJS) terbaru di
            Indonesia.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Metodologi</h2>
          <p>
            Kalkulator menggunakan metode TER (Tarif Efektif Rata-rata) yang diatur dalam PMK
            (Peraturan Menteri Keuangan) 168/2023, efektif mulai Januari 2024. Metode ini menggantikan
            sistem perhitungan PPh 21 sebelumnya dengan formula yang lebih sederhana berbasis tarif
            efektif rata-rata.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Komponen Perhitungan</h2>
          <p>Gaji bersih dihitung dari gaji bruto dikurangi dengan:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>BPJS Kesehatan:</strong> 1% dari gaji (maksimal gaji bruto Rp 12 juta)
            </li>
            <li>
              <strong>BPJS Ketenagakerjaan:</strong> Mencakup tiga komponen:
              <ul className="list-circle pl-6 mt-1 space-y-1">
                <li>JHT (Jaminan Hari Tua): 2%</li>
                <li>JP (Jaminan Pensiun): 1% (maksimal gaji bruto Rp 9,559,600)</li>
                <li>JKK/JKM: Ditanggung sepenuhnya oleh pemberi kerja</li>
              </ul>
            </li>
            <li>
              <strong>PPh 21 (Pajak Penghasilan):</strong> Dihitung menggunakan TER berdasarkan kategori
              PTKP (Penghasilan Tidak Kena Pajak)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Status PTKP</h2>
          <p>
            PTKP (Penghasilan Tidak Kena Pajak) adalah penghasilan yang bebas dari pajak penghasilan
            (PPh 21). Status PTKP mempengaruhi kategori TER yang digunakan dalam perhitungan pajak.
          </p>
          <p className="mt-3">Kategori PTKP tersedia:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>TK/0 – TK/3:</strong> Untuk pegawai tidak kawin (dengan/tanpa tanggungan)
            </li>
            <li>
              <strong>K/0 – K/3:</strong> Untuk pegawai kawin (dengan/tanpa tanggungan)
            </li>
          </ul>
          <p className="mt-3">
            Setiap status PTKP memiliki jumlah penghasilan tidak kena pajak yang berbeda, yang
            memppengaruhi perhitungan PPh 21 menggunakan metode TER.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Metode TER (PMK 168/2023)</h2>
          <p>
            TER adalah tarif pajak efektif rata-rata yang diterapkan bulanan. Metode ini memberikan
            tarif pajak yang berbeda berdasarkan kategori PTKP dan besaran gaji bruto.
          </p>
          <p className="mt-3">
            Kalkulator memiliki tabel TER lengkap untuk tiga kategori (A, B, dan C) dengan ribuan
            kombinasi bracket gaji untuk perhitungan yang akurat.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Peraturan yang Digunakan</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>PMK 168/2023:</strong> Metode perhitungan PPh 21 menggunakan TER
            </li>
            <li>
              <strong>PP 44/2009:</strong> Tentang Jaminan Sosial Tenaga Kerja (BPJS Ketenagakerjaan)
            </li>
            <li>
              <strong>PP 45/2015:</strong> Tentang Penyelenggaraan Program Jaminan Sosial Kesehatan
            </li>
            <li>
              <strong>PP 46/2015:</strong> Tentang Pelayanan Kesehatan Masyarakat
            </li>
            <li>
              <strong>Perpres 64/2020:</strong> Tentang Perubahan Perpres 23/2020 mengenai BPJS
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Fitur Tambahan</h2>
          <p>
            Kalkulator juga mendukung perhitungan dengan THR (Tunjangan Hari Raya) dan dapat menampilkan
            data pengguna sebagai biaya total untuk perusahaan (termasuk kontribusi employer BPJS).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Catatan Penting</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Kalkulator ini untuk tujuan informasi dan edukasi. Untuk penghitungan payroll resmi,
              konsultasikan dengan akuntan atau konsultan pajak profesional.
            </li>
            <li>
              Data yang Anda masukkan tidak disimpan di server kami. Semua perhitungan dilakukan
              sepenuhnya di browser Anda.
            </li>
            <li>
              Tarif dan peraturan dapat berubah. Kami berusaha memperbarui kalkulator sesuai dengan
              perubahan regulasi terbaru.
            </li>
            <li>
              Untuk saat ini, kalkulator menggunakan metode TER bulanan (Januari-November). Perhitungan
              desember dengan rekonsiliasi tahunan akan ditambahkan di masa depan.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Kontribusi</h2>
          <p>
            Kalkulator ini adalah proyek sumber terbuka. Anda dapat berkontribusi atau melaporkan
            kesalahan di{' '}
            <a href="https://github.com/dhik-a/ina-salary-calc" target="_blank" rel="noopener noreferrer"
            className="text-blue-600 hover:underline">GitHub repository kami</a>.
          </p>
        </section>
      </div>
    </>
  ) : (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">About the Calculator</h1>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Introduction</h2>
          <p>
            The Indonesian Salary Calculator helps employees and employers accurately calculate net
            salary based on the latest tax regulations and employee welfare contributions (BPJS) in
            Indonesia.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Methodology</h2>
          <p>
            The calculator uses the TER (Tarif Efektif Rata-rata) method regulated in PMK (Ministry of
            Finance Regulation) 168/2023, effective since January 2024. This method replaces the
            previous PPh 21 calculation system with a simpler formula based on an effective average tax rate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Calculation Components</h2>
          <p>Net salary is calculated from gross salary minus:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>BPJS Health:</strong> 1% of salary (maximum salary base Rp 12 million)
            </li>
            <li>
              <strong>BPJS Employment:</strong> Includes three components:
              <ul className="list-circle pl-6 mt-1 space-y-1">
                <li>JHT (Old-age Benefits): 2%</li>
                <li>JP (Pension Guarantee): 1% (maximum salary base Rp 9,559,600)</li>
                <li>JKK/JKM: Fully borne by employer</li>
              </ul>
            </li>
            <li>
              <strong>PPh 21 (Income Tax):</strong> Calculated using TER based on PTKP (Non-Taxable
              Income) category
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">PTKP Status</h2>
          <p>
            PTKP (Non-Taxable Income) is the income exempt from income tax (PPh 21). PTKP status affects
            the TER category used in tax calculation.
          </p>
          <p className="mt-3">Available PTKP categories:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>TK/0 – TK/3:</strong> For unmarried employees (with/without dependents)
            </li>
            <li>
              <strong>K/0 – K/3:</strong> For married employees (with/without dependents)
            </li>
          </ul>
          <p className="mt-3">
            Each PTKP status has different non-taxable income amounts, which affect PPh 21 calculation
            using the TER method.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">TER Method (PMK 168/2023)</h2>
          <p>
            TER is an effective average tax rate applied monthly. This method provides different tax
            rates based on PTKP category and gross salary amount.
          </p>
          <p className="mt-3">
            The calculator contains a complete TER table for three categories (A, B, and C) with thousands
            of salary bracket combinations for accurate calculation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Regulations Used</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>PMK 168/2023:</strong> Method for calculating PPh 21 using TER
            </li>
            <li>
              <strong>PP 44/2009:</strong> On Employee Social Security (BPJS Employment)
            </li>
            <li>
              <strong>PP 45/2015:</strong> On the Implementation of Health Social Security Program
            </li>
            <li>
              <strong>PP 46/2015:</strong> On Community Health Services
            </li>
            <li>
              <strong>Perpres 64/2020:</strong> On Amendment to Presidential Regulation 23/2020
              regarding BPJS
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Additional Features</h2>
          <p>
            The calculator also supports calculations with THR (Year-End Bonus) and can display user data
            as total company cost (including employer BPJS contributions).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Important Notes</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              This calculator is for informational and educational purposes. For official payroll
              calculations, consult a professional accountant or tax consultant.
            </li>
            <li>
              Data you enter is not stored on our servers. All calculations are performed entirely in
              your browser.
            </li>
            <li>
              Rates and regulations may change. We strive to update the calculator according to the
              latest regulatory changes.
            </li>
            <li>
              Currently, the calculator uses the monthly TER method (January-November). December
              calculation with annual reconciliation will be added in the future.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Contributing</h2>
          <p>
            This calculator is an open-source project. You can contribute or report errors at our{' '}
            <a href="https://github.com/dhik-a/ina-salary-calc" target="_blank" rel="noopener noreferrer"
            className="text-blue-600 hover:underline">GitHub repository</a>.
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
