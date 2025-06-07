import React, { useContext, useEffect, useState } from 'react';
import { Edit, Trash2, Plus, X, Check, FileSpreadsheet } from 'lucide-react';
import { DashBoardContext } from '../context/DashboardContext';
import { baseUrl, getRequest, postRequest } from "../utils/services";
import * as XLSX from 'xlsx';

// Thay vehicle id thành bảng hiển thị biển số xe
const ParkingRecords = () => {
  const {vehicleResident, updateRecordById, deleteRecordById, createRecord} = useContext(DashBoardContext);

  const [parkingRecords, setParkingRecords] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  // demo auto update
  useEffect(() => {
    const fetchInfo = async () => {
                const response3 = await getRequest(`${baseUrl}/parking/records`);  
                    if (response3.error) {
                        return console.error("Không thể tải dữ liệu bản ghi đỗ xe");
                    } 
                    setParkingRecords(response3);
                }
            fetchInfo();
  }, [parkingRecords]);
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
    if (!exitTime) return 'Đang đỗ';
    const duration = new Date(exitTime) - new Date(entryTime);
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}p`;
  };

  // Filter parking records based on search term
  const filteredRecords = parkingRecords.filter(record => {
    const vehicleIdStr = vehicleResident.find(v => v._id === record.vehicleId)?.plateNumber || 'Không có';
    return vehicleIdStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDateTime(record.entryTime).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.exitTime && formatDateTime(record.exitTime).toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Sort parking records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    // Handle null vehicleId for sorting
    if (sortConfig.key === 'vehicleId') {
      aValue = aValue || '';
      bValue = bValue || '';
    }
    
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

  // Excel export function
  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = sortedRecords.map((record, index) => ({
        'STT': index + 1,
        'Biển Số Xe': vehicleResident.find(v => v._id === record.vehicleId)?.plateNumber || 'Không có',
        'Loại Xe': record.vehicleModel === 'ResidentVehicle' ? 'Xe Cư Dân' : 'Xe Khách',
        'Thời Gian Vào': formatDateTime(record.entryTime),
        'Thời Gian Ra': formatDateTime(record.exitTime),
        'Thời Gian Đỗ': calculateDuration(record.entryTime, record.exitTime),
        'Trạng Thái': record.status === 'IN' ? 'VÀO' : 'RA'
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const colWidths = [
        { wch: 5 },   // STT
        { wch: 15 },  // Biển Số Xe
        { wch: 12 },  // Loại Xe
        { wch: 20 },  // Thời Gian Vào
        { wch: 20 },  // Thời Gian Ra
        { wch: 15 },  // Thời Gian Đỗ
        { wch: 12 }   // Trạng Thái
      ];
      worksheet['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Bản Ghi Đỗ Xe');

      // Generate filename with current date
      const currentDate = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
      const filename = `Ban_Ghi_Do_Xe_${currentDate}.xlsx`;

      // Write and download file
      XLSX.writeFile(workbook, filename);
      
      // Show success message
      alert(`Xuất file Excel thành công!\nTên file: ${filename}`);
    } catch (error) {
      console.error('Lỗi khi xuất file Excel:', error);
      alert('Có lỗi xảy ra khi xuất file Excel. Vui lòng thử lại.');
    }
  };

  // Edit functions
  const handleEdit = (record) => {
    setEditingId(record._id);
    setEditForm({
      vehicleId: record.vehicleId || '',
      vehicleModel: record.vehicleModel,
      entryTime: record.entryTime ? new Date(record.entryTime).toISOString().slice(0, 16) : '',
      exitTime: record.exitTime ? new Date(record.exitTime).toISOString().slice(0, 16) : '',
      status: record.status
    });
  };

  const handleSaveEdit = () => {
    // Validation
    if (!editForm.entryTime) {
      alert('Vui lòng nhập thời gian vào');
      return;
    }
    if (editForm.exitTime && new Date(editForm.exitTime) <= new Date(editForm.entryTime)) {
      alert('Thời gian ra phải sau thời gian vào');
      return;
    }

    
    updateRecordById({
      _id: editingId,
      vehicleId: editForm.vehicleId.trim() || null,
      vehicleModel: editForm.vehicleModel,
      entryTime: editForm.entryTime,
      exitTime: editForm.exitTime || null,
      status: editForm.status
    });
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
    if (!addForm.entryTime) {
      alert('Vui lòng nhập thời gian vào');
      return;
    }
    if (addForm.exitTime && new Date(addForm.exitTime) <= new Date(addForm.entryTime)) {
      alert('Thời gian ra phải sau thời gian vào');
      return;
    }

    // Create new parking record with MongoDB-like structure
    const newRecord = {
      _id: new Date().getTime().toString(), // Generate temporary ID
      vehicleId: addForm.vehicleId.trim() || null,
      vehicleModel: addForm.vehicleModel,
      entryTime: addForm.entryTime,
      exitTime: addForm.exitTime || null,
      status: addForm.status,
      __v: 0
    };

    // Add to parking records list
    createRecord(newRecord);
    // Close modal and reset form
    setShowAddModal(false);
    setAddForm({ vehicleId: '', vehicleModel: 'ResidentVehicle', entryTime: '', exitTime: '', status: 'IN' });
    
    // Show success message
    alert('Thêm bản ghi đỗ xe thành công!');
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setAddForm({ vehicleId: '', vehicleModel: 'ResidentVehicle', entryTime: '', exitTime: '', status: 'IN' });
  };

  // Delete function
  const handleDelete = (_id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi đỗ xe này không?')) {
      deleteRecordById(_id);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          {/* <button 
            onClick={openAddModal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Thêm Bản Ghi Đỗ Xe
          </button> */}
          
          <button 
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet size={16} />
            Xuất Excel
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
                    Biển Số Xe
                    <span className="text-xs">{getSortIcon('vehicleId')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('vehicleModel')}
                >
                  <div className="flex items-center gap-1">
                    Loại Xe
                    <span className="text-xs">{getSortIcon('vehicleModel')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('entryTime')}
                >
                  <div className="flex items-center gap-1">
                    Thời Gian Vào
                    <span className="text-xs">{getSortIcon('entryTime')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('exitTime')}
                >
                  <div className="flex items-center gap-1">
                    Thời Gian Ra
                    <span className="text-xs">{getSortIcon('exitTime')}</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                  Thời Gian Đỗ
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Trạng Thái
                    <span className="text-xs">{getSortIcon('status')}</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRecords.slice(0, entriesPerPage).map((record, index) => (
                <tr key={record._id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === record._id ? (
                      <input
                        type="text"
                        value={editForm.vehicleId}
                        onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mã xe (tùy chọn)"
                      />
                    ) : (
                      <span className={`font-mono text-xs ${record.vehicleId ? '' : 'text-gray-400 italic'}`}>
                        {vehicleResident.find(v => v._id === record.vehicleId)?.plateNumber || 'Không có'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === record._id ? (
                      <select
                        value={editForm.vehicleModel}
                        onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="ResidentVehicle">Xe Cư Dân</option>
                        <option value="VisitorVehicle">Xe Khách</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.vehicleModel === 'ResidentVehicle' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {record.vehicleModel === 'ResidentVehicle' ? 'Xe Cư Dân' : 'Xe Khách'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === record._id ? (
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
                    {editingId === record._id ? (
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
                    {editingId === record._id ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="IN">VÀO</option>
                        <option value="OUT">RA</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'IN' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status === 'IN' ? 'VÀO' : 'RA'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {editingId === record._id ? (
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
                            onClick={() => handleEdit(record)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(record._id)}
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

        {/* Footer */}
        <div className="p-4 text-sm text-gray-600 border-t border-gray-200">
          Hiển thị {Math.min(entriesPerPage, filteredRecords.length)} trong tổng số {filteredRecords.length} mục
          {searchTerm && ` (lọc từ ${parkingRecords.length} mục)`}
        </div>
      </div>

      {/* Add Parking Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Thêm Bản Ghi Đỗ Xe Mới</h2>
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
                    Mã Xe
                  </label>
                  <input
                    type="text"
                    value={addForm.vehicleId}
                    onChange={(e) => handleAddInputChange('vehicleId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="Nhập mã xe (tùy chọn)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Để trống nếu không có mã xe</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại Xe
                  </label>
                  <select
                    value={addForm.vehicleModel}
                    onChange={(e) => handleAddInputChange('vehicleModel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ResidentVehicle">Xe Cư Dân</option>
                    <option value="VisitorVehicle">Xe Khách</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời Gian Vào <span className="text-red-500">*</span>
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
                    Thời Gian Ra
                  </label>
                  <input
                    type="datetime-local"
                    value={addForm.exitTime}
                    onChange={(e) => handleAddInputChange('exitTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Để trống nếu xe vẫn đang đỗ</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng Thái
                  </label>
                  <select
                    value={addForm.status}
                    onChange={(e) => handleAddInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="IN">VÀO</option>
                    <option value="OUT">RA</option>
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
                  Thêm Bản Ghi
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

export default ParkingRecords;