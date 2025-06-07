import MainContent from "../components/MainContent";
import SideBar from '../components/DashBoard/SideBar';
import Header from '../components/Header';
import { useContext } from "react";
import { DashBoardContext } from "../context/DashboardContext";
import Resident from '../components/Apartment';
import Vehicles from '../components/Vehicles';
import ParkingRecords from "../components/ParkingRecords";
import ParkingFrees from "../components/ParkingFees";
import ParkingPayments from "../components/ParkingPayments";
import ControllerParking from '../components/ControllerParking';
const Dashboard = () => {

  const { activeItem } = useContext(DashBoardContext);


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar/>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header/>

        {/* Content */}
        {(activeItem === 'Dashboard') && <MainContent/>}
        {(activeItem === 'Apartment') && <Resident/>}
        {(activeItem === 'Vehicles') && <Vehicles/>}
        {(activeItem === 'Parking Records') && <ParkingRecords/>}
        {(activeItem === 'Real Time Parking') && <RealTimeParking/>}
        {(activeItem === 'Parking Fees') && <ParkingFrees/>}
        {(activeItem === 'Parking Payments') && <ParkingPayments/>}
        {(activeItem === 'Controller Parking') && <ControllerParking/>}
      </div>
    </div>
  );
};

export default Dashboard;