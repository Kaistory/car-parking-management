import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import {io} from "socket.io-client"

export const DashBoardContext = createContext();

export const DashBoardContextProvider = ({ children, user }) =>{
    const [socket, setSocket] = useState(null);
    const [activeItem, setActiveItem] = useState('Dashboard');
    
    // useEffect(() =>{
    //     const newSocket = io(import.meta.env.VITE_SOCKET_URL);
    //     setSocket(newSocket);
    //     return() =>{
    //         newSocket.disconnect();
    //     }
    // },[user])

    const updateActiveItem = useCallback((item) =>{
        setActiveItem(item);
    },[]);

    return <DashBoardContext.Provider value = 
    {{  activeItem,
        updateActiveItem,
        socket}}>{children}
    </DashBoardContext.Provider>
}