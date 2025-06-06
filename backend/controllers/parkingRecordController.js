const ParkingRecord = require('../models/ParkingRecord');

// @desc    Lấy danh sách các lượt xe vào/ra chung cư
// @route   GET /api/parking/records
const getAllParkingRecords = async (req, res) => {
  try {
    const records = await ParkingRecord.find()
      // .populate('vehicleId') // Tham chiếu đến xe cư dân hoặc xe khách
      .sort({ entryTime: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách ghi nhận vào/ra', error });
  }
};

// @desc    Ghi nhận một lượt xe ra/vào
// @route   POST /api/parking/records
const createParkingRecord = async (req, res) => {
  try {
    const newRecord = new ParkingRecord(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi ghi nhận vào/ra', error });
  }
};

// @desc    Xem chi tiết một lượt vào/ra
// @route   GET /api/parking/records/:id
const getParkingRecordById = async (req, res) => {
  try {
    const record = await ParkingRecord.findById(req.params.id).populate('vehicleId');
    if (!record) {
      return res.status(404).json({ message: 'Không tìm thấy lượt vào/ra' });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin lượt vào/ra', error });
  }
};

const updateParkingRecord = async (req, res) => {
  try {
    const updatedRecord = await ParkingRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Không tìm thấy lượt vào/ra để cập nhật' });
    }
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật lượt vào/ra', error });
  }
};

const deleteParkingRecord = async (req, res) => {
  try {
    const deletedRecord = await ParkingRecord.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Không tìm thấy lượt vào/ra để xóa' });
    }
    res.status(200).json({ message: 'Xóa lượt vào/ra thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa lượt vào/ra', error });
  }
};

module.exports = {getAllParkingRecords,createParkingRecord, getParkingRecordById, updateParkingRecord, deleteParkingRecord}
