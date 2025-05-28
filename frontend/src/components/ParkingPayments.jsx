import React, { useState } from 'react';
import { Edit, Trash2, Plus, X, Check } from 'lucide-react';

const ParkingPayments = () => {
  const [apartments, setApartments] = useState([
    { id: 1, number: '201', building: 'C', status: 'Empty', rentPrice: 8500000 },
    { id: 2, number: '269', building: 'A', status: 'Owned', rentPrice: 12000000 },
    { id: 3, number: '333', building: 'D', status: 'Owned', rentPrice: 15000000 },
    { id: 4, number: '69', building: 'B', status: 'Owned', rentPrice: 7500000 },
    { id: 5, number: '255', building: 'B', status: 'Empty', rentPrice: 9500000 },
    { id: 6, number: '86', building: 'A', status: 'Empty', rentPrice: 8000000 },
    { id: 7, number: '179', building: 'A', status: 'Empty', rentPrice: 11000000 },
    { id: 8, number: '321', building: 'D', status: 'Owned', rentPrice: 16000000 },
    { id: 9, number: '203', building: 'B', status: 'Owned', rentPrice: 9000000 },
    { id: 10, number: '888', building: 'A', status: 'Owned', rentPrice: 20000000 },
    { id: 11, number: '170', building: 'C', status: 'Owned', rentPrice: 10500000 },
    { id: 12, number: '401', building: 'A', status: 'Empty', rentPrice: 7800000 },
    { id: 13, number: '444', building: 'D', status: 'Owned', rentPrice: 18000000 }
  ]);

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ number: '', building: '', status: '', rentPrice: '' });
  
  // Add states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ number: '', building: 'A', status: 'Empty', rentPrice: '' });

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Filter apartments based on search term
  const filteredApartments = apartments.filter(apt =>
    apt.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.rentPrice.toString().includes(searchTerm.toLowerCase())
  );

  // Sort apartments
  const sortedApartments = [...filteredApartments].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
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
  const handleEdit = (apartment) => {
    setEditingId(apartment.id);
    setEditForm({
      number: apartment.number,
      building: apartment.building,
      status: apartment.status,
      rentPrice: apartment.rentPrice.toString()
    });
  };

  const handleSaveEdit = () => {
    // Validation
    if (!editForm.rentPrice || isNaN(editForm.rentPrice) || parseFloat(editForm.rentPrice) <= 0) {
      alert('Please enter a valid rent price');
      return;
    }

    setApartments(prev => prev.map(apt => 
      apt.id === editingId 
        ? { 
            ...apt, 
            ...editForm,
            rentPrice: parseFloat(editForm.rentPrice)
          }
        : apt
    ));
    setEditingId(null);
    setEditForm({ number: '', building: '', status: '', rentPrice: '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ number: '', building: '', status: '', rentPrice: '' });
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
    setAddForm({ number: '', building: 'A', status: 'Empty', rentPrice: '' });
  };

  const handleAddInputChange = (field, value) => {
    setAddForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveNewApartment = () => {
    // Validation
    if (!addForm.number.trim()) {
      alert('Please enter apartment number');
      return;
    }

    if (!addForm.rentPrice || isNaN(addForm.rentPrice) || parseFloat(addForm.rentPrice) <= 0) {
      alert('Please enter a valid rent price');
      return;
    }

    // Check if apartment number already exists
    const exists = apartments.some(apt => apt.number.toLowerCase() === addForm.number.trim().toLowerCase());
    if (exists) {
      alert('Apartment number already exists');
      return;
    }

    // Create new apartment
    const newId = apartments.length > 0 ? Math.max(...apartments.map(apt => apt.id)) + 1 : 1;
    const newApartment = {
      id: newId,
      number: addForm.number.trim(),
      building: addForm.building,
      status: addForm.status,
      rentPrice: parseFloat(addForm.rentPrice)
    };

    // Add to apartments list
    setApartments(prev => [...prev, newApartment]);
    
    // Close modal and reset form
    setShowAddModal(false);
    setAddForm({ number: '', building: 'A', status: 'Empty', rentPrice: '' });
    
    // Show success message
    alert('Apartment added successfully!');
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setAddForm({ number: '', building: 'A', status: 'Empty', rentPrice: '' });
  };

  // Delete function
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this apartment?')) {
      setApartments(prev => prev.filter(apt => apt.id !== id));
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
            Add Apartment Detail
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
              placeholder=""
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
                  onClick={() => handleSort('number')}
                >
                  <div className="flex items-center gap-1">
                    Apartment Number
                    <span className="text-xs">{getSortIcon('number')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('building')}
                >
                  <div className="flex items-center gap-1">
                    Building
                    <span className="text-xs">{getSortIcon('building')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('rentPrice')}
                >
                  <div className="flex items-center gap-1">
                    Rent Price
                    <span className="text-xs">{getSortIcon('rentPrice')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <span className="text-xs">{getSortIcon('status')}</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedApartments.slice(0, entriesPerPage).map((apartment, index) => (
                <tr key={apartment.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === apartment.id ? (
                      <input
                        type="text"
                        value={editForm.number}
                        onChange={(e) => handleInputChange('number', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      apartment.number
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === apartment.id ? (
                      <select
                        value={editForm.building}
                        onChange={(e) => handleInputChange('building', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    ) : (
                      apartment.building
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === apartment.id ? (
                      <input
                        type="number"
                        value={editForm.rentPrice}
                        onChange={(e) => handleInputChange('rentPrice', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Rent price"
                        min="0"
                        step="100000"
                      />
                    ) : (
                      formatCurrency(apartment.rentPrice)
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === apartment.id ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Empty">Empty</option>
                        <option value="Owned">Owned</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        apartment.status === 'Empty' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {apartment.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {editingId === apartment.id ? (
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
                            onClick={() => handleEdit(apartment)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(apartment.id)}
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
          Showing {Math.min(entriesPerPage, filteredApartments.length)} of {filteredApartments.length} entries
          {searchTerm && ` (filtered from ${apartments.length} total entries)`}
        </div>
      </div>

      {/* Add Apartment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New Apartment</h2>
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
                    Apartment Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.number}
                    onChange={(e) => handleAddInputChange('number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter apartment number (e.g., 101, 202)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Building
                  </label>
                  <select
                    value={addForm.building}
                    onChange={(e) => handleAddInputChange('building', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="A">Building A</option>
                    <option value="B">Building B</option>
                    <option value="C">Building C</option>
                    <option value="D">Building D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rent Price (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={addForm.rentPrice}
                    onChange={(e) => handleAddInputChange('rentPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter rent price in VND"
                    min="0"
                    step="100000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={addForm.status}
                    onChange={(e) => handleAddInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Empty">Empty</option>
                    <option value="Owned">Owned</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveNewApartment}
                  className=" mt-4 flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Check size={16} />
                  Add Apartment
                </button>
            
                <button
                  onClick={handleCancelAdd}
                  className="mt-4 flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
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

export default ParkingPayments;