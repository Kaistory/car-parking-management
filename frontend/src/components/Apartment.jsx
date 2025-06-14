import React, { useState , useContext, useEffect} from 'react';
import { Edit, Trash2, Plus, X, Check, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { DashBoardContext } from '../context/DashboardContext'
import * as XLSX from 'xlsx';

const Resident = () => {
  const {apartment, updateApartmentById,deleteApartmentById,createApartment} = useContext(DashBoardContext);
  const [apartments, setApartments] = useState(apartment);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ ownerName: '', apartmentNumber: '', floor: '', area: '' });
  
  // Add states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ ownerName: '', apartmentNumber: '', floor: '', area: '' });

  // Filter apartments based on search term
  const filteredApartments = apartments.filter(apt =>
    apt.apartmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.floor.toString().includes(searchTerm) ||
    apt.area.toString().includes(searchTerm)
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

  // Pagination calculations
  const totalPages = Math.ceil(sortedApartments.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentApartments = sortedApartments.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
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

  // Excel Export Function
  const exportToExcel = () => {
    try {
      // Prepare data for export
      const dataToExport = sortedApartments.map((apartment, index) => ({
        'STT': index + 1,
        'Số căn hộ': apartment.apartmentNumber,
        'Tên chủ sở hữu': apartment.ownerName || 'Chưa có chủ',
        'Tầng': apartment.floor,
        'Diện tích (m²)': apartment.area
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataToExport);

      // Set column widths
      const colWidths = [
        { wch: 5 },   // STT
        { wch: 15 },  // Số căn hộ
        { wch: 25 },  // Tên chủ sở hữu
        { wch: 8 },   // Tầng
        { wch: 15 }   // Diện tích
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách căn hộ');

      // Generate filename with current date
      const now = new Date();
      const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD format
      const timeString = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS format
      const filename = `danh-sach-can-ho_${dateString}_${timeString}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      // Show success message
      alert(`Đã xuất thành công ${sortedApartments.length} căn hộ ra file Excel!`);
    } catch (error) {
      console.error('Lỗi khi xuất file Excel:', error);
      alert('Có lỗi xảy ra khi xuất file Excel. Vui lòng thử lại!');
    }
  };

  // Pagination functions
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Edit functions
  const handleEdit = (apartment) => {
    setEditingId(apartment._id);
    setEditForm({
      ownerName: apartment.ownerName,
      apartmentNumber: apartment.apartmentNumber,
      floor: apartment.floor.toString(),
      area: apartment.area.toString()
    });
  };

  const handleSaveEdit = () => {
    // Validation
    if (!editForm.apartmentNumber.trim()) {
      alert('Vui lòng nhập số căn hộ');
      return;
    }
    
    if (!editForm.floor || isNaN(editForm.floor) || parseInt(editForm.floor) <= 0) {
      alert('Vui lòng nhập tầng hợp lệ');
      return;
    }
    
    if (!editForm.area || isNaN(editForm.area) || parseInt(editForm.area) <= 0) {
      alert('Vui lòng nhập diện tích hợp lệ');
      return;
    }

    // Check if apartment number already exists (excluding current apartment)
    const exists = apartments.some(apt => 
      apt._id !== editingId && 
      apt.apartmentNumber.toLowerCase() === editForm.apartmentNumber.trim().toLowerCase()
    );
    if (exists) {
      alert('Số căn hộ đã tồn tại');
      return;
    }

    setApartments(prev => prev.map(apt => 
      apt._id === editingId 
        ? { 
            ...apt, 
            ownerName: editForm.ownerName.trim(),
            apartmentNumber: editForm.apartmentNumber.trim(),
            floor: parseInt(editForm.floor),
            area: parseInt(editForm.area)
          }
        : apt
    ));
    updateApartmentById({ 
            _id: editingId, 
            ownerName: editForm.ownerName.trim(),
            apartmentNumber: editForm.apartmentNumber.trim(),
            floor: parseInt(editForm.floor),
            area: parseInt(editForm.area)
          });
    setEditingId(null);
    setEditForm({ ownerName: '', apartmentNumber: '', floor: '', area: '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ ownerName: '', apartmentNumber: '', floor: '', area: '' });
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
    setAddForm({ ownerName: '', apartmentNumber: '', floor: '', area: '' });
  };

  const handleAddInputChange = (field, value) => {
    setAddForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveNewApartment = () => {
    // Validation
    if (!addForm.apartmentNumber.trim()) {
      alert('Vui lòng nhập số căn hộ');
      return;
    }

    if (!addForm.floor || isNaN(addForm.floor) || parseInt(addForm.floor) <= 0) {
      alert('Vui lòng nhập tầng hợp lệ');
      return;
    }

    if (!addForm.area || isNaN(addForm.area) || parseInt(addForm.area) <= 0) {
      alert('Vui lòng nhập diện tích hợp lệ');
      return;
    }

    // Check if apartment number already exists
    const exists = apartments.some(apt => apt.apartmentNumber.toLowerCase() === addForm.apartmentNumber.trim().toLowerCase());
    if (exists) {
      alert('Số căn hộ đã tồn tại');
      return;
    }

    // Create new apartment
    const newId = apartments.length > 0 ? Math.max(...apartments.map(apt => apt._id)) + 1 : 1;
    const newApartment = {
      _id: newId,
      ownerName: addForm.ownerName.trim(),
      apartmentNumber: addForm.apartmentNumber.trim(),
      floor: parseInt(addForm.floor),
      area: parseInt(addForm.area)
    };
    createApartment(newApartment);
    
    // Close modal and reset form
    setShowAddModal(false);
    setAddForm({ ownerName: '', apartmentNumber: '', floor: '', area: '' });
    
    // Show success message
    alert('Thêm căn hộ thành công!');
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setAddForm({ ownerName: '', apartmentNumber: '', floor: '', area: '' });
  };

  // Delete function
  const handleDelete = (_id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa căn hộ này?')) {
      deleteApartmentById(_id);
      setApartments(prev => prev.filter(apt => apt._id !== _id));
      
      // Adjust current page if necessary
      const newTotalPages = Math.ceil((sortedApartments.length - 1) / entriesPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  // useEffect to update apartments from context
  useEffect(() => {
    setApartments(apartment);
  }, [apartment]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <button 
            onClick={openAddModal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Thêm căn hộ
          </button>
          
          <button 
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            title="Xuất file Excel"
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
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
            <span className="text-gray-600">mục mỗi trang</span>
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
                  #
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('apartmentNumber')}
                >
                  <div className="flex items-center gap-1">
                    Số căn hộ
                    <span className="text-xs">{getSortIcon('apartmentNumber')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('ownerName')}
                >
                  <div className="flex items-center gap-1">
                    Tên chủ sở hữu
                    <span className="text-xs">{getSortIcon('ownerName')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('floor')}
                >
                  <div className="flex items-center gap-1">
                    Tầng
                    <span className="text-xs">{getSortIcon('floor')}</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('area')}
                >
                  <div className="flex items-center gap-1">
                    Diện tích (m²)
                    <span className="text-xs">{getSortIcon('area')}</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {currentApartments.map((apartment, index) => (
                <tr key={apartment._id} className="hover:bg-gray-50 border-b border-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === apartment._id ? (
                      <input
                        type="text"
                        value={editForm.apartmentNumber}
                        onChange={(e) => handleInputChange('apartmentNumber', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    ) : (
                      apartment.apartmentNumber
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === apartment._id ? (
                      <input
                        type="text"
                        value={editForm.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tên chủ sở hữu"
                      />
                    ) : (
                      <span className={`${!apartment.ownerName ? 'text-gray-400 italic' : ''}`}>
                        {apartment.ownerName || 'Chưa có chủ'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === apartment._id ? (
                      <input
                        type="number"
                        value={editForm.floor}
                        onChange={(e) => handleInputChange('floor', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                      />
                    ) : (
                      apartment.floor
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {editingId === apartment._id ? (
                      <input
                        type="number"
                        value={editForm.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                      />
                    ) : (
                      apartment.area
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {editingId === apartment._id ? (
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
                            onClick={() => handleEdit(apartment)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(apartment._id)}
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
              Hiển thị {startIndex + 1} đến {Math.min(endIndex, sortedApartments.length)} trên {sortedApartments.length} mục
              {searchTerm && ` (đã lọc từ ${apartments.length} tổng số mục)`}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Previous button */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors ${
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft size={16} />
                Trước
              </button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNum, index) => (
                  <React.Fragment key={index}>
                    {pageNum === '...' ? (
                      <span className="px-2 py-1 text-gray-400">...</span>
                    ) : (
                      <button
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Next button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors ${
                  currentPage === totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Sau
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Footer when no pagination needed */}
        {totalPages <= 1 && (
          <div className="p-4 text-sm text-gray-600 border-t border-gray-200">
            Hiển thị {filteredApartments.length} trên {filteredApartments.length} mục
            {searchTerm && ` (đã lọc từ ${apartments.length} tổng số mục)`}
          </div>
        )}
      </div>

      {/* Add Apartment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Thêm căn hộ mới</h2>
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
                    Số căn hộ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.apartmentNumber}
                    onChange={(e) => handleAddInputChange('apartmentNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số căn hộ (VD: 101, 202)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên chủ sở hữu
                  </label>
                  <input
                    type="text"
                    value={addForm.ownerName}
                    onChange={(e) => handleAddInputChange('ownerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên chủ sở hữu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tầng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={addForm.floor}
                    onChange={(e) => handleAddInputChange('floor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số tầng"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diện tích (m²) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={addForm.area}
                    onChange={(e) => handleAddInputChange('area', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập diện tích"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveNewApartment}
                  className="mt-4 flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Check size={16} />
                  Thêm căn hộ
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="mt-4 flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
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

export default Resident;