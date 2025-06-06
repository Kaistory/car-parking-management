import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import {io} from "socket.io-client"

export const DashBoardContext = createContext();

export const DashBoardContextProvider = ({ children, user }) =>{
    const [socket, setSocket] = useState(null);
    const [activeItem, setActiveItem] = useState('Dashboard');
    const [apartment, setApartment] = useState([]);
    const [vehicleResident, setVehicleResident] = useState([]);
    const [recordsParking, setRecordsParking] = useState([]);
    const [feesParking, setFeesParking] = useState([]);
    const [trafficData, setTrafficData] = useState([]);
    
    function getMonthName(Time) {
      if (!Time) return '';
      const date = new Date(Time);
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
      return monthNames[date.getMonth()];
    }
    const makeTrafficData = (vR,rP) => {
        const data = [
    { name: 'Jan', car: 0, motobike: 0, bike: 0, all: 0 },
    { name: 'Feb', car: 0, motobike: 0, bike: 0, all: 0 },
    { name: 'Mar', car: 0, motobike: 0, bike: 0, all: 0 },
    { name: 'Apr', car: 0, motobike: 0, bike: 0, all: 0 },
    { name: 'May', car: 0, motobike: 0, bike: 0, all: 0 },
    { name: 'Jun', car: 0, motobike: 0, bike: 0, all: 0 },
    { name: 'Jul', car: 0, motobike: 0, bike: 0, all: 0 },
    { name: 'Aug', car: 0, motobike: 0, bike: 0, all: 0 },
    { name: 'Sep', car: 0, motobike: 0, bike: 0, all: 0 },
    { name: 'Oct', car: 0, motobike: 0, bike: 0, all: 0 },
    { name: 'Nov', car: 0, motobike: 0, bike: 0, all: 0 },
    { name: 'Dec', car: 0, motobike: 0, bike: 0, all: 0 },
    ];
        data.forEach((month) => {
            month.car = rP.filter(record => getMonthName(record.entryTime) == month.name && vehicleResident.some(v => v._id === record.vehicleId && v.vehicleType === "Car")).length;
            month.motobike = rP.filter(record => getMonthName(record.entryTime) == month.name && vehicleResident.some(v => v._id === record.vehicleId && v.vehicleType === "Motorbike")).length;
            month.bike = rP.filter(record => getMonthName(record.entryTime) == month.name && vehicleResident.some(v => v._id === record.vehicleId && v.vehicleType === "Bike")).length;
            month.all = rP.filter(record => getMonthName(record.entryTime) == month.name).length;
        })
        return data;
    };

    useEffect(() => {
        setApartment(apartment);
        setVehicleResident(vehicleResident);
        setRecordsParking(recordsParking);
        setFeesParking(feesParking);
        setTrafficData(makeTrafficData(vehicleResident,recordsParking));
        const act = localStorage.getItem("activeItem");
        setActiveItem(act ? act : 'Dashboard');
    }, [apartment, vehicleResident, recordsParking, feesParking]);

    useEffect(() => {
        const fetchInfo = async () => {
            const response = await getRequest(`${baseUrl}/apartments`);  
                if (response.error) {
                    return console.error("Failed to fetch apartment");
                } 
                setApartment(response);
            const response2 = await getRequest(`${baseUrl}/vehicles/resident`);  
                if (response2.error) {
                    return console.error("Failed to fetch vehicleResident");
                } 
                setVehicleResident(response2);
            const response3 = await getRequest(`${baseUrl}/parking/records`);  
                if (response3.error) {
                    return console.error("Failed to fetch recordsParking");
                } 
                setRecordsParking(response3);
            const response4 = await getRequest(`${baseUrl}/parking/fees`);  
                if (response4.error) {
                    return console.error("Failed to fetch recordsParking");
                } 
                setFeesParking(response4);
            }
        fetchInfo();
    }, []);

    const updateActiveItem = useCallback((item) =>{
        localStorage.setItem("activeItem", item);
        setActiveItem(item);
    },[]);
    const updateRecordById = useCallback(async (newRecord) => {
        const response = await postRequest(`${baseUrl}/parking/records/update/${newRecord._id}`, JSON.stringify(newRecord));
        console.log(newRecord);
        if (response.error) {
            return console.error("Failed to update recordsParking");
        }
        setRecordsParking((prevRecords) => {
            return prevRecords.map((record) =>
                record._id === newRecord._id ? newRecord : record
            );
        });
    }, []);

    const deleteRecordById = useCallback(async (recordId) => {
        const response = await postRequest(`${baseUrl}/parking/records/delete/${recordId}`);
        if (response.error) {
            return console.error("Failed to delete recordsParking");
        }
        setRecordsParking((prevRecords) => {
            return prevRecords.filter((record) => record._id !== recordId);
        });
    }, []);

    const updateFeeById = useCallback(async (newFee) => {
        const response = await postRequest(`${baseUrl}/parking/fees/update/${newFee._id}`, JSON.stringify(newFee));
       
        if (response.error) {
            return console.error("Failed to update parkingFees");
        }
        setFeesParking((prevFees) => {
            return prevFees.map((fee) =>
                fee._id === newFee._id ? newFee : fee
            );
        });
    }, []);

    const deleteFeeById = useCallback(async (feeId) => {
        const response = await postRequest(`${baseUrl}/parking/fees/delete/${feeId}`);
        if (response.error) {
            return console.error("Failed to delete parkingFees");
        }
        setFeesParking((prevFees) => {
            return prevFees.filter((fee) => fee._id !== feeId);
        });
    }, []);

    const createFee = useCallback(async (newFee) => {
        const response = await postRequest(`${baseUrl}/parking/fees`, JSON.stringify(newFee));
        if (response.error) {
            return console.error("Failed to create parkingFees");
        }
        setFeesParking((prevFees) => [...prevFees, response]);
    }, []);

    const updateVehicleById = useCallback(async (newVehicle) => {
        const response = await postRequest(`${baseUrl}/vehicles/resident/update/${newVehicle._id}`, JSON.stringify(newVehicle));
        if (response.error) {
            return console.error("Failed to update vehicleResident");
        }
        setVehicleResident((prevVehicles) => {
            return prevVehicles.map((vehicleResident) =>
                vehicleResident._id === newVehicle._id ? newVehicle : vehicleResident
            );
        });
    }, []);
    const deleteVehicleById = useCallback(async (vehicleId) => {
        const response = await postRequest(`${baseUrl}/vehicles/resident/delete/${vehicleId}`);
        if (response.error) {
            return console.error("Failed to delete vehicleResident");
        }
        setVehicleResident((prevVehicles) => {
            return prevVehicles.filter((vehicleResident) => vehicleResident._id !== vehicleId);
        });
    }, []);
    const createVehicle = useCallback(async (newVehicle) => {
        console.log(newVehicle);
        const response = await postRequest(`${baseUrl}/vehicles/resident/register`, JSON.stringify(newVehicle));
        if (response.error) {
            return console.error("Failed to create vehicleResident");
        }
        setVehicleResident((prevVehicles) => [...prevVehicles, response]);
    }, []);

    const updateApartmentById = useCallback(async (newApartment) => {
        const response = await postRequest(`${baseUrl}/apartments/update/${newApartment._id}`, JSON.stringify(newApartment));
        if (response.error) {
            return console.error("Failed to update apartment");
        }
        setApartment((prevApartments) => {
            return prevApartments.map((apartment) =>
                apartment._id === newApartment._id ? newApartment : apartment
            );
        });
    }, []);
    const deleteApartmentById = useCallback(async (apartmentId) => {
        const response = await postRequest(`${baseUrl}/apartments/delete/${apartmentId}`);
        if (response.error) {
            return console.error("Failed to delete apartment");
        }
        setApartment((prevApartments) => {
            return prevApartments.filter((apartment) => apartment._id !== apartmentId);
        });
    }, []);

    const createApartment = useCallback(async (newApartment) => {
        const response = await postRequest(`${baseUrl}/apartments/register`, JSON.stringify(newApartment));
        if (response.error) {
            return console.error("Failed to create apartment");
        }
        setApartment((prevApartments) => [...prevApartments, response]);
    }, []);

    return <DashBoardContext.Provider value = 
    {{  activeItem,
        updateActiveItem,
        socket,
        apartment,
        updateApartmentById,
        deleteApartmentById,
        createApartment,
        vehicleResident,
        updateVehicleById,
        deleteVehicleById,
        createVehicle,
        recordsParking,
        feesParking,
        updateFeeById,
        deleteFeeById,
        createFee,
        updateRecordById,
        deleteRecordById,
        trafficData
    }}>{children}
    </DashBoardContext.Provider>
}