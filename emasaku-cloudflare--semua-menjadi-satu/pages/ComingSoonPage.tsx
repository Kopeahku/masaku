import React from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    SparklesIcon as SparklesIconSolid 
} from '@heroicons/react/24/solid';
import { dashboardFeatures } from '../features.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const SparklesIcon = (SparklesIconSolid as any).default || SparklesIconSolid;

interface ComingSoonPageProps {
  setActivePage: (page: string) => void;
  featureName: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ setActivePage, featureName }) => {
  // Find the feature details from the imported list
  const feature = dashboardFeatures.find(f => f.label === featureName);

  // Generate a generic description of the feature's purpose
  const getFeaturePurpose = (label: string): string => {
      switch (label) {
          case 'Top Up':
              return 'Isi ulang saldo dompet FinanSaku Anda dengan mudah. Kami akan menyediakan berbagai metode pembayaran, mulai dari Virtual Account bank, pembayaran melalui gerai retail seperti Indomaret dan Alfamart, hingga e-wallet populer. Prosesnya cepat, aman, dan akan terkonfirmasi secara otomatis.';
          case 'Tarik Saldo':
              return 'Cairkan saldo Anda kapan pun dibutuhkan. Fitur ini memungkinkan Anda untuk mentransfer dana dari dompet FinanSaku langsung ke rekening bank pribadi Anda. Prosesnya akan diverifikasi oleh admin untuk memastikan keamanan transaksi Anda.';
          case 'Transfer':
              return 'Kirim uang menjadi lebih mudah. Anda bisa mentransfer dana ke sesama pengguna FinanSaku secara instan tanpa biaya, atau mengirim ke rekening bank lain di seluruh Indonesia dengan biaya administrasi yang kompetitif. Cepat, aman, dan praktis.';
          case 'Donasi':
              return 'Salurkan kebaikan Anda dengan mudah. Jelajahi berbagai program donasi yang telah terverifikasi, mulai dari bantuan bencana, pendidikan, hingga pembangunan infrastruktur. Setiap donasi Anda akan tercatat dan kami akan memberikan laporan penyaluran secara transparan.';
          case 'Jual Beli':
              return 'Temukan barang impian atau jual barang bekas Anda di marketplace komunitas kami. Fitur ini dirancang untuk memfasilitasi transaksi jual beli yang aman dan mudah antar sesama anggota, lengkap dengan fitur favorit, keranjang belanja, dan profil penjual.';
          case 'Kasir':
              return 'Untuk Anda yang memiliki usaha, fitur Kasir (Point of Sale) ini akan menjadi asisten digital Anda. Catat penjualan, kelola inventaris sederhana, dan terima berbagai metode pembayaran dari pelanggan dengan mudah. Jadikan pengelolaan bisnis Anda lebih efisien.';
          case 'Ojek':
              return 'Butuh transportasi atau ingin mengirim barang? Layanan Ojek kami siap membantu. Pesan ojek motor atau mobil untuk perjalanan Anda, atau gunakan layanan kurir instan untuk pengiriman paket. Tarif kompetitif dan dapat dipantau secara real-time.';
          case 'Loker':
              return 'Temukan peluang karir baru. Kami akan menyajikan informasi lowongan pekerjaan dari berbagai industri yang terpercaya. Anda dapat mencari berdasarkan posisi, lokasi, atau kategori untuk menemukan pekerjaan yang paling sesuai dengan keahlian Anda.';
          case 'Game':
              return 'Isi waktu luang Anda dengan permainan seru dan asah otak. Kumpulkan poin dari setiap permainan yang Anda menangkan dan tukarkan dengan berbagai hadiah menarik atau voucher diskon di dalam ekosistem FinanSaku.';
          case 'Iuran':
              return 'Tidak perlu lagi pusing mencatat pembayaran iuran manual. Fitur ini membantu Anda membayar iuran rutin seperti iuran keamanan, kebersihan lingkungan, atau iuran kas RT/RW secara digital. Semua pembayaran akan tercatat rapi dan mudah dilacak.';
          case 'Komunitas':
              return 'Terhubung dengan sesama anggota. Di Ruang Komunitas, Anda bisa membuat postingan, berdiskusi tentang berbagai topik (mulai dari finansial hingga hobi), bergabung dengan grup, dan mengikuti acara-acara komunitas yang akan datang.';
          case 'Arisan':
              return 'Kelola grup arisan Anda secara digital. Fitur ini memudahkan pembuatan grup, pencatatan setoran anggota, pengingat pembayaran, hingga proses pengundian pemenang yang adil dan transparan. Arisan jadi lebih seru dan terorganisir.';
          case 'Islami':
              return 'Lengkapi kebutuhan spiritual harian Anda. Pusat Islami menyediakan fitur Al-Qur\'an digital lengkap dengan audio, jadwal sholat akurat berdasarkan lokasi Anda, tasbih digital untuk berdzikir, dan kumpulan doa-doa harian.';
          case 'Hitung Sipil':
              return 'Bagi Anda yang sedang merencanakan renovasi atau pembangunan, kalkulator ini sangat membantu. Dapatkan estimasi cepat untuk kebutuhan material seperti jumlah bata merah, volume beton cor, hingga jumlah cat yang dibutuhkan untuk proyek Anda.';
          case 'Alat Hitung':
              return 'Sebuah kalkulator sederhana yang selalu siap sedia di dalam aplikasi. Gunakan untuk perhitungan cepat saat Anda merencanakan anggaran, menghitung diskon, atau kebutuhan hitung-hitungan lainnya tanpa perlu beralih aplikasi.';
          case 'Quiz':
              return 'Uji dan tingkatkan literasi finansial Anda. Ikuti kuis-kuis menarik seputar investasi, tabungan, dan manajemen keuangan. Dapatkan skor, pelajari penjelasannya, dan jadilah lebih cerdas dalam mengelola uang.';
          case 'Bayar/Beli':
              return 'Satu tempat untuk semua kebutuhan digital Anda. Beli pulsa, paket data, token listrik, saldo e-money, dan voucher game dengan mudah. Anda juga bisa membayar berbagai tagihan bulanan seperti listrik pascabayar, BPJS, PDAM, dan internet.';
          case 'Dream Weaver':
              return 'Visualisasikan tujuan finansial Anda dengan kekuatan AI. Cukup tuliskan impian Anda—misalnya, \'rumah impian di tepi pantai\'—dan AI akan mengubahnya menjadi sebuah gambar yang indah. Gunakan gambar ini sebagai motivasi untuk terus menabung!';
          case 'Laundry':
              return 'Pakaian kotor menumpuk? Pesan layanan laundry antar-jemput kami. Cukup pilih jenis layanan (kiloan atau satuan), tentukan jadwal, dan kurir kami akan menjemput dan mengantar kembali pakaian Anda dalam keadaan bersih dan wangi.';
          default:
              return 'Fitur baru yang menarik ini akan segera hadir untuk meningkatkan pengalaman Anda menggunakan FinanSaku.';
      }
  };

  const Icon = feature ? (feature.icon as any).default || feature.icon : null;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => setActivePage('Dashboard')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
          aria-label="Kembali ke Dasbor"
        >
          <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
          Segera Hadir
        </h1>
      </div>

      <div className="text-center bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-md">
        <SparklesIcon className="w-16 h-16 mx-auto text-amber-400 dark:text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Fitur Sedang Disiapkan!</h2>
        <p className="text-text-secondary dark:text-dark-text-secondary mt-2 max-w-md mx-auto">
          Fitur <strong className="text-text-primary dark:text-dark-text-primary">{featureName}</strong> ini sedang dalam tahap pengembangan dan akan segera tersedia untuk Anda!
        </p>
        
        {feature && Icon && (
            <div className="mt-6 text-left p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                    <div className={feature.bgClass.replace('group-hover:', ' ')}>
                       <Icon className={`w-6 h-6 ${feature.iconClass}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-text-primary dark:text-dark-text-primary">{feature.label}</h3>
                        <p className="text-xs font-semibold text-text-secondary dark:text-dark-text-secondary">{feature.description}</p>
                    </div>
                </div>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    {getFeaturePurpose(feature.label)}
                </p>
            </div>
        )}

        <button
            onClick={() => setActivePage('Dashboard')}
            className="mt-8 bg-gradient-to-br from-gold-light to-gold-dark hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
            Kembali ke Dasbor
        </button>
      </div>
    </div>
  );
};

export default ComingSoonPage;