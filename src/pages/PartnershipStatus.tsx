import React from 'react';
import PartnershipDashboard from '@/components/PartnershipDashboard';
import Header from '@/components/Header';

const PartnershipStatus: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <PartnershipDashboard />
    </div>
  );
};

export default PartnershipStatus;