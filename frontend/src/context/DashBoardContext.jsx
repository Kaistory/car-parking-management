import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import {io} from "socket.io-client"

export const DashBoardContext = createContext();

export const DashBoardContextProvider = ({ children, user }) =>{
    const [socket, setSocket] = useState(null);
    const [activeItem, setActiveItem] = useState('Dashboard');
    const [apartment, setApartment] = useState([]);

    // useEffect(() => {
    //     if (user) {
    //         const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
    //             query: { userId: user._id },
    //         });
    //         setSocket(newSocket);
    //         return () => {
    //             newSocket.disconnect();
    //         };
    //     }
    // }, [user]);
    useEffect(() => {
        setApartment(apartment);
    }, [apartment]);

    useEffect(() => {
        const fetchApartment = async () => {
            const response = await getRequest(`${baseUrl}/apartments`);        
                if (response.error) {
                    return console.error("Failed to fetch apartment");
                } 
                setApartment(response);
            }
            
        fetchApartment();
    }, [apartment]);

    const updateActiveItem = useCallback((item) =>{
        setActiveItem(item);
    },[]);

    const updateApartmentById = useCallback((newApartment) => {
        
        const response = postRequest(`${baseUrl}/apartments/update/${newApartment._id}`, JSON.stringify(newApartment));
        if (response.error) {
            return console.error("Failed to update apartment");
        }
        setApartment((prevApartments) => {
            return prevApartments.map((apartment) =>
                apartment._id === newApartment._id ? newApartment : apartment
            );
        });
    }, []);
    const deleteApartmentById = useCallback((apartmentId) => {
        const response = postRequest(`${baseUrl}/apartments/delete/${apartmentId}`);
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
        createApartment}}>{children}
    </DashBoardContext.Provider>
}