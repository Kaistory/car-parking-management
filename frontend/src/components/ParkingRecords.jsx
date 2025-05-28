import React, { useState } from 'react';
import { Edit, Trash2, Plus, X, Check } from 'lucide-react';

const ParkingRecords = () => {
  const [parkingRecords, setParkingRecords] = useState([
    { 
      id: 1, 
      vehicleId: '673a2b1c4f8e9d0012345678', 
      vehicleModel: 'ResidentVehicle', 
      entryTime: new Date('2024-05-28T08:30:00'), 
      exitTime: null, 
      status: 'IN' 
    },
    { 
      id: 2, 
      vehicleId: '673a2b1c4f8e9d0012345679', 
      vehicleModel: 'VisitorVehicle', 
      entryTime: new Date('2024-05-28T09:15:00'), 
      exitTime: new Date('2024-05-28T11:45:00'), 
      status: 'OUT' 
    },
    { 
      id: 3, 
      vehicleId: '673a2b1c4f8e9d001234567a', 
      vehicleModel: 'ResidentVehicle', 
      entryTime: new Date('2024-05-28T07:00:00'), 
      exitTime: null, 
      status: 'IN' 
    },
    { 
      id: 4, 
      vehicleId: '673a2b1c4f8e9d001234567b', 
      vehicleModel: 'VisitorVehicle', 
      entryTime: new Date('2024-05-28T10:20:00'), 
      exitTime: new Date('2024-05-28T12:30:00'), 
      status: 'OUT' 
    },
    { 
      id: 5, 
      vehicleId: '673a2b1c4f8e9d001234567c', 
      vehicleModel: 'ResidentVehicle', 
      entryTime: new Date('2024-05-28T06:45:00'), 
      exitTime: null, 
      status: 'IN' 
    },
    { 
      id: 6, 
      vehicleId: '673a2b1c4f8e9d001234567d', 
      vehicleModel: 'VisitorVehicle', 
      entryTime: new Date('2024-05-27T14:30:00'), 
      exitTime: new Date('2024-05-27T16:20:00'), 
      status: 'OUT' 
    },
    { 
      id: 7, 
      vehicleId: '673a2b1c4f8e9d001234567e', 
      vehicleModel: 'ResidentVehicle', 
      entryTime: new Date('2024-05-28T13:15:00'), 
      exitTime: null, 
      status: 'IN' 
    },
    { 
      id: 8, 
      vehicleId: '673a2b1c4f8e9d001234567f', 
      vehicleModel: 'VisitorVehicle', 
      entryTime: new Date('2024-05-28T11:00:00'), 
      exitTime: new Date('2024-05-28T13:45:00'), 
      status: 'OUT' 
    },
    { 
      id: 9, 
      vehicleId: '673a2b1c4f8e9d0012345680', 
      vehicleModel: 'ResidentVehicle', 
      entryTime: new Date('2024-05-28T05:30:00'), 
      exitTime: null, 
      status: 'IN' 
    },
    { 
      id: 10, 
      vehicleId: '673a2b1c4f8e9d0012345681', 
      vehicleModel: 'VisitorVehicle', 
      entryTime: new Date('2024-05-28T16:00:00'), 
      exitTime: null, 
      status: 'IN' 
    }
  ]);

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ 
    vehicleId: '', 
    vehicleModel: 'ResidentVehicle', 
    entryTime: '', 
    exitTime: '', 
    status: 'IN' 
  });
  
  // Add states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ 
    vehicleId: '', 
    vehicleModel: 'ResidentVehicle', 
    entryTime: '', 
    exitTime: '', 
    status: 'IN' 
  });

  // Helper function to format date and time
  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Helper function to calculate duration
  const calculateDuration = (entryTime, exitTime) => {
    if (!exitTime) return 'Still parked';
    const duration = new Date(exitTime) - new Date(entryTime);
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Filter parking records based on search term
  const filteredRecords = parkingRecords.filter(record =>
    record.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatDateTime(record.entryTime).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.exitTime && formatDateTime(record.exitTime).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort parking records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    // Handle date sorting
    if (sortConfig.key === 'entryTime' || sortConfig.key === 'exitTime') {
      aValue = aValue ? new Date(aValue) : new Date(0);
      bValue = bValue ? new Date(bValue) : new Date(0);
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
  const handleEdit = (record) => {
    setEditingId(record.id);
    setEditForm({
      vehicleId: record.vehicleId,
      vehicleModel: record.vehicleModel,
      entryTime: record.entryTime ? new Date(record.entryTime).toISOString().slice(0, 16) : '',
      exitTime: record.exitTime ? new Date(record.exitTime).toISOString().slice(0, 16) : '',
      status: record.status
    });
  };

  const handleSaveEdit = () => {
    // Validation
    if (!editForm.vehicleId.trim()) {
      alert('Please enter a valid Vehicle ID');
      return;
    }
    if (!editForm.entryTime) {
      alert('Please enter entry time');
      return;
    }
    if (editForm.exitTime && new Date(editForm.exitTime) <= new Date(editForm.entryTime)) {
      alert('Exit time must be after entry time');
      return;
    }

    setParkingRecords(prev => prev.map(record => 
      record.id === editingId 
        ? { 
            ...record, 
            vehicleId: editForm.vehicleId.trim(),
            vehicleModel: editForm.vehicleModel,
            entryTime: new Date(editForm.entryTime),
            exitTime: editForm.exitTime ? new Date(editForm.exitTime) : null,
            status: editForm.status
          }
        : record
    ));
    setEditingId(null);
    setEditForm({ vehicleId: '', vehicleModel: 'ResidentVehicle', entryTime: '', exitTime: '', status: 'IN' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ vehicleId: '', vehicleModel: 'ResidentVehicle', entryTime: '', exitTime: '', status: 'IN' });
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
    const now = new Date().toISOString().slice(0, 16);
    setAddForm({ 
      vehicleId: '', 
      vehicleModel: 'ResidentVehicle', 
      entryTime: now, 
      exitTime: '', 
      status: 'IN' 
    });
  };

  const handleAddInputChange = (field, value) => {
    setAddForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveNewRecord = () => {
    // Validation
    if (!addForm.vehicleId.trim()) {
      alert('Please enter Vehicle ID');
      return;
    }
    if (!addForm.entryTime) {
      alert('Please enter entry time');
      return;
    }
    if (addForm.exitTime && new Date(addForm.exitTime) <= new Date(addForm.entryTime)) {
      alert('Exit time must be after entry time');
      return;
    }

    // Create new parking record
    const newId = parkingRecords.length > 0 ? Math.max(...parkingRecords.map(record => record.id)) + 1 : 1;
    const newRecord = {
      id: newId,
      vehicleId: addForm.vehicleId.trim(),
      vehicleModel: addForm.vehicleModel,
      entryTime: new Date(addForm.entryTime),
      exitTime: addForm.exitTime ? new Date(addForm.exitTime) : null,
      status: addForm.status
    };

    // Add to parking records list
    setParkingRecords(prev => [...prev, newRecord]);
    
    // Close modal and reset form
    setShowAddModal(false);
    setAddForm({ vehicleId: '', vehicleModel: 'ResidentVehicle', entryTime: '', exitTime: '', status: 'IN' });
    
    // Show success message
    alert('Parking record added successfully!');
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setAddForm({ vehicleId: '', vehicleModel: 'ResidentVehicle', entryTime: '', exitTime: '', status: 'IN' });
  };

  // Delete function
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this parking record?')) {
      setParkingRecords(prev => prev.filter(record => record.id !== id));
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
            Add Parking Record
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
                  onClick={() => handleSort('vehicleId')}
                >
                  <div className="flex items-center gap-1">
                    Vehicle ID
                    <span className="text-xs">{getSortIcon('vehicleId')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('vehicleModel')}
                >
                  <div className="flex items-center gap-1">
                    Vehicle Model
                    <span className="text-xs">{getSortIcon('vehicleModel')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('entryTime')}
                >
                  <div className="flex items-center gap-1">
                    Entry Time
                    <span className="text-xs">{getSortIcon('entryTime')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('exitTime')}
                >
                  <div className="flex items-center gap-1">
                    Exit Time
                    <span className="text-xs">{getSortIcon('exitTime')}</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                  Duration
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
              {sortedRecords.slice(0, entriesPerPage).map((record, index) => (
                <tr key={record.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === record.id ? (
                      <input
                        type="text"
                        value={editForm.vehicleId}
                        onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="font-mono text-xs">{record.vehicleId}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === record.id ? (
                      <select
                        value={editForm.vehicleModel}
                        onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="ResidentVehicle">ResidentVehicle</option>
                        <option value="VisitorVehicle">VisitorVehicle</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.vehicleModel === 'ResidentVehicle' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {record.vehicleModel}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === record.id ? (
                      <input
                        type="datetime-local"
                        value={editForm.entryTime}
                        onChange={(e) => handleInputChange('entryTime', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      formatDateTime(record.entryTime)
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === record.id ? (
                      <input
                        type="datetime-local"
                        value={editForm.exitTime}
                        onChange={(e) => handleInputChange('exitTime', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      formatDateTime(record.exitTime)
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {calculateDuration(record.entryTime, record.exitTime)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === record.id ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="IN">IN</option>
                        <option value="OUT">OUT</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'IN' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {editingId === record.id ? (
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
                            onClick={() => handleEdit(record)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
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
          Showing {Math.min(entriesPerPage, filteredRecords.length)} of {filteredRecords.length} entries
          {searchTerm && ` (filtered from ${parkingRecords.length} total entries)`}
        </div>
      </div>

      {/* Add Parking Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New Parking Record</h2>
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
                    Vehicle ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.vehicleId}
                    onChange={(e) => handleAddInputChange('vehicleId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="Enter vehicle ID (e.g., 673a2b1c4f8e9d0012345678)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Model
                  </label>
                  <select
                    value={addForm.vehicleModel}
                    onChange={(e) => handleAddInputChange('vehicleModel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ResidentVehicle">ResidentVehicle</option>
                    <option value="VisitorVehicle">VisitorVehicle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entry Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={addForm.entryTime}
                    onChange={(e) => handleAddInputChange('entryTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exit Time
                  </label>
                  <input
                    type="datetime-local"
                    value={addForm.exitTime}
                    onChange={(e) => handleAddInputChange('exitTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty if vehicle is still parked</p>
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
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveNewRecord}
                  className="mt-4 flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Check size={16} />
                  Add Record
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="mt-4 flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
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

export default ParkingRecords;