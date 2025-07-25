"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPanel = () => {
  const [fuelPrices, setFuelPrices] = useState({
    petrol: "", diesel: "", cng: "", electric: "",
  });
  const [loading, setLoading] = useState({});

  useEffect(() => {
    async function fetchFuelPrices() {
      try {
        const res = await axios.get("/api/fuel");
        const prices = res.data.fuelPrices.reduce((acc, fuel) => {
          acc[fuel.type] = fuel.price;
          return acc;
        }, {});
        setFuelPrices(prices);
      } catch (error) {
        console.error("Error fetching fuel prices:", error);
        toast.error("Failed to fetch fuel prices.");
      }
    }
    fetchFuelPrices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFuelPrices({ ...fuelPrices, [name]: value });
  };

  const handleUpdate = async (type) => {
    if (!fuelPrices[type] || isNaN(parseFloat(fuelPrices[type]))) {
        toast.warn(`Please enter a valid price for ${type}.`);
        return;
    }
    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      await axios.post("/api/admin", { type, price: parseFloat(fuelPrices[type]) });
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} price updated!`);
    } catch (error) {
      console.error(`Error updating ${type} price:`, error);
      toast.error(`Failed to update ${type} price.`);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="w-3/5 mx-auto">
      <h1 className="text-3xl text-center font-bold mb-4">Update Fuel Prices</h1>
      <div className="formstyle container mt-10 mx-auto bg-white p-6 rounded-md">
        <div className="grid grid-cols-3 items-center gap-x-4 gap-y-6">
          {["petrol", "diesel", "cng", "electric"].map((fuelType) => (
            <React.Fragment key={fuelType}>
              <label htmlFor={fuelType} className="font-medium">
                {fuelType.charAt(0).toUpperCase() + fuelType.slice(1)} Price:
              </label>
              <input
                type="number"
                id={fuelType}
                name={fuelType}
                value={fuelPrices[fuelType] || ''}
                onChange={handleInputChange}
                required
                className="py-3 px-4 bg-gray-100 border border-gray-500 rounded-lg text-sm focus:border-blue-500 w-full"
              />
              <button
                onClick={() => handleUpdate(fuelType)}
                disabled={loading[fuelType]}
                className={`btn text-white text-sm px-5 py-2.5 font-bold focus:outline-none rounded-lg ${
                  loading[fuelType] ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading[fuelType] ? "Updating..." : "Update"}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default AdminPanel;