const apartmentModel = require("../models/Apartment")

// @desc    Lấy danh sách tất cả căn hộ
// @route   GET /api/apartments
const getAllApartments = async (req, res) => {
  try {
    const apartments = await apartmentModel.find();
    res.status(200).json(apartments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách căn hộ', error });
  }
};
// @desc    Lấy thông tin chi tiết một căn hộ
// @route   GET /api/apartments/:id
const getApartmentById = async (req, res) => {
  try {
    const apartment = await apartmentModel.findById(req.params.id);
    if (!apartment) {
      return res.status(404).json({ message: 'Không tìm thấy căn hộ' });
    }
    res.status(200).json(apartment);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy căn hộ', error });
  }
};

// @desc    Tạo mới một căn hộ
// @route   POST /api/apartments/register
const createApartment = async(req, res) =>
    {
        try {
            const apartment = new apartmentModel(req.body)
            await apartment.save()
            res.status(201).json(apartment)
            } catch (error) {
                res.status(500).json({ message: "Failed to create apartment" })
            }
    }

    // @desc    Cập nhật thông tin căn hộ
// @route   POST /api/apartments/update/:id
const updateApartment = async (req, res) => {
  try {
    const updatedApartment = await apartmentModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedApartment) {
      return res.status(404).json({ message: 'Không tìm thấy căn hộ để cập nhật' });
    }
    res.status(200).json(updatedApartment);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật căn hộ', error });
  }
};

// @desc    Xoá một căn hộ
// @route   DELETE /api/apartments/delete/:id
const deleteApartment = async (req, res) => {
  try {
    const deleted = await apartmentModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy căn hộ để xoá' });
    }
    res.status(200).json({ message: 'Đã xoá căn hộ thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xoá căn hộ', error });
  }
};

module.exports = {createApartment, getAllApartments,getApartmentById,deleteApartment,updateApartment}