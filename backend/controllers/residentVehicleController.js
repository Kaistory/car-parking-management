const ResidentVehicle = require('../models/ResidentVehicle');

// @desc    Lấy danh sách tất cả xe cư dân
// @route   GET /api/resident-vehicles
const getAllResidentVehicles = async (req, res) => {
  try {
    const vehicles = await ResidentVehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách xe cư dân', error });
  }
};

// @desc    Đăng ký xe mới của cư dân
// @route   POST /api/resident-vehicles/register/vehicles
const  createResidentVehicle = async (req, res) => {
  try {
    const newVehicle = new ResidentVehicle(req.body);
    console.log(req.body)
    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi đăng ký xe cư dân mới', error });
  }
};

// @desc    Xem chi tiết xe cư dân
// @route   GET /api/resident-vehicles/:id
const getResidentVehicleById = async (req, res) => {
  try {
    const vehicle = await ResidentVehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Không tìm thấy xe cư dân' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin xe cư dân', error });
  }
};

// @desc    Cập nhật thông tin xe cư dân
// @route   POST /api/resident-vehicles/:id
const updateResidentVehicle = async (req, res) => {
  try {
    const updatedVehicle = await ResidentVehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Không tìm thấy xe cư dân để cập nhật' });
    }
    res.status(200).json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật thông tin xe cư dân', error });
  }
};

// @desc    Xoá thông tin xe cư dân
// @route   DELETE /api/resident-vehicles/:id
const deleteResidentVehicle = async (req, res) => {
  try {
    const deleted = await ResidentVehicle.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy xe cư dân để xoá' });
    }
    res.status(200).json({ message: 'Đã xoá xe cư dân thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xoá xe cư dân', error });
  }
};
module.exports={createResidentVehicle,getAllResidentVehicles,getResidentVehicleById,updateResidentVehicle,deleteResidentVehicle};
