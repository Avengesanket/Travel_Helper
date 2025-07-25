"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const FormField = ({ id, label, children }) => (
  <div className="sm:col-span-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const CostEstimatorForm = () => {
  const { data: session } = useSession(); 
  const [formData, setFormData] = useState({
    fromLocation: '', toLocation: '', vehicleType: '', fuelType: '',
    distance: '', mileage: '', batteryCapacity: '', range: ''
  });

  const [estimatedCost, setEstimatedCost] = useState(null);
  const [fuelPrices, setFuelPrices] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);

  useEffect(() => {
    const fetchFuelPrices = async () => {
      setIsLoadingPrices(true);
      try {
        const res = await axios.get('/api/fuel');
        const priceMap = res.data.fuelPrices.reduce((acc, fuel) => {
          acc[fuel.type] = fuel.price;
          return acc;
        }, {});
        setFuelPrices(priceMap);
      } catch (error) {
        console.error('Error fetching fuel prices:', error);
        toast.error("Could not load fuel prices.");
      } finally {
        setIsLoadingPrices(false);
      }
    };
    fetchFuelPrices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "vehicleType") {
        setFormData({ ...formData, [name]: value, fuelType: "" });
    } else {
        setFormData({ ...formData, [name]: value });
    }
    setEstimatedCost(null);
  };
  
  const calculateCost = () => {
    const { fuelType, distance, mileage, batteryCapacity, range } = formData;
    
    if (fuelType === 'electric') {
      const ratePerKWh = fuelPrices.electric || 11.5; 
      const energyConsumptionPerKm = parseFloat(batteryCapacity) / parseFloat(range);
      const totalEnergyConsumed = energyConsumptionPerKm * parseFloat(distance);
      return totalEnergyConsumed * ratePerKWh;
    } else {
      const pricePerUnit = fuelPrices[fuelType];
      if (!pricePerUnit) {
        toast.error(`Price for ${fuelType} is not available.`);
        return null;
      }
      const fuelConsumed = parseFloat(distance) / parseFloat(mileage);
      return fuelConsumed * pricePerUnit;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cost = calculateCost();
    if (cost !== null) {
      setEstimatedCost(cost.toFixed(2));
    }
  };

  const handleSaveEstimate = async () => {
     if (!session) {
      toast.info("Please log in to save your estimate.");
      return;
    }
    if (!estimatedCost) {
      toast.warn("Please calculate a cost first.");
      return;
    }
    setIsSaving(true);
    try {
      await axios.post('/api/estimates', { ...formData, estimatedCost: parseFloat(estimatedCost) });
      toast.success("Estimate saved successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save estimate.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderFuelOptions = () => {
    const options = {
      bike: ['petrol', 'electric'], car: ['petrol', 'diesel', 'cng', 'electric'],
      van: ['petrol', 'diesel', 'cng', 'electric'], pickup: ['diesel', 'petrol'],
    };
    const availableFuels = options[formData.vehicleType] || [];
    return availableFuels.map(fuel => (
      <option key={fuel} value={fuel}>{fuel.charAt(0).toUpperCase() + fuel.slice(1)}</option>
    ));
  };
  
  const currentFuelPrice = fuelPrices[formData.fuelType];
  const inputStyles = "w-full py-3 px-4 border border-gray-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";

  return (
    <div className="w-full">
      <ToastContainer position="top-center" autoClose={3000} />
      <form className="formstyle p-6 sm:p-8 rounded-lg space-y-6" onSubmit={handleSubmit}>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6'>
            
            <FormField id="fromLocation" label="From:">
              <input type="text" id="fromLocation" name="fromLocation" value={formData.fromLocation} onChange={handleInputChange} placeholder="e.g., Mumbai" className={inputStyles} required />
            </FormField>

            <FormField id="toLocation" label="To:">
              <input type="text" id="toLocation" name="toLocation" value={formData.toLocation} onChange={handleInputChange} placeholder="e.g., Delhi" className={inputStyles} required />
            </FormField>

            <FormField id="distance" label="Distance (km):">
              <input type="number" id="distance" name="distance" value={formData.distance} onChange={handleInputChange} placeholder="e.g., 1400" className={inputStyles} required />
            </FormField>

            <FormField id="vehicleType" label="Vehicle Type:">
              <select id="vehicleType" name="vehicleType" onChange={handleInputChange} value={formData.vehicleType} className={inputStyles} required>
                <option value="">Select Vehicle</option>
                <option value="bike">Bike</option>
                <option value="car">Car</option>
                <option value="van">Van</option>
                <option value="pickup">Pickup</option>
              </select>
            </FormField>

            {formData.vehicleType && (
              <FormField id="fuelType" label="Fuel Type:">
                <select id="fuelType" name="fuelType" onChange={handleInputChange} value={formData.fuelType} className={inputStyles} required>
                  <option value="">Select Fuel</option>
                  {renderFuelOptions()}
                </select>
              </FormField>
            )}

            {formData.fuelType && formData.fuelType !== 'electric' && (
              <FormField id="mileage" label="Mileage (km/unit):">
                <input type="number" id="mileage" name="mileage" value={formData.mileage} onChange={handleInputChange} placeholder="e.g., 20" className={inputStyles} required />
              </FormField>
            )}

            {formData.fuelType === 'electric' && (
              <>
                <FormField id="batteryCapacity" label="Battery (kWh):">
                  <input type="number" id="batteryCapacity" name="batteryCapacity" value={formData.batteryCapacity} onChange={handleInputChange} placeholder="e.g., 40" className={inputStyles} required />
                </FormField>
                <FormField id="range" label="Full-Charge Range (km):">
                  <input type="number" id="range" name="range" value={formData.range} onChange={handleInputChange} placeholder="e.g., 300" className={inputStyles} required />
                </FormField>
              </>
            )}
        </div>

        {/* --- Display current fuel price --- */}
        {!isLoadingPrices && currentFuelPrice && (
          <div className="text-center bg-blue-50 dark:bg-blue-900/50 p-2 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Current price for {formData.fuelType}: ₹{currentFuelPrice}/unit
            </p>
          </div>
        )}

        {/* --- Submit Button --- */}
        <button type="submit" className='w-full btn text-base py-3'>
            Calculate Cost
        </button>
      </form>

      {estimatedCost && (
        <div className="mt-8 text-center p-6 formstyle rounded-lg border-2 border-green-500">
          <p className="text-gray-600 dark:text-gray-300">Estimated Trip Cost</p>
          <h2 className='text-4xl font-bold text-green-600 dark:text-green-400 my-2'>₹{estimatedCost}</h2>
          
          <button onClick={handleSaveEstimate} disabled={isSaving} className="mt-4 btn">
            {isSaving ? "Saving..." : "Save This Estimate"}
          </button>
          {!session && 
            <p className="text-xs text-gray-500 mt-2">
                <Link href="/login" className="underline hover:text-blue-500">Log in</Link> to save your estimates.
            </p>
          }
        </div>
      )}
    </div>
  );
};

export default CostEstimatorForm;