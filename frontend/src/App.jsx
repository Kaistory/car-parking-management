import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/parking-records" element={<ParkingRecords />} />
        <Route path="/resident-vehicles" element={<ResidentVehicles />} /> */}
        {/* Thêm các route khác */}
      </Routes>
    </div>
  );
}

export default App;
