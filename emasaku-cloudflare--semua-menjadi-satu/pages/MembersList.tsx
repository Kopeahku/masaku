import React, { useState, useEffect, useMemo } from 'react';
import { 
    User, UserRole,
    SellerRegistrationRequest,
    DriverRegistrationRequest,
    ArisanRegistrationRequest,
    WastePartnerRegistrationRequest,
    LaundryPartnerRegistrationRequest,
    RetailPartnerRegistrationRequest
} from '../types.ts';
import { getAllUsers } from '../services/mockData.ts';
// Fix: Add guard for heroicons
import { 
    ChevronRightIcon as ChevronRightIconSolid, 
    MagnifyingGlassIcon as MagnifyingGlassIconSolid, 
    CheckCircleIcon as CheckCircleIconSolid, 
    XCircleIcon as XCircleIconSolid 
} from '@heroicons/react/24/solid';
import { formatToRupiah, formatDate } from '../utils/formatter.ts';

// Fix: Add guard for heroicons
const ChevronRightIcon = (ChevronRightIconSolid as any).default || ChevronRightIconSolid;
const MagnifyingGlassIcon = (MagnifyingGlassIconSolid as any).default || MagnifyingGlassIconSolid;
const CheckCircleIcon = (CheckCircleIconSolid as any).default || CheckCircleIconSolid;
const XCircleIcon = (XCircleIconSolid as any).default || XCircleIconSolid;

interface MembersListProps {
  navigateToProfile: (userId: string) => void;
  sellerRequests: SellerRegistrationRequest[];
  driverRequests: DriverRegistrationRequest[];
  arisanRequests: ArisanRegistrationRequest[];
  wastePartnerRequests: WastePartnerRegistrationRequest[];
  laundryPartnerRequests: LaundryPartnerRegistrationRequest[];
  retailPartnerRequests: RetailPartnerRegistrationRequest[];
  onApprove: (type: string, id: string, approve: boolean) => void;
}

const RequestSection: React.FC<{ 
    title: string; 
    requests: any[];
    onApprove: (id: string, approve: boolean) => void;
    renderDetails: (request: any) => React.ReactNode;
}> = ({ title, requests, onApprove, renderDetails }) => {
    const pendingRequests = requests.filter(r => r.status === 'pending');
    if (pendingRequests.length === 0) return null;

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-3">{title} ({pendingRequests.length})</h2>
            <div className="space-y-3">
                {pendingRequests.map(req => (
                    <div key={req.id} className="bg-surface dark:bg-dark-surface p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <img src={req.userAvatar} alt={req.userName} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-bold">{req.userName}</p>
                                    <p className="text-xs text-slate-500">{formatDate(req.date)}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => onApprove(req.id, true)} className="p-2 bg-green-100 text-green-600 rounded-full"><CheckCircleIcon className="w-6 h-6"/></button>
                                <button onClick={() => onApprove(req.id, false)} className="p-2 bg-red-100 text-red-600 rounded-full"><XCircleIcon className="w-6 h-6"/></button>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-sm space-y-1">
                            {renderDetails(req)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

const MembersList: React.FC<MembersListProps> = ({ 
    navigateToProfile,
    sellerRequests,
    driverRequests,
    arisanRequests,
    wastePartnerRequests,
    laundryPartnerRequests,
    retailPartnerRequests,
    onApprove
 }) => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const allUsers = await getAllUsers();
      setMembers(allUsers.filter(u => u.role === UserRole.MEMBER));
      setLoading(false);
    };
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    if (!searchTerm) {
        return members;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return members.filter(member =>
        member.name.toLowerCase().includes(lowercasedTerm) ||
        (member.email && member.email.toLowerCase().includes(lowercasedTerm))
    );
  }, [members, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-6">Manajemen Anggota</h1>
        
        <RequestSection 
            title="Persetujuan Mitra Penjual"
            requests={sellerRequests}
            onApprove={(id, approve) => onApprove('seller', id, approve)}
            renderDetails={(req: SellerRegistrationRequest) => (
                <>
                    <p><strong>Nama Toko:</strong> {req.storeName}</p>
                    <p><strong>Alamat:</strong> {req.pickupAddress}</p>
                </>
            )}
        />
        
        <RequestSection 
            title="Persetujuan Mitra Pengemudi"
            requests={driverRequests}
            onApprove={(id, approve) => onApprove('driver', id, approve)}
            renderDetails={(req: DriverRegistrationRequest) => (
                <p><strong>Kendaraan:</strong> {req.vehicleType} - {req.vehicleModel} ({req.licensePlate})</p>
            )}
        />

        <RequestSection 
            title="Persetujuan Grup Arisan"
            requests={arisanRequests}
            onApprove={(id, approve) => onApprove('arisan', id, approve)}
            renderDetails={(req: ArisanRegistrationRequest) => (
                <p><strong>Grup:</strong> {req.groupName} ({req.memberCount} anggota, {formatToRupiah(req.feeAmount)}/{req.paymentPeriod})</p>
            )}
        />
        
        <RequestSection 
            title="Persetujuan Mitra Sampah"
            requests={wastePartnerRequests}
            onApprove={(id, approve) => onApprove('waste', id, approve)}
            renderDetails={(req: WastePartnerRegistrationRequest) => (
                <p><strong>Bank Sampah:</strong> {req.bankName} di {req.address}</p>
            )}
        />

        <RequestSection 
            title="Persetujuan Mitra Cuci"
            requests={laundryPartnerRequests}
            onApprove={(id, approve) => onApprove('laundry', id, approve)}
            renderDetails={(req: LaundryPartnerRegistrationRequest) => (
                <p><strong>Laundry:</strong> {req.businessName} di {req.address}</p>
            )}
        />

        <RequestSection 
            title="Persetujuan Mitra Retail"
            requests={retailPartnerRequests}
            onApprove={(id, approve) => onApprove('retail', id, approve)}
            renderDetails={(req: RetailPartnerRegistrationRequest) => (
                <p><strong>Toko:</strong> {req.storeName} di {req.address}</p>
            )}
        />


        <h2 className="text-xl font-bold mt-8 mb-3">Daftar Anggota</h2>
        <div className="relative mb-4">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
                type="text"
                placeholder="Cari anggota berdasarkan nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none"
            />
        </div>

        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md">
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredMembers.map(member => (
                    <li key={member.id}>
                        <button 
                            onClick={() => navigateToProfile(member.id)} 
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                        >
                            <div className="flex items-center space-x-4">
                                <img src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-full" />
                                <div>
                                    <p className="font-semibold text-text-primary dark:text-dark-text-primary">{member.name}</p>
                                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{member.email}</p>
                                </div>
                            </div>
                            <ChevronRightIcon className="w-5 h-5 text-slate-400 dark:text-slate-500"/>
                        </button>
                    </li>
                ))}
            </ul>
            {filteredMembers.length === 0 && (
                <p className="text-center py-8 text-text-secondary dark:text-dark-text-secondary">Tidak ada anggota yang ditemukan.</p>
            )}
        </div>
    </div>
  );
};

export default MembersList;