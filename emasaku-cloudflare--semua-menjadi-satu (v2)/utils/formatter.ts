

export const formatToRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " tahun lalu";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " bulan lalu";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " hari lalu";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " jam lalu";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " menit lalu";
  
  return Math.floor(seconds) + " detik lalu";
};