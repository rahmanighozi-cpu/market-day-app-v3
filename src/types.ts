export type Role =
  | 'Wali Kelas'
  | 'Bendahara'
  | 'Kasir'
  | 'Keliling'
  | 'Konsumsi'
  | 'Logistik'
  | 'Desain'
  | 'Penampilan';

export interface TeamMember {
  id: string;
  name: string;
  task: string;
}

export interface TeamProfile {
  isFilled: boolean;
  leader: string;
  members: TeamMember[];
}

export interface BahanBaku {
  id: string;
  name: string;
  category: 'Bahan Baku' | 'Pengemas';
  buyPrice: number;
  quantity: number;
  totalPrice: number;
  source: 'Sponsor' | 'Kas' | 'Iuran';
  link: string;
  expStatus: 'Aman' | 'Segera Konsumsi' | 'Expired';
  statusAcc: 'Menunggu' | 'Disetujui' | 'Ditolak'; // For Kas
}

export interface MenuProduk {
  id: string;
  name: string;
  sellPrice: number;
  stock: number;
}

export interface Transaksi {
  id: string;
  time: string;
  buyerName: string;
  category: 'Siswa' | 'Guru' | 'Umum';
  menuId: string;
  menuName: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  method: 'Tunai' | 'QRIS';
  sellerRole: 'Kasir' | 'Keliling';
  sellerName: string;
}

export interface KelilingSession {
  id: string;
  memberName: string;
  menuId: string;
  menuName: string;
  qtyTaken: number;
  qtySold: number;
  active: boolean;
}

export interface Peralatan {
  id: string;
  name: string;
  qty: number;
  source: 'Pinjam Sekolah' | 'Bawa Sendiri' | 'Sewa';
  status: 'Belum Ada' | 'Di Stand' | 'Sudah Dikembalikan';
  condition: 'Bagus' | 'Rusak' | 'Hilang';
  price: number; 
  statusAcc: 'Menunggu' | 'Disetujui' | 'Ditolak';
}

export interface DesainItem {
  id: string;
  title: string;
  link: string; // url or mockup placeholder
  status: 'Menunggu Review' | 'Disetujui' | 'Perlu Revisi';
  feedback: string;
  time: string;
}

export interface PenampilanData {
  naskah: string;
  duration: number; // in minutes
  showTime: string; // ISO date time
}

export interface RequestProperti {
  id: string;
  name: string;
  qty: number;
  status: 'Diminta' | 'Disediakan';
}

export interface PettyCash {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  role: Role | 'System';
}
