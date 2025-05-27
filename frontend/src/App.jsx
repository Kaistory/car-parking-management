import React, { useContext } from 'react';
import {Routes, Route, Navigate} from "react-router-dom"
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthContext } from "./context/AuthContext"
import { DashBoardContextProvider } from './context/DashboardContext';
function App() {
  const {user} = useContext(AuthContext);
  
  return (
      <DashBoardContextProvider user ={user}>
      <Routes>
        <Route path = "/" element ={user ? <Dashboard />: <Login/>}/>
        <Route path = "/register" element ={<Register/>}/>
        <Route path = "/login" element ={user ? <Dashboard/>: <Login/>}/>
        <Route path = "*" element ={<Navigate to="/"/>}/>
      </Routes>
    </DashBoardContextProvider>
  );
}

export default App;
