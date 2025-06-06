const express = require("express");

// Fees
const {createParkingFee,getAllParkingFees,updateParkingFee,deleteParkingFee} =require("../controllers/parkingFeeController")
// Record
const {getAllParkingRecords,createParkingRecord, getParkingRecordById,updateParkingRecord,deleteParkingRecord} = require("../controllers/parkingRecordController")

const router = express.Router();

router.get("/fees", getAllParkingFees);
router.post("/fees", createParkingFee);
router.post("/fees/update/:id", updateParkingFee);
router.post("/fees/delete/:id", deleteParkingFee);

router.get("/records", getAllParkingRecords);
router.post("/records", createParkingRecord);
router.post("/records/update/:id", updateParkingRecord);
router.post("/records/delete/:id", deleteParkingRecord);
router.get("/records/:id", getParkingRecordById);


module.exports = router;