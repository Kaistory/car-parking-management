import React, { useState,useContext } from 'react';
import { Edit, Trash2, Plus, X, Check } from 'lucide-react';
import { DashBoardContext } from '../context/DashboardContext';
const ParkingFees = () => {
  const { feesParking, updateFeeById, deleteFeeById, createFee } = useContext(DashBoardContext);
  // const [parkingFees, setParkingFees] = useState([
  //   { _id: "6833f5d50eb50789395627f6", vehicleType: 'Motorcycle', feeAmount: 50000, effectiveDate: "2024-01-01T00:00:00.000Z", __v: 0 },
  //   { _id: "6833f5d50eb50789395627f7", vehicleType: 'Car', feeAmount: 200000, effectiveDate: "2024-01-01T00:00:00.000Z", __v: 0 },
  //   { _id: "6833f5d50eb50789395627f8", vehicleType: 'Bicycle', feeAmount: 20000, effectiveDate: "2024-02-01T00:00:00.000Z", __v: 0 },
  //   { _id: "6833f5d50eb50789395627f9", vehicleType: 'Electric Scooter', feeAmount: 75000, effectiveDate: "2024-01-15T00:00:00.000Z", __v: 0 },
  //   { _id: "6833f5d50eb50789395627fa", vehicleType: 'Truck', feeAmount: 500000, effectiveDate: "2024-03-01T00:00:00.000Z", __v: 0 },
  //   { _id: "6833f5d50eb50789395627fb", vehicleType: 'Bus', feeAmount: 800000, effectiveDate: "2024-02-15T00:00:00.000Z", __v: 0 },
  //   { _id: "6833f5d50eb50789395627fc", vehicleType: 'Van', feeAmount: 300000, effectiveDate: "2024-01-20T00:00:00.000Z", __v: 0 },
  //   { _id: "6833f5d50eb50789395627fd", vehicleType: 'SUV', feeAmount: 250000, effectiveDate: "2024-02-10T00:00:00.000Z", __v: 0 }
  // ]);

  const [parkingFees, setParkingFees] = useState(feesParking);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ vehicleType: '', feeAmount: '', effectiveDate: '' });
  
  // Add states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ vehicleType: '', feeAmount: '', effectiveDate: '' });

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Helper function to format date from ISO string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Helper function to format date for input from ISO string
  const formatDateForInput = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Generate MongoDB-like ObjectId (simple mock for demo)
  const generateObjectId = () => {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    const randomHex = Math.random().toString(16).substring(2, 18);
    return timestamp + randomHex.padEnd(16, '0');
  };

  // Filter parking fees based on search term
  const filteredParkingFees = parkingFees.filter(fee =>
    fee.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.feeAmount.toString().includes(searchTerm.toLowerCase()) ||
    formatDate(fee.effectiveDate).includes(searchTerm.toLowerCase())
  );

  // Sort parking fees
  const sortedParkingFees = [...filteredParkingFees].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    // Handle date sorting for ISO strings
    if (sortConfig.key === 'effectiveDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortConfig.direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return '↕️';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Edit functions
  const handleEdit = (parkingFee) => {
    setEditingId(parkingFee._id);
    setEditForm({
      vehicleType: parkingFee.vehicleType,
      feeAmount: parkingFee.feeAmount.toString(),
      effectiveDate: formatDateForInput(parkingFee.effectiveDate)
    });
  };

  const handleSaveEdit = () => {
    // Validation
    if (!editForm.vehicleType.trim()) {
      alert('Please enter vehicle type');
      return;
    }

    if (!editForm.feeAmount || isNaN(editForm.feeAmount) || parseFloat(editForm.feeAmount) <= 0) {
      alert('Please enter a valid fee amount');
      return;
    }

    if (!editForm.effectiveDate) {
      alert('Please select effective date');
      return;
    }

    setParkingFees(prev => prev.map(fee => 
      fee._id === editingId 
        ? { 
            ...fee, 
            vehicleType: editForm.vehicleType.trim(),
            feeAmount: parseFloat(editForm.feeAmount),
            effectiveDate: new Date(editForm.effectiveDate).toISOString()
          }
        : fee
    ));
    updateFeeById({
      _id: editingId,
      vehicleType: editForm.vehicleType.trim(),
      feeAmount: parseFloat(editForm.feeAmount),
      effectiveDate: new Date(editForm.effectiveDate).toISOString()
    });
    setEditingId(null);
    setEditForm({ vehicleType: '', feeAmount: '', effectiveDate: '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ vehicleType: '', feeAmount: '', effectiveDate: '' });
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add functions
  const openAddModal = () => {
    setShowAddModal(true);
    setAddForm({ 
      vehicleType: '', 
      feeAmount: '', 
      effectiveDate: formatDateForInput(new Date().toISOString()) 
    });
  };

  const handleAddInputChange = (field, value) => {
    setAddForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveNewParkingFee = () => {
    // Validation
    if (!addForm.vehicleType.trim()) {
      alert('Please enter vehicle type');
      return;
    }

    if (!addForm.feeAmount || isNaN(addForm.feeAmount) || parseFloat(addForm.feeAmount) <= 0) {
      alert('Please enter a valid fee amount');
      return;
    }

    if (!addForm.effectiveDate) {
      alert('Please select effective date');
      return;
    }

    // Check if vehicle type already exists
    const exists = parkingFees.some(fee => fee.vehicleType.toLowerCase() === addForm.vehicleType.trim().toLowerCase());
    if (exists) {
      alert('Vehicle type already exists');
      return;
    }

    // Create new parking fee with MongoDB-like structure
    const newParkingFee = {
      _id: generateObjectId(),
      vehicleType: addForm.vehicleType.trim(),
      feeAmount: parseFloat(addForm.feeAmount),
      effectiveDate: new Date(addForm.effectiveDate).toISOString(),
      __v: 0
    };
    createFee(newParkingFee);
    // Add to parking fees list
    setParkingFees(prev => [...prev, newParkingFee]);
    
    // Close modal and reset form
    setShowAddModal(false);
    setAddForm({ vehicleType: '', feeAmount: '', effectiveDate: '' });
    
    // Show success message
    alert('Parking fee added successfully!');
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setAddForm({ vehicleType: '', feeAmount: '', effectiveDate: '' });
  };

  // Delete function
  const handleDelete = (_id) => {
    if (window.confirm('Are you sure you want to delete this parking fee?')) {
      deleteFeeById(_id);
      setParkingFees(prev => prev.filter(fee => fee._id !== _id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <button 
            onClick={openAddModal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add Parking Fee
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Show</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-gray-600">entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search vehicle type, amount, or date..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                  #
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('vehicleType')}
                >
                  <div className="flex items-center gap-1">
                    Vehicle Type
                    <span className="text-xs">{getSortIcon('vehicleType')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('feeAmount')}
                >
                  <div className="flex items-center gap-1">
                    Fee Amount
                    <span className="text-xs">{getSortIcon('feeAmount')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('effectiveDate')}
                >
                  <div className="flex items-center gap-1">
                    Effective Date
                    <span className="text-xs">{getSortIcon('effectiveDate')}</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedParkingFees.slice(0, entriesPerPage).map((parkingFee, index) => (
                <tr key={parkingFee._id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === parkingFee._id ? (
                      <input
                        type="text"
                        value={editForm.vehicleType}
                        onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Vehicle type"
                      />
                    ) : (
                      <span className="font-medium">{parkingFee.vehicleType}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === parkingFee._id ? (
                      <input
                        type="number"
                        value={editForm.feeAmount}
                        onChange={(e) => handleInputChange('feeAmount', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Fee amount"
                        min="0"
                        step="1000"
                      />
                    ) : (
                      <span className="font-semibold text-green-600">
                        {formatCurrency(parkingFee.feeAmount)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === parkingFee._id ? (
                      <input
                        type="date"
                        value={editForm.effectiveDate}
                        onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-blue-600">
                        {formatDate(parkingFee.effectiveDate)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {editingId === parkingFee._id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                            title="Save"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(parkingFee)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(parkingFee._id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 text-sm text-gray-600 border-t border-gray-200">
          Showing {Math.min(entriesPerPage, filteredParkingFees.length)} of {filteredParkingFees.length} entries
          {searchTerm && ` (filtered from ${parkingFees.length} total entries)`}
        </div>
      </div>

      {/* Add Parking Fee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New Parking Fee</h2>
                <button
                  onClick={handleCancelAdd}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.vehicleType}
                    onChange={(e) => handleAddInputChange('vehicleType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Motorcycle, Car, Bicycle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fee Amount (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={addForm.feeAmount}
                    onChange={(e) => handleAddInputChange('feeAmount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter fee amount in VND"
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effective Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={addForm.effectiveDate}
                    onChange={(e) => handleAddInputChange('effectiveDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveNewParkingFee}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Check size={16} />
                  Add Parking Fee
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingFees;