import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider =({children})=>{
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        username:"",
        password:"",
        email:"",

    })
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        username:"",
        password:"",
        email:"",

    })
    

    useEffect(()=>{
        const user = localStorage.getItem("User");
        setUser(JSON.parse(user));
    },[])

    const updateRegisterInfo = useCallback((info) =>{
        setRegisterInfo(info);
    })

    const updateLoginInfo = useCallback((info) =>{
        setLoginInfo(info);
    })

    const registerUser = useCallback(async(e)=>{
        e.preventDefault();
 
        setIsRegisterLoading(true);
        setRegisterError(null);
        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));
        setIsRegisterLoading(false);
        
        if(response.error){
          return setRegisterError(response);  
        };
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
    },[registerInfo]);

    const loginUser = useCallback(async(e) =>{
        e.preventDefault();
        setIsLoginLoading(true)
        setLoginError(null)
        
        const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo));
        setIsLoginLoading(false);
        if(response.error){
            return setLoginError(response);  
          };
          localStorage.setItem("User", JSON.stringify(response));
          setUser(response);
    }, [loginInfo])

    const logoutUser = useCallback(() =>{
        localStorage.removeItem("User");
        localStorage.removeItem("activeItem");
        setUser(null);
    },[]); 


    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            registerInfo,
            updateRegisterInfo,
            registerUser,
            registerError,
            isRegisterLoading,
            logoutUser,
            loginUser,
            loginError,
            loginInfo,
            updateLoginInfo,
            isLoginLoading
            }}>
                {children}
        </AuthContext.Provider>
    );
};