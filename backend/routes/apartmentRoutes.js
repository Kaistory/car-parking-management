const express = require("express");
const {createApartment, getAllApartments,getApartmentById,deleteApartment,updateApartment} = require("../controllers/apartmentController");
const router = express.Router();

router.post("/register",createApartment);
router.get("/",getAllApartments);
router.get("/:id",getApartmentById);
router.post("/update/:id",updateApartment);
router.delete("/delete/:id",deleteApartment);

module.exports = router;