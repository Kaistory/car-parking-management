const express = require('express');
const router = express.Router();
const {createResidentVehicle,getAllResidentVehicles,getResidentVehicleById,updateResidentVehicle,deleteResidentVehicle} = require('../controllers/residentVehicleController');

router.get('/', getAllResidentVehicles);
router.post('/register/', createResidentVehicle);
router.get('/:id', getResidentVehicleById);
router.put('/:id', updateResidentVehicle);
router.delete('/:id', deleteResidentVehicle);

module.exports = router;
