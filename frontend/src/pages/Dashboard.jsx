import MainContent from "../components/MainContent";
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import { useContext } from "react";
import { DashBoardContext } from "../context/DashboardContext";
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
      </div>
    </div>
  );
};

export default Dashboard;