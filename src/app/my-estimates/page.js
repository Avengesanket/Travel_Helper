"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyEstimatesPage = () => {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetchEstimates();
    }
  }, [session]);

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

  if (loading) {
    return <div className="text-center mt-10">Loading your estimates...</div>;
  }
  
  return (
    <div className="w-4/5 mx-auto">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="text-3xl text-center font-bold mb-8">My Saved Estimates</h1>

      {estimates.length === 0 ? (
        <p className="text-center text-gray-500">You have no saved estimates yet.</p>
      ) : (
        <div className="space-y-4">
          {estimates.map((est) => (
            <div key={est._id} className="formstyle p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">
                  Trip from <span className="text-blue-600">{est.fromLocation}</span> to <span className="text-blue-600">{est.toLocation}</span>
                </p>
                <p className="text-sm">
                  {est.vehicleType.charAt(0).toUpperCase() + est.vehicleType.slice(1)} | {est.distance} km
                </p>
                <p className="text-sm text-gray-500">
                  Fuel: {est.fuelType} | Cost: <span className="font-bold">₹{est.estimatedCost.toFixed(2)}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    Saved on: {new Date(est.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(est._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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