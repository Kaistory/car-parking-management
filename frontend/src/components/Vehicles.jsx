import React, { useState, useContext } from 'react';
import { Edit, Trash2, Plus, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { DashBoardContext } from '../context/DashboardContext';

const Vehicles = () => {
  const {vehicleResident, updateVehicleById, deleteVehicleById, createVehicle, apartment} = useContext(DashBoardContext);

  const [vehicles, setVehicles] = useState(vehicleResident);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ apartmentId: '', plateNumber: '', vehicleType: '', rfidTag: '' });
  
  // Add states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ apartmentId: '', plateNumber: '', vehicleType: 'Ô tô', rfidTag: '' });

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

  // Pagination calculations
  const totalPages = Math.ceil(sortedVehicles.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentVehicles = sortedVehicles.slice(startIndex, endIndex);

  // Reset to first page when search term or entries per page changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return '↕️';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Pagination functions
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(currentPage - halfVisible, 1);
      let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
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
      alert('Vui lòng chọn mã căn hộ');
      return;
    }

    if (!editForm.plateNumber.trim()) {
      alert('Vui lòng nhập biển số xe');
      return;
    }

    // Check if plate number already exists (excluding current record)
    const plateExists = vehicles.some(vehicle => 
      vehicle._id !== editingId && 
      vehicle.plateNumber.toLowerCase() === editForm.plateNumber.trim().toLowerCase()
    );
    if (plateExists) {
      alert('Biển số xe đã tồn tại');
      return;
    }

    // Check if RFID tag already exists (excluding current record and empty values)
    if (editForm.rfidTag.trim()) {
      const rfidExists = vehicles.some(vehicle => 
        vehicle._id !== editingId && 
        vehicle.rfidTag.toLowerCase() === editForm.rfidTag.trim().toLowerCase()
      );
      if (rfidExists) {
        alert('Thẻ RFID đã tồn tại');
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
    setAddForm({ apartmentId: '', plateNumber: '', vehicleType: 'Ô tô', rfidTag: '' });
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
      alert('Vui lòng chọn mã căn hộ');
      return;
    }

    if (!addForm.plateNumber.trim()) {
      alert('Vui lòng nhập biển số xe');
      return;
    }

    // Check if plate number already exists
    const plateExists = vehicles.some(vehicle => 
      vehicle.plateNumber.toLowerCase() === addForm.plateNumber.trim().toLowerCase()
    );
    if (plateExists) {
      alert('Biển số xe đã tồn tại');
      return;
    }

    // Check if RFID tag already exists (if provided)
    if (addForm.rfidTag.trim()) {
      const rfidExists = vehicles.some(vehicle => 
        vehicle.rfidTag.toLowerCase() === addForm.rfidTag.trim().toLowerCase()
      );
      if (rfidExists) {
        alert('Thẻ RFID đã tồn tại');
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
    setAddForm({ apartmentId: '', plateNumber: '', vehicleType: '', rfidTag: '' });
    
    // Show success message
    alert('Thêm phương tiện thành công!');
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setAddForm({ apartmentId: '', plateNumber: '', vehicleType: '', rfidTag: '' });
  };

  // Delete function
  const handleDelete = (_id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phương tiện này?')) {
      deleteVehicleById(_id);
      setVehicles(prev => prev.filter(vehicle => vehicle._id !== _id));
      
      // Adjust current page if needed after deletion
      const newTotalPages = Math.ceil((sortedVehicles.length - 1) / entriesPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
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
            Thêm phương tiện cư dân
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Hiển thị</span>
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
            <span className="text-gray-600">mục</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">Tìm kiếm:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập từ khóa..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                  STT
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('apartmentId')}
                >
                  <div className="flex items-center gap-1">
                    Căn hộ
                    <span className="text-xs">{getSortIcon('apartmentId')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('plateNumber')}
                >
                  <div className="flex items-center gap-1">
                    Biển số xe
                    <span className="text-xs">{getSortIcon('plateNumber')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('vehicleType')}
                >
                  <div className="flex items-center gap-1">
                    Loại xe
                    <span className="text-xs">{getSortIcon('vehicleType')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('rfidTag')}
                >
                  <div className="flex items-center gap-1">
                    Thẻ RFID
                    <span className="text-xs">{getSortIcon('rfidTag')}</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {currentVehicles.map((vehicle, index) => (
                <tr key={vehicle._id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === vehicle._id ? (
                      <select
                        value={editForm.apartmentId}
                        onChange={(e) => handleInputChange('apartmentId', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn căn hộ</option>
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
                        placeholder="VD: 30A-12345"
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
                        vehicle.vehicleType === 'Ô tô' || vehicle.vehicleType === 'Car' ? 'bg-green-100 text-green-800' :
                        vehicle.vehicleType === 'Xe máy' || vehicle.vehicleType === 'Motorbike' ? 'bg-orange-100 text-orange-800' :
                        vehicle.vehicleType === 'Xe đạp' || vehicle.vehicleType === 'Bicycle' ? 'bg-purple-100 text-purple-800' :
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
                        placeholder="VD: RFID001"
                      />
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                        {vehicle.rfidTag || 'Không có'}
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
                            title="Lưu"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                            title="Hủy"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(vehicle)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle._id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {startIndex + 1} đến {Math.min(endIndex, sortedVehicles.length)} trên {sortedVehicles.length} mục
              {searchTerm && ` (đã lọc từ ${vehicles.length} tổng số mục)`}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                } transition-colors`}
                title="Trang trước"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    } transition-colors`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                } transition-colors`}
                title="Trang sau"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Footer - only show when no pagination */}
        {totalPages <= 1 && (
          <div className="p-4 text-sm text-gray-600 border-t border-gray-200">
            Hiển thị {Math.min(entriesPerPage, filteredVehicles.length)} trên {filteredVehicles.length} mục
            {searchTerm && ` (đã lọc từ ${vehicles.length} tổng số mục)`}
          </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Thêm phương tiện mới</h2>
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
                    Căn hộ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addForm.apartmentId}
                    onChange={(e) => handleAddInputChange('apartmentId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn căn hộ</option>
                    {availableApartments.map(aptId => (
                      <option key={aptId} value={aptId}>{apartment.find(a => a._id === aptId)?.apartmentNumber}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biển số xe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.plateNumber}
                    onChange={(e) => handleAddInputChange('plateNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: 30A-12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại xe
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
                    Thẻ RFID
                  </label>
                  <input
                    type="text"
                    value={addForm.rfidTag}  
                    onChange={(e) => handleAddInputChange('rfidTag', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: RFID001 (tùy chọn)"
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
                  Thêm phương tiện
                </button>
            
                <button
                  onClick={handleCancelAdd}
                  className="mt-4 flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <X size={16} />
                  Hủy
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