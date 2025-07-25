"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const MyEstimatesPage = () => {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      fetchEstimates();
    }
    if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const fetchEstimates = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/estimates');
      setEstimates(res.data.estimates);
    } catch (error) {
      console.error('Failed to fetch estimates:', error);
      toast.error('Could not load your saved estimates.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this estimate?')) {
      return;
    }

    try {
      await axios.delete(`/api/estimates/${id}`);
      setEstimates(estimates.filter(e => e._id !== id));
      toast.success('Estimate deleted!');
    } catch (error) {
      console.error('Failed to delete estimate:', error);
      toast.error('Failed to delete estimate.');
    }
  };

  const SkeletonCard = () => (
    <div className="formstyle p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 animate-pulse">
        <div className="w-full sm:w-auto space-y-2">
            <div className="bg-gray-300 dark:bg-gray-700 h-6 w-3/4 sm:w-80 rounded"></div>
            <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/2 sm:w-48 rounded"></div>
            <div className="bg-gray-300 dark:bg-gray-700 h-4 w-2/3 sm:w-64 rounded"></div>
        </div>
        <div className="bg-gray-300 dark:bg-gray-700 h-10 w-full sm:w-24 rounded"></div>
    </div>
  );

  if (status === 'loading') {
    return <div className="text-center py-10">Authenticating...</div>
  }

  if (!session) {
    return (
        <div className="text-center py-16 px-6 formstyle rounded-lg max-w-lg mx-auto mt-8">
            <h3 className="text-xl font-semibold">Access Denied</h3>
            <p className="text-gray-500 mt-2">
              Please log in to view your saved estimates.
            </p>
            <Link href="/login" className="btn text-white font-bold py-2 px-5 rounded mt-4 inline-block">
              Go to Login
            </Link>
        </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="text-3xl sm:text-4xl text-center font-bold mb-8">My Saved Estimates</h1>

      {loading ? (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : estimates.length === 0 ? (
        <div className="text-center py-16 px-6 formstyle rounded-lg">
            <h3 className="text-xl font-semibold">No Saved Estimates</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              You haven&apos;t saved any trip cost estimates yet.
            </p>
            <Link href="/costEstimator" className="btn text-white font-bold py-2 px-5 rounded mt-4 inline-block">
              Calculate a New Trip
            </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {estimates.map((est) => (
            <div key={est._id} className="formstyle p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              {/* Info Section */}
              <div className="w-full sm:w-auto">
                <p className="font-semibold text-lg break-words">
                  Trip from <span className="text-blue-600 dark:text-blue-400">{est.fromLocation}</span> to <span className="text-blue-600 dark:text-blue-400">{est.toLocation}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {est.vehicleType.charAt(0).toUpperCase() + est.vehicleType.slice(1)} | {est.distance} km
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fuel: {est.fuelType} | Cost: <span className="font-bold">₹{parseFloat(est.estimatedCost).toFixed(2)}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Saved on: {new Date(est.createdAt).toLocaleDateString()}
                </p>
              </div>
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(est._id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEstimatesPage;