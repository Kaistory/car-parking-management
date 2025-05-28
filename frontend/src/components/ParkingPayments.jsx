import React, { useState } from 'react';
import { Edit, Trash2, Plus, X, Check } from 'lucide-react';

const ParkingPayments = () => {
  // Mock apartment data for reference
  const apartmentsList = [
    { id: '507f1f77bcf86cd799439011', number: '201', building: 'C' },
    { id: '507f1f77bcf86cd799439012', number: '269', building: 'A' },
    { id: '507f1f77bcf86cd799439013', number: '333', building: 'D' },
    { id: '507f1f77bcf86cd799439014', number: '69', building: 'B' },
    { id: '507f1f77bcf86cd799439015', number: '255', building: 'B' },
    { id: '507f1f77bcf86cd799439016', number: '86', building: 'A' },
    { id: '507f1f77bcf86cd799439017', number: '179', building: 'A' },
    { id: '507f1f77bcf86cd799439018', number: '321', building: 'D' },
    { id: '507f1f77bcf86cd799439019', number: '203', building: 'B' },
    { id: '507f1f77bcf86cd79943901a', number: '888', building: 'A' },
  ];

  const [parkingPayments, setParkingPayments] = useState([
    { 
      id: 1, 
      apartmentId: '507f1f77bcf86cd799439011', 
      amountPaid: 500000, 
      paymentDate: new Date('2024-01-15') 
    },
    { 
      id: 2, 
      apartmentId: '507f1f77bcf86cd799439012', 
      amountPaid: 750000, 
      paymentDate: new Date('2024-01-16') 
    },
    { 
      id: 3, 
      apartmentId: '507f1f77bcf86cd799439013', 
      amountPaid: 600000, 
      paymentDate: new Date('2024-01-18') 
    },
    { 
      id: 4, 
      apartmentId: '507f1f77bcf86cd799439014', 
      amountPaid: 450000, 
      paymentDate: new Date('2024-01-20') 
    },
    { 
      id: 5, 
      apartmentId: '507f1f77bcf86cd799439015', 
      amountPaid: 800000, 
      paymentDate: new Date('2024-01-22') 
    },
    { 
      id: 6, 
      apartmentId: '507f1f77bcf86cd799439016', 
      amountPaid: 550000, 
      paymentDate: new Date('2024-01-25') 
    },
    { 
      id: 7, 
      apartmentId: '507f1f77bcf86cd799439017', 
      amountPaid: 700000, 
      paymentDate: new Date('2024-01-28') 
    },
    { 
      id: 8, 
      apartmentId: '507f1f77bcf86cd799439018', 
      amountPaid: 900000, 
      paymentDate: new Date('2024-02-01') 
    },
    { 
      id: 9, 
      apartmentId: '507f1f77bcf86cd799439019', 
      amountPaid: 650000, 
      paymentDate: new Date('2024-02-03') 
    },
    { 
      id: 10, 
      apartmentId: '507f1f77bcf86cd79943901a', 
      amountPaid: 1200000, 
      paymentDate: new Date('2024-02-05') 
    }
  ]);

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ apartmentId: '', amountPaid: '', paymentDate: '' });
  
  // Add states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ apartmentId: '', amountPaid: '', paymentDate: '' });

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Helper function to get apartment info by ID
  const getApartmentInfo = (apartmentId) => {
    const apartment = apartmentsList.find(apt => apt.id === apartmentId);
    return apartment ? `${apartment.number} (${apartment.building})` : 'Unknown';
  };

  // Filter payments based on search term
  const filteredPayments = parkingPayments.filter(payment => {
    const apartmentInfo = getApartmentInfo(payment.apartmentId).toLowerCase();
    const amountStr = payment.amountPaid.toString();
    const dateStr = formatDate(payment.paymentDate).toLowerCase();
    
    return apartmentInfo.includes(searchTerm.toLowerCase()) ||
           amountStr.includes(searchTerm.toLowerCase()) ||
           dateStr.includes(searchTerm.toLowerCase());
  });

  // Sort payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    // Special handling for apartment sorting
    if (sortConfig.key === 'apartmentId') {
      aValue = getApartmentInfo(a.apartmentId);
      bValue = getApartmentInfo(b.apartmentId);
    }
    
    // Special handling for date sorting
    if (sortConfig.key === 'paymentDate') {
      aValue = new Date(a.paymentDate);
      bValue = new Date(b.paymentDate);
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
  const handleEdit = (payment) => {
    setEditingId(payment.id);
    setEditForm({
      apartmentId: payment.apartmentId,
      amountPaid: payment.amountPaid.toString(),
      paymentDate: payment.paymentDate.toISOString().split('T')[0]
    });
  };

  const handleSaveEdit = () => {
    // Validation
    if (!editForm.apartmentId) {
      alert('Please select an apartment');
      return;
    }

    if (!editForm.amountPaid || isNaN(editForm.amountPaid) || parseFloat(editForm.amountPaid) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    if (!editForm.paymentDate) {
      alert('Please select a payment date');
      return;
    }

    setParkingPayments(prev => prev.map(payment => 
      payment.id === editingId 
        ? { 
            ...payment, 
            apartmentId: editForm.apartmentId,
            amountPaid: parseFloat(editForm.amountPaid),
            paymentDate: new Date(editForm.paymentDate)
          }
        : payment
    ));
    setEditingId(null);
    setEditForm({ apartmentId: '', amountPaid: '', paymentDate: '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ apartmentId: '', amountPaid: '', paymentDate: '' });
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
      apartmentId: apartmentsList[0]?.id || '', 
      amountPaid: '', 
      paymentDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleAddInputChange = (field, value) => {
    setAddForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveNewPayment = () => {
    // Validation
    if (!addForm.apartmentId) {
      alert('Please select an apartment');
      return;
    }

    if (!addForm.amountPaid || isNaN(addForm.amountPaid) || parseFloat(addForm.amountPaid) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    if (!addForm.paymentDate) {
      alert('Please select a payment date');
      return;
    }

    // Create new payment
    const newId = parkingPayments.length > 0 ? Math.max(...parkingPayments.map(payment => payment.id)) + 1 : 1;
    const newPayment = {
      id: newId,
      apartmentId: addForm.apartmentId,
      amountPaid: parseFloat(addForm.amountPaid),
      paymentDate: new Date(addForm.paymentDate)
    };

    // Add to payments list
    setParkingPayments(prev => [...prev, newPayment]);
    
    // Close modal and reset form
    setShowAddModal(false);
    setAddForm({ apartmentId: '', amountPaid: '', paymentDate: '' });
    
    // Show success message
    alert('Payment record added successfully!');
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setAddForm({ apartmentId: '', amountPaid: '', paymentDate: '' });
  };

  // Delete function
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      setParkingPayments(prev => prev.filter(payment => payment.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button 
              onClick={openAddModal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Add Payment Record
            </button>
          </div>
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
              placeholder="Search by apartment, amount, or date..."
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
                  onClick={() => handleSort('apartmentId')}
                >
                  <div className="flex items-center gap-1">
                    Apartment
                    <span className="text-xs">{getSortIcon('apartmentId')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('amountPaid')}
                >
                  <div className="flex items-center gap-1">
                    Amount Paid
                    <span className="text-xs">{getSortIcon('amountPaid')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('paymentDate')}
                >
                  <div className="flex items-center gap-1">
                    Payment Date
                    <span className="text-xs">{getSortIcon('paymentDate')}</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments.slice(0, entriesPerPage).map((payment, index) => (
                <tr key={payment.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === payment.id ? (
                      <select
                        value={editForm.apartmentId}
                        onChange={(e) => handleInputChange('apartmentId', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {apartmentsList.map(apt => (
                          <option key={apt.id} value={apt.id}>
                            {apt.number} ({apt.building})
                          </option>
                        ))}
                      </select>
                    ) : (
                      getApartmentInfo(payment.apartmentId)
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === payment.id ? (
                      <input
                        type="number"
                        value={editForm.amountPaid}
                        onChange={(e) => handleInputChange('amountPaid', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Amount paid"
                        min="0"
                        step="50000"
                      />
                    ) : (
                      formatCurrency(payment.amountPaid)
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === payment.id ? (
                      <input
                        type="date"
                        value={editForm.paymentDate}
                        onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      formatDate(payment.paymentDate)
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {editingId === payment.id ? (
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
                            onClick={() => handleEdit(payment)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(payment.id)}
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
          Showing {Math.min(entriesPerPage, filteredPayments.length)} of {filteredPayments.length} entries
          {searchTerm && ` (filtered from ${parkingPayments.length} total entries)`}
        </div>
      </div>

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New Payment Record</h2>
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
                    Apartment <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addForm.apartmentId}
                    onChange={(e) => handleAddInputChange('apartmentId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {apartmentsList.map(apt => (
                      <option key={apt.id} value={apt.id}>
                        {apt.number} ({apt.building})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Paid (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={addForm.amountPaid}
                    onChange={(e) => handleAddInputChange('amountPaid', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter payment amount in VND"
                    min="0"
                    step="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={addForm.paymentDate}
                    onChange={(e) => handleAddInputChange('paymentDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveNewPayment}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Check size={16} />
                  Add Payment
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

export default ParkingPayments;