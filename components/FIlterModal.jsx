import React, { useState } from "react";
import filterIcon from "../public/images/filter-icon.svg";

const FilterModal = ({ isOpen, onClose, applyFilter }) => {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const handleFilter = () => {
    applyFilter({ category, status });
    onClose();
  };

  const handleReset = () => {
    setCategory("");
    setStatus("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-xl font-bold mb-4">Filter</h2>
        <div>
          <label>Category</label>
          <select
            className="block w-full p-2 mt-2 border rounded-md"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="Fantasy">Fantasy</option>
            <option value="Romance">Financial</option>
            <option value="Teen Fiction">Teen Fiction</option>
            <option value="Non Fiction">Non Fiction</option>
          </select>
        </div>
        <div className="mt-4">
          <label>Status</label>
          <select
            className="block w-full p-2 mt-2 border rounded-md"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">Status</option>
            <option value="publish">publish</option>
            <option value="draft">draft</option>
          </select>
        </div>
        <div className="flex justify-between mt-6">
          <div>
            <button className="mr-4 px-4 py-2 border rounded-full" onClick={handleReset}>
              Reset
            </button>
          </div>
          <div>
            <button className="mr-4 px-4 py-2 border rounded-full" onClick={onClose}>
              Cancel
            </button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-full" onClick={handleFilter}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="flex items-center text-white p-2 rounded-md">
      <img src={filterIcon} alt="filter icon" className="w-4 h-4 mr-2" />
    </button>
  );
};

export { FilterModal, FilterButton };
