const express = require('express');
const router = express.Router();
const {createResidentVehicle,getAllResidentVehicles,getResidentVehicleById,updateResidentVehicle,deleteResidentVehicle} = require('../controllers/residentVehicleController');

router.get('/', getAllResidentVehicles);
router.post('/register/', createResidentVehicle);
router.get('/:id', getResidentVehicleById);
router.post('/update/:id', updateResidentVehicle);
router.post('/delete/:id', deleteResidentVehicle);

module.exports = router;
