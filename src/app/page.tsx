"use client";
import { FaRegCreditCard } from "react-icons/fa";
import { RiBankFill } from "react-icons/ri";
import { TiDeviceDesktop } from "react-icons/ti";
import { FaUser } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { HiBuildingOffice } from "react-icons/hi2";
import { VscSettings } from "react-icons/vsc";
import { useState, useMemo, ChangeEvent, FormEvent, useEffect } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState("");
  const [priceRaw, setPriceRaw] = useState<number | null>(null);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // State object now includes all form fields
  const [formData, setFormData] = useState({
    fullName: "",
    branch: "",
    department: "",
  });

  const [allNames, setAllNames] = useState<string[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);

  const idFormatter = useMemo(() => new Intl.NumberFormat("id-ID"), []);
  const formatIDR = (digits: string) =>
    digits ? idFormatter.format(parseInt(digits, 10)) : "";

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setPriceDisplay(formatIDR(digits));
    setPriceRaw(digits ? parseInt(digits, 10) : null);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameInput(value);
    setFormData(prev => ({ ...prev, fullName: value }));
    if (value.length > 0) {
      setNameSuggestions(
        allNames.filter(name =>
          name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setNameSuggestions([]);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setNameInput(name);
    setFormData(prev => ({ ...prev, fullName: name }));
    setNameSuggestions([]);
  };

  // Function to reset the form after submission
  const resetForm = () => {
    setFormData({
      fullName: "",
      branch: "",
      department: "",
    });
    setPriceDisplay("");
    setPriceRaw(null);
  };

  // The function that handles the API submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const submissionData = {
      fullName: formData.fullName,
      branch: formData.branch,
      department: formData.department,
    };

    console.log("Submitting to API:", submissionData);

    try {
      // Directly use the API endpoint
      const response = await fetch("/api/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        alert("Request submitted successfully!");
        resetForm();
      } else {
        const errorData = await response.json();
        alert(`Submission failed: ${errorData.message || errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("An error occurred during submission:", error);
      alert("An error occurred. Please check the console and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchEquipmentList = async () => {
      try {
        const response = await fetch("/api/equipment");
        if (!response.ok) {
          throw new Error("Failed to fetch equipment data");
        }
        const data = await response.json();
        setEquipmentList(Array.isArray(data) ? data : [data]);
      } catch (error: any) {
        setFetchError(error.message || "Unknown error");
      }
    };
    fetchEquipmentList();
  }, []);

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const response = await fetch("/api/equipment");
        if (!response.ok) throw new Error("Failed to fetch names");
        const data = await response.json();
        const names = Array.isArray(data)
          ? [...new Set(data.map((item: any) => item.fullName).filter(Boolean))]
          : [];
        setAllNames(names);
      } catch (error) {
        setAllNames([]);
      }
    };
    fetchNames();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center mx-auto px-4 min-h-screen">
      <div className="w-full max-w-2xl bg-white rounded-md shadow-lg my-8">
        {/* The <form> tag now wraps all inputs and the submit button */}
        <form onSubmit={handleSubmit} className="flex flex-col mx-13">
          <h1 className="text-center justify-center text-3xl font-bold text-black pt-11">
            Equipment Payment Request
          </h1>
          <p className="text-center justify-center text-md text-gray-600 pt-2">
            Please fill out the form below to request a new equipment purchase.
          </p>
          <div className="flex flex-row justify-center items-start gap-x-8 w-full">
            {/* Full Name */}
            <div className="flex flex-col w-full">
              <p className="text-black pt-8">Full Name</p>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="fullName"
                  type="text"
                  required
                  value={nameInput}
                  onChange={handleNameInputChange}
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md"
                  placeholder="Syafi Athar Aidan"
                />
                {nameSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded shadow dropdown">
                    {nameSuggestions.map((name, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSuggestionClick(name)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Branch */}
            <div className="flex flex-col w-full">
              <label className="text-black pt-8">Branch</label>
              <div className="relative">
                <HiBuildingOffice className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="branch"
                  type="text"
                  required
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g. Cretivox"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center text-start gap-x-8">
            {/* Department */}
            <div className="flex flex-col w-full">
              <label className="text-black pt-8">Department</label>
              <div className="relative">
                <VscSettings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 py-2.5 border border-gray-300 rounded-md"
                  placeholder="e.g. IT"
                />
              </div>
            </div>

            {/* Equipment */}
            <div className="flex flex-col w-full">
              <p className="text-black pt-8">Equipment Name</p>
              <div className="relative">
                <TiDeviceDesktop className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="equipmentName"
                  type="text"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g. Laptop, Camera, etc."
                />
              </div>
            </div>
          </div>

          {/* Online Store Link */}
          <div className="flex flex-col">
            <p className="text-black pt-8">Link to Online Store</p>
            <div className="relative">
              <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="onlineStoreLink"
                type="url" // Use type="url" for better validation
                required
                onChange={handleChange}
                className="w-full pl-10 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com/product/123"
              />
            </div>
          </div>

          <div className="flex flex-row justify-center text-start gap-x-8">
            {/* Bank Name */}
            <div className="flex flex-col w-full">
              <p className="text-black pt-8">Bank Name</p>
              <div className="relative">
                <RiBankFill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="bankName"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 py-2.5 border border-gray-300 rounded-md"
                >
                  <option value="" disabled>-- Select Bank Name --</option>
                  <option value="BCA">BCA</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BRI">Bank Rakyat Indonesia</option>
                  {/* ... other options */}
                </select>
              </div>
            </div>

            {/* Bank Account Number */}
            <div className="flex flex-col w-full">
              <p className="text-black pt-8">Bank Account Number</p>
              <div className="relative">
                <FaRegCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="bankAccountNumber"
                  type="text"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md"
                  placeholder="1234567890"
                />
              </div>
            </div>
          </div>

          {/* Bank Account Name */}
          <div className="flex flex-col w-full">
            <p className="text-black pt-8">Bank Account Name</p>
            <div className="relative">
              <RiBankFill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="bankAccountName"
                type="text"
                required
                onChange={handleChange}
                className="w-full pl-10 py-2 border border-gray-300 rounded-md"
                placeholder="Syafi Athar Aidan"
              />
            </div>
          </div>

          <div className="flex flex-row justify-center text-start gap-x-8">
            {/* Price */}
            <div className="flex flex-col w-full">
              <label className="text-black pt-8">Price</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">Rp</span>
                </div>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  className="w-full pl-10 border border-gray-300 rounded-md p-2"
                  placeholder="1.000.000"
                  value={priceDisplay}
                  onChange={handlePriceChange}
                />
              </div>
            </div>

            {/* Date Needed */}
            <div className="flex flex-col w-full">
              <label className="text-black pt-8">Date Needed</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="dateNeeded"
                  type="date"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 border border-gray-300 rounded-md py-2"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <label className="text-black pt-8">Details / Specifications</label>
            <textarea
              name="details"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Please provide any specific details, e.g., color, size, model number, or justification for the purchase..."
            />
          </div>

          <div className="flex justify-center pt-8 pb-10">
            <button
              type="submit" // Triggers the form's onSubmit
              disabled={isLoading} // Disables button during submission
              className="bg-blue-600 hover:bg-blue-800 hover:scale-105 text-white py-3 px-8 rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}