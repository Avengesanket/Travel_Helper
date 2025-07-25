"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CostEstimatorForm = () => {
  const { data: session } = useSession(); 
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    vehicleType: '',
    fuelType: '',
    distance: '',
    mileage: '',
    batteryCapacity: '',
    range: ''
  });

  const [estimatedCost, setEstimatedCost] = useState(null);
  const [fuelPrices, setFuelPrices] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchFuelPrices = async () => {
      try {
        const res = await axios.get('/api/fuel');
        // Convert array to a key-value object e.g., { petrol: 105, diesel: 91 }
        const priceMap = res.data.fuelPrices.reduce((acc, fuel) => {
          acc[fuel.type] = fuel.price;
          return acc;
        }, {});
        setFuelPrices(priceMap);
      } catch (error) {
        console.error('Error fetching fuel prices:', error);
        toast.error("Could not load fuel prices.");
      }
    };
    fetchFuelPrices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setEstimatedCost(null); // Reset cost on input change
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
      toast.error("You must be logged in to save an estimate.");
      return;
    }
    if (!estimatedCost) {
      toast.warn("Please calculate a cost first.");
      return;
    }

    setIsSaving(true);
    try {
      await axios.post('/api/estimates', {
        ...formData,
        estimatedCost: parseFloat(estimatedCost),
      });
      toast.success("Estimate saved successfully!");
    } catch (error) {
      console.error("Error saving estimate:", error);
      toast.error(error.response?.data?.message || "Failed to save estimate.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderFuelOptions = () => {
    const options = {
      bike: ['petrol', 'electric'],
      car: ['petrol', 'diesel', 'cng', 'electric'],
      van: ['petrol', 'diesel', 'cng', 'electric'],
      pickup: ['diesel', 'petrol'],
    };
    
    const availableFuels = options[formData.vehicleType] || [];
    
    return availableFuels.map(fuel => (
      <option key={fuel} value={fuel}>{fuel.charAt(0).toUpperCase() + fuel.slice(1)}</option>
    ));
  };
  
  const currentFuelPrice = fuelPrices[formData.fuelType];

  return (
    <div className="container mx-auto mt-10">
      <ToastContainer position="top-center" autoClose={3000} />
      <form className="formstyle max-w-md mx-auto p-6 rounded-md" onSubmit={handleSubmit}>
        {/* Changed from flex to grid for consistent alignment */}
        <div className='grid grid-cols-2 items-center gap-x-4 gap-y-4'>
            {/* From */}
            <label htmlFor="fromLocation" className="font-medium">From:</label>
            <input
                type="text" id="fromLocation" name="fromLocation" value={formData.fromLocation} onChange={handleInputChange}
                placeholder="e.g., Mumbai"
                className='w-full py-3 px-4 bg-gray-100 border border-gray-500 rounded-lg text-sm focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white'
                required
            />

            {/* To */}
            <label htmlFor="toLocation" className="font-medium">To:</label>
            <input
                type="text" id="toLocation" name="toLocation" value={formData.toLocation} onChange={handleInputChange}
                placeholder="e.g., Delhi"
                className='w-full py-3 px-4 bg-gray-100 border border-gray-500 rounded-lg text-sm focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white'
                required
            />
            
            {/* Distance */}
            <label htmlFor="distance" className="font-medium">Distance (km):</label>
            <input
                type="number" id="distance" name="distance" value={formData.distance} onChange={handleInputChange}
                placeholder="e.g., 1400"
                className='w-full py-3 px-4 bg-gray-100 border border-gray-500 rounded-lg text-sm focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white'
                required
            />
            
            {/* Vehicle Type */}
            <label htmlFor="vehicleType" className="font-medium">Vehicle Type:</label>
            <select
                id="vehicleType" name="vehicleType" onChange={handleInputChange} value={formData.vehicleType}
                className='w-full py-3 px-4 border border-gray-500 rounded-lg text-sm focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white'
                required
            >
                <option value="">Select Vehicle Type</option>
                <option value="bike">Bike</option>
                <option value="car">Car</option>
                <option value="van">Van</option>
                <option value="pickup">Pickup</option>
            </select>

            {/* Fuel Type (Conditionally Rendered) */}
            {formData.vehicleType && (
              <>
                <label htmlFor="fuelType" className="font-medium">Fuel Type:</label>
                <select
                    id="fuelType" name="fuelType" onChange={handleInputChange} value={formData.fuelType}
                    className='w-full py-3 px-4 bg-gray-100 border border-gray-500 rounded-lg text-sm focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white'
                    required
                >
                    <option value="">Select Fuel Type</option>
                    {renderFuelOptions()}
                </select>
              </>
            )}

            {/* Current Fuel Price Display */}
            {currentFuelPrice && (
              <div className="col-span-2 text-center mt-2">
                <p>Current {formData.fuelType.charAt(0).toUpperCase() + formData.fuelType.slice(1)} price: ₹{currentFuelPrice}</p>
              </div>
            )}
            
            {/* Mileage / Electric Fields (Conditionally Rendered) */}
            {formData.fuelType && formData.fuelType !== 'electric' && (
              <>
                <label htmlFor="mileage" className="font-medium">Mileage (km/unit):</label>
                <input type="number" id="mileage" name="mileage" value={formData.mileage} onChange={handleInputChange} className='w-full py-3 px-4 bg-gray-100 border border-gray-500 rounded-lg text-sm focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white' required />
              </>
            )}
            {formData.fuelType === 'electric' && (
              <>
                <label htmlFor="batteryCapacity" className="font-medium">Battery (kWh):</label>
                <input type="number" id="batteryCapacity" name="batteryCapacity" value={formData.batteryCapacity} onChange={handleInputChange} className='w-full py-3 px-4 bg-gray-100 border border-gray-500 rounded-lg text-sm focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white' required />
                <label htmlFor="range" className="font-medium">Range (km):</label>
                <input type="number" id="range" name="range" value={formData.range} onChange={handleInputChange} className='w-full py-3 px-4 bg-gray-100 border border-gray-500 rounded-lg text-sm focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white' required />
              </>
            )}
            
            {/* Submit Button - Spans both columns */}
            <button type="submit" className='col-span-2 btn text-white text-sm px-5 py-2.5 mt-4 font-bold rounded-lg'>
                Calculate Cost
            </button>
        </div>
      </form>

      {estimatedCost && (
        <div className="mt-5 text-center p-4 formstyle rounded-md">
          <h2 className='text-xl font-bold'>Estimated Cost: ₹{estimatedCost}</h2>
          {session && (
            <button
              onClick={handleSaveEstimate}
              disabled={isSaving}
              className="mt-4 btn text-white text-sm px-5 py-2.5 font-bold focus:outline-none rounded-lg"
            >
              {isSaving ? "Saving..." : "Save This Estimate"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CostEstimatorForm;
