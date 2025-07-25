import React from 'react';
import CostEstimatorForm from '@/components/CostEstimatorForm';

const costEstimator = () => {
  return (
    <div className='w-2/5 m-auto'>
      <h1 className='text-2xl text-center text-bold mb-4'>Cost Estimator</h1>
      <CostEstimatorForm />
    </div>
  );
};

export default costEstimator;
