import { useState } from 'react';
import { User } from 'lucide-react';

const CustomerAvatar = ({ user, className = '' }) => {
  const [failedAvatar, setFailedAvatar] = useState(null);
  const name = user?.fullName?.trim() || user?.name?.trim() || 'Khách hàng';
  const avatar = user?.avatar?.trim() || '';
  const parts = name.split(/\s+/);
  const initials = [parts[0], ...(parts.length > 1 ? [parts.at(-1)] : [])]
    .map((part) => Array.from(part)[0]).join('').toLocaleUpperCase('vi-VN');

  return (
    <span role="img" aria-label={`Ảnh đại diện của ${name}`}
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-emerald-700 font-semibold ${className}`}>
      {avatar && avatar !== failedAvatar ? (
        <img key={avatar} src={avatar} alt="" className="h-full w-full object-cover"
          onError={() => setFailedAvatar(avatar)} />
      ) : user?.fullName || user?.name ? <span aria-hidden="true">{initials}</span> : <User aria-hidden="true" size={20} />}
    </span>
  );
};

export default CustomerAvatar;
