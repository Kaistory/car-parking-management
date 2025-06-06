import React, { useState, useContext } from 'react';
import { Edit, Trash2, Plus, X, Check } from 'lucide-react';
import { DashBoardContext } from '../context/DashboardContext';
const Vehicles = () => {
  const {vehicleResident, updateVehicleById, deleteVehicleById, createVehicle, apartment} = useContext(DashBoardContext);
  // const [vehicles, setVehicles] = useState([
  //   { _id: 1, apartmentId: 'APT001', plateNumber: '30A-12345', vehicleType: 'Car', rfidTag: 'RFID001' },
  //   { _id: 2, apartmentId: 'APT002', plateNumber: '29B-67890', vehicleType: 'Motorcycle', rfidTag: 'RFID002' },
  //   { _id: 3, apartmentId: 'APT003', plateNumber: '30C-11111', vehicleType: 'Car', rfidTag: 'RFID003' },
  //   { _id: 4, apartmentId: 'APT001', plateNumber: '29D-22222', vehicleType: 'Motorcycle', rfidTag: 'RFID004' },
  //   { _id: 5, apartmentId: 'APT004', plateNumber: '30E-33333', vehicleType: 'Car', rfidTag: 'RFID005' },
  //   { _id: 6, apartmentId: 'APT002', plateNumber: '29F-44444', vehicleType: 'Bicycle', rfidTag: 'RFID006' },
  //   { _id: 7, apartmentId: 'APT005', plateNumber: '30G-55555', vehicleType: 'Car', rfidTag: 'RFID007' },
  //   { _id: 8, apartmentId: 'APT003', plateNumber: '29H-66666', vehicleType: 'Motorcycle', rfidTag: 'RFID008' },
  //   { _id: 9, apartmentId: 'APT006', plateNumber: '30I-77777', vehicleType: 'Car', rfidTag: 'RFID009' },
  //   { _id: 10, apartmentId: 'APT004', plateNumber: '29J-88888', vehicleType: 'Bicycle', rfidTag: 'RFID010' }
  // ]);
  const [vehicles, setVehicles] = useState(vehicleResident);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ apartmentId: '', plateNumber: '', vehicleType: '', rfidTag: '' });
  
  // Add states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ apartmentId: '', plateNumber: '', vehicleType: 'Car', rfidTag: '' });

  // Available apartment IDs (in real app, this would come from API)
  const availableApartments = apartment.map(a => a._id);

  // Vehicle types
  const vehicleTypes = ['Car', 'Motorbike', 'Bicycle', 'Truck', 'Van'];

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.apartmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.rfidTag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
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
  const handleEdit = (vehicle) => {
    setEditingId(vehicle._id);
    setEditForm({
      apartmentId: vehicle.apartmentId,
      plateNumber: vehicle.plateNumber,
      vehicleType: vehicle.vehicleType,
      rfidTag: vehicle.rfidTag
    });
  };

  const handleSaveEdit = () => {
    // Validation
    if (!editForm.apartmentId.trim()) {
      alert('Please select an apartment _id');
      return;
    }

    if (!editForm.plateNumber.trim()) {
      alert('Please enter a plate number');
      return;
    }

    // Check if plate number already exists (excluding current record)
    const plateExists = vehicles.some(vehicle => 
      vehicle._id !== editingId && 
      vehicle.plateNumber.toLowerCase() === editForm.plateNumber.trim().toLowerCase()
    );
    if (plateExists) {
      alert('Plate number already exists');
      return;
    }

    // Check if RFID tag already exists (excluding current record and empty values)
    if (editForm.rfidTag.trim()) {
      const rfidExists = vehicles.some(vehicle => 
        vehicle._id !== editingId && 
        vehicle.rfidTag.toLowerCase() === editForm.rfidTag.trim().toLowerCase()
      );
      if (rfidExists) {
        alert('RFID tag already exists');
        return;
      }
    }

    setVehicles(prev => prev.map(vehicle => 
      vehicle._id === editingId 
        ? { 
            ...vehicle, 
            apartmentId: editForm.apartmentId.trim(),
            plateNumber: editForm.plateNumber.trim(),
            vehicleType: editForm.vehicleType,
            rfidTag: editForm.rfidTag.trim()
          }
        : vehicle
    ));
    updateVehicleById({
    _id: editingId,
    apartmentId: editForm.apartmentId.trim(),
    plateNumber: editForm.plateNumber.trim(),
    vehicleType: editForm.vehicleType,
    rfidTag: editForm.rfidTag.trim()
    });
    setEditingId(null);
    setEditForm({ apartmentId: '', plateNumber: '', vehicleType: '', rfidTag: '' });
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ apartmentId: '', plateNumber: '', vehicleType: '', rfidTag: '' });
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
    setAddForm({ apartmentId: '', plateNumber: '', vehicleType: 'Car', rfidTag: '' });
  };

  const handleAddInputChange = (field, value) => {
    setAddForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveNewVehicle = () => {
    // Validation
    if (!addForm.apartmentId.trim()) {
      alert('Please select an apartment _id');
      return;
    }

    if (!addForm.plateNumber.trim()) {
      alert('Please enter a plate number');
      return;
    }

    // Check if plate number already exists
    const plateExists = vehicles.some(vehicle => 
      vehicle.plateNumber.toLowerCase() === addForm.plateNumber.trim().toLowerCase()
    );
    if (plateExists) {
      alert('Plate number already exists');
      return;
    }

    // Check if RFID tag already exists (if provided)
    if (addForm.rfidTag.trim()) {
      const rfidExists = vehicles.some(vehicle => 
        vehicle.rfidTag.toLowerCase() === addForm.rfidTag.trim().toLowerCase()
      );
      if (rfidExists) {
        alert('RFID tag already exists');
        return;
      }
    }

    // Create new vehicle
    const newId = vehicles.length > 0 ? Math.max(...vehicles.map(v => v._id)) + 1 : 1;
    console.log("leng:",vehicles.length);
    const newVehicle = {
      // _id: newId,
      apartmentId: addForm.apartmentId.trim(),
      plateNumber: addForm.plateNumber.trim(),
      vehicleType: addForm.vehicleType,
      rfidTag: addForm.rfidTag.trim()
    };
    createVehicle(newVehicle);
    // Add to vehicles list
    setVehicles(prev => [...prev, newVehicle]);
    
    // Close modal and reset form
    setShowAddModal(false);
    setAddForm({ apartmentId: '', plateNumber: '', vehicleType: 'Car', rfidTag: '' });
    
    // Show success message
    alert('Vehicle added successfully!');
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setAddForm({ apartmentId: '', plateNumber: '', vehicleType: 'Car', rfidTag: '' });
  };

  // Delete function
  const handleDelete = (_id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      deleteVehicleById(_id);
      setVehicles(prev => prev.filter(vehicle => vehicle._id !== _id));
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
            Add Resident Vehicle
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
                  onClick={() => handleSort('apartmentId')}
                >
                  <div className="flex items-center gap-1">
                    Apartment _id
                    <span className="text-xs">{getSortIcon('apartmentId')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('plateNumber')}
                >
                  <div className="flex items-center gap-1">
                    Plate Number
                    <span className="text-xs">{getSortIcon('plateNumber')}</span>
                  </div>
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
                  onClick={() => handleSort('rfidTag')}
                >
                  <div className="flex items-center gap-1">
                    RFID Tag
                    <span className="text-xs">{getSortIcon('rfidTag')}</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedVehicles.slice(0, entriesPerPage).map((vehicle, index) => (
                <tr key={vehicle._id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === vehicle._id ? (
                      <select
                        value={editForm.apartmentId}
                        onChange={(e) => handleInputChange('apartmentId', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Apartment</option>
                        {availableApartments.map(aptId => (
                          <option key={aptId} value={aptId}>{apartment.find(a => a._id === aptId)?.apartmentNumber}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {apartment.find(a => a._id === vehicle.apartmentId)?.apartmentNumber}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === vehicle._id ? (
                      <input
                        type="text"
                        value={editForm.plateNumber}
                        onChange={(e) => handleInputChange('plateNumber', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 30A-12345"
                      />
                    ) : (
                      <span className="font-mono font-semibold">
                        {vehicle.plateNumber}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === vehicle._id ? (
                      <select
                        value={editForm.vehicleType}
                        onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {vehicleTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vehicle.vehicleType === 'Car' ? 'bg-green-100 text-green-800' :
                        vehicle.vehicleType === 'Motorbike' ? 'bg-orange-100 text-orange-800' :
                        vehicle.vehicleType === 'Bicycle' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {vehicle.vehicleType}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === vehicle._id ? (
                      <input
                        type="text"
                        value={editForm.rfidTag}
                        onChange={(e) => handleInputChange('rfidTag', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., RFID001"
                      />
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                        {vehicle.rfidTag || 'N/A'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {editingId === vehicle._id ? (
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
                            onClick={() => handleEdit(vehicle)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle._id)}
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
          Showing {Math.min(entriesPerPage, filteredVehicles.length)} of {filteredVehicles.length} entries
          {searchTerm && ` (filtered from ${vehicles.length} total entries)`}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New Vehicle</h2>
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
                    Apartment Id <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addForm.apartmentId}
                    onChange={(e) => handleAddInputChange('apartmentId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select an apartment</option>
                    {availableApartments.map(aptId => (
                      <option key={aptId} value={aptId}>{apartment.find(a => a._id === aptId)?.apartmentNumber}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plate Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.plateNumber}
                    onChange={(e) => handleAddInputChange('plateNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 30A-12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <select
                    value={addForm.vehicleType}
                    onChange={(e) => handleAddInputChange('vehicleType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RFID Tag
                  </label>
                  <input
                    type="text"
                    value={addForm.rfidTag}  
                    onChange={(e) => handleAddInputChange('rfidTag', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., RFID001 (optional)"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveNewVehicle}
                  className="mt-4 flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Check size={16} />
                  Add Vehicle
                </button>
            
                <button
                  onClick={handleCancelAdd}
                  className="mt-4 flex-1 bg-blue-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
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

export default Vehicles;