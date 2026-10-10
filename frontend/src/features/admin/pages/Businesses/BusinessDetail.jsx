import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { initialFacilities } from './BusinessList';
import BusinessStatusBanner from '../../components/business/BusinessStatusBanner';
import BusinessOverviewCard from '../../components/business/BusinessOverviewCard';
import BranchListCard from '../../components/business/BranchListCard';
import BusinessOwnerCard from '../../components/business/BusinessOwnerCard';
import ApprovalActionCard from '../../components/business/ApprovalActionCard';

export default function BusinessDetail() {
  const { id } = useParams();
  
  const foundFacility = id
    ? initialFacilities.find((f) => String(f.id) === String(id)) || initialFacilities[0]
    : initialFacilities[0];

  const [facility, setFacility] = useState(foundFacility);
  const [adminNote, setAdminNote] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const matched = initialFacilities.find((f) => String(f.id) === String(id));
      if (matched) {
        setFacility(matched);
      }
    }
  }, [id]);

  const displayCode = facility ? `BIZ250522-000${facility.id}` : 'BIZ250522-0987';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleApprove = () => {
    setFacility((prev) => ({ ...prev, status: 'Đã duyệt' }));
  };

  const handleReject = () => {
    setFacility((prev) => ({ ...prev, status: 'Từ chối' }));
  };

  return (
    <div className="p-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/admin/facilities"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Quay lại danh sách cơ sở</span>
        </Link>
      </div>

      <div className="space-y-5">
        <BusinessStatusBanner
          facility={facility}
          code={displayCode}
          onCopyCode={handleCopyCode}
          copied={copied}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left */}
          <div className="lg:col-span-2 space-y-5">
            <BusinessOverviewCard facility={facility} />
            <BranchListCard />
          </div>

          {/* Right */}
          <div className="space-y-5">
            <BusinessOwnerCard facility={facility} />

            <ApprovalActionCard
              adminNote={adminNote}
              setAdminNote={setAdminNote}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
        </div>
      </div>
    </div>
  );
}