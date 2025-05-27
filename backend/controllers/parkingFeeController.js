const ParkingFee = require('../models/ParkingFee');

// @desc    Lấy danh sách loại phí gửi xe theo từng loại xe
// @route   GET /api/parking/fees
const getAllParkingFees = async (req, res) => {
  try {
    const fees = await ParkingFee.find();
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách phí gửi xe', error });
  }
};

// @desc    Tạo mới mức phí gửi xe
// @route   POST /api/parking/fees
const createParkingFee = async (req, res) => {
  try {
    const newFee = new ParkingFee(req.body);
    const savedFee = await newFee.save();
    res.status(201).json(savedFee);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi tạo mới mức phí gửi xe', error });
  }
};

// @desc    Cập nhật phí gửi xe
// @route   PUT /api/parking/fees/:id
const updateParkingFee = async (req, res) => {
  try {
    const updatedFee = await ParkingFee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFee) {
      return res.status(404).json({ message: 'Không tìm thấy phí gửi xe để cập nhật' });
    }
    res.status(200).json(updatedFee);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật phí gửi xe', error });
  }
};

// @desc    Xoá loại phí không còn áp dụng
// @route   DELETE /api/parking/fees/:id
const  
deleteParkingFee = async (req, res) => {
  try {
    const deleted = await ParkingFee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy phí gửi xe để xoá' });
    }
    res.status(200).json({ message: 'Đã xoá phí gửi xe thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xoá phí gửi xe', error });
  }
};

module.exports = {createParkingFee,getAllParkingFees,updateParkingFee,deleteParkingFee};