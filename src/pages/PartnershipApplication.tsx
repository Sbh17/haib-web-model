import React from 'react';
import EnhancedPartnershipApplication from '@/components/EnhancedPartnershipApplication';
import Header from '@/components/Header';

const PartnershipApplication: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-beauty-cream to-background">
      <Header />
      <EnhancedPartnershipApplication />
    </div>
  );
};

export default PartnershipApplication;