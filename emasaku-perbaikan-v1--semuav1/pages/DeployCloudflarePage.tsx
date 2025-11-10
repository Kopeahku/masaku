import React from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    CloudArrowUpIcon as CloudArrowUpIconSolid 
} from '@heroicons/react/24/solid';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const CloudArrowUpIcon = (CloudArrowUpIconSolid as any).default || CloudArrowUpIconSolid;

interface DeployCloudflarePageProps {
  setActivePage: (page: string) => void;
}

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-slate-100 dark:bg-slate-800 rounded-md p-3 text-sm font-mono text-text-primary dark:text-dark-text-primary overflow-x-auto">
        <code>{children}</code>
    </pre>
);

const Step: React.FC<{ number: number, title: string, children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
        <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary text-white text-lg font-bold rounded-full flex items-center justify-center">{number}</div>
            <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{title}</h2>
        </div>
        <div className="space-y-3 text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed prose prose-sm max-w-none dark:prose-invert">
            {children}
        </div>
    </div>
);

const DeployCloudflarePage: React.FC<DeployCloudflarePageProps> = ({ setActivePage }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => setActivePage('Profile')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
          aria-label="Kembali ke Profil"
        >
          <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
        </button>
        <div className="flex items-center gap-3">
          <CloudArrowUpIcon className="w-8 h-8 text-primary dark:text-gold-light" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Publikasi ke Cloudflare Pages
          </h1>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300">
            <h3 className="font-bold">Prasyarat</h3>
            <ul className="list-disc pl-5 mt-1">
                <li>Anda memiliki akun <a href="https://cloudflare.com" target="_blank" rel="noopener noreferrer" className="underline">Cloudflare</a>.</li>
                <li>Proyek aplikasi ini sudah berada di repositori Git (contoh: GitHub, GitLab).</li>
            </ul>
        </div>

        <Step number={1} title="Hubungkan Akun Git Anda">
            <ol className="list-decimal pl-5 space-y-2">
                <li>Login ke Dasbor Cloudflare Anda.</li>
                <li>Di menu navigasi, pergi ke <strong>Workers & Pages</strong>.</li>
                <li>Klik <strong>Create application</strong>, lalu pilih tab <strong>Pages</strong>.</li>
                <li>Klik <strong>Connect to Git</strong> dan ikuti proses otorisasi untuk menghubungkan akun Git Anda (GitHub/GitLab).</li>
                <li>Pilih repositori proyek aplikasi ini.</li>
            </ol>
        </Step>

        <Step number={2} title="Konfigurasi Build & Deploy">
            <p>Setelah memilih repositori, Anda akan masuk ke halaman "Set up builds and deployments". Cloudflare biasanya cerdas dalam mendeteksi proyek Vite.</p>
            <p>Pastikan konfigurasi Anda sebagai berikut:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Production branch:</strong> Pilih branch utama Anda (misal: <code>main</code> atau <code>master</code>).</li>
                <li><strong>Framework preset:</strong> <code>Vite</code>.</li>
                <li><strong>Build command:</strong> <code>npm run build</code></li>
                <li><strong>Build output directory:</strong> <code>dist</code></li>
            </ul>
            <p>Bagian "Environment variables" akan kita konfigurasi pada langkah selanjutnya.</p>
        </Step>
        
        <Step number={3} title="Simpan dan Deploy">
            <p>Klik tombol <strong>Save and Deploy</strong>. Cloudflare akan mulai proses build dan deploy pertama Anda.</p>
            <p>Setelah selesai, Anda akan mendapatkan URL unik dengan domain <code>*.pages.dev</code>. Namun, aplikasi belum akan berfungsi karena API Key belum diatur.</p>
        </Step>

        <Step number={4} title="Penting: Atur Environment Variable API_KEY">
            <p>Untuk keamanan, API Key tidak disimpan di dalam kode. Kita harus menyediakannya melalui pengaturan di Cloudflare.</p>
            <ol className="list-decimal pl-5 space-y-2">
                <li>Buka proyek Pages Anda yang baru saja dibuat di dasbor Cloudflare.</li>
                <li>Pergi ke <strong>Settings</strong> &rarr; <strong>Environment variables</strong>.</li>
                <li>Di bawah "Production", klik <strong>Add variable</strong>.</li>
                <li>Isi form sebagai berikut:
                    <ul className="list-disc pl-6 mt-2">
                        <li><strong>Variable name:</strong> <CodeBlock>VITE_API_KEY</CodeBlock></li>
                        <li><strong>Value:</strong> Masukkan Gemini API Key Anda di sini.</li>
                    </ul>
                </li>
                <li>Klik <strong>Save</strong>.</li>
                <li>Setelah variabel disimpan, pergi kembali ke tab <strong>Deployments</strong> dan <strong>trigger deploy ulang</strong> agar perubahan variabel diterapkan.</li>
            </ol>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-lg text-xs">
                <strong>Catatan:</strong> Kode aplikasi ini telah disesuaikan untuk membaca variabel dengan awalan <code>VITE_</code> saat di-build. Pastikan nama variabelnya tepat.
            </div>
        </Step>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-sm text-green-800 dark:text-green-300 text-center">
            <h3 className="font-bold">Selesai!</h3>
            <p>Setelah deploy ulang berhasil, aplikasi Anda akan berjalan sepenuhnya di URL <code>*.pages.dev</code> Anda.</p>
        </div>
      </div>
    </div>
  );
};

export default DeployCloudflarePage;
