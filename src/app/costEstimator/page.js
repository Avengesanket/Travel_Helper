import React from 'react';
import CostEstimatorForm from '@/components/CostEstimatorForm';

const CostEstimatorPage = () => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl text-center font-bold mb-6">
        Trip Cost Estimator
      </h1>
      <CostEstimatorForm />
    </div>
  );
};

export default CostEstimatorPage;
