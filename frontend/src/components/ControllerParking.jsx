import React, { useState, useContext,useEffect } from 'react';
import { Camera,  DollarSign,  Car } from 'lucide-react';
import {getRequest,baseUrl} from "../utils/services";
import { DashBoardContext } from "../context/DashBoardContext";
const ControllerParking = () => {
  const {vehicleResident} = useContext(DashBoardContext);
  const [recordsParking, setRecordsParking] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState(null);
  useEffect(() => {
      const fetchInfo = async () => {
                  const response3 = await getRequest(`${baseUrl}/parking/records`);  
                      if (response3.error) {
                          return console.error("Failed to fetch recordsParking");
                      } 
                      setRecordsParking(response3[0]);
                      setVehicleInfo(vehicleResident.find(vehicle => vehicle._id === response3[0].vehicleId));
                  }
              fetchInfo();
    }, [recordsParking]);

function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} - ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

  const openFunction = async () => {
    const response = await getRequest(`http://localhost:8000/door/open`);
    if (response.error) {
      return console.error("Failed to fetch apartment");
    }
    console.log("Cửa đã mở thành công");
  };
  const closeFunction = async () => {
    const response = await getRequest(`http://localhost:8000/door/close`);        
                if (response.error) {
                    return console.error("Failed to fetch apartment");
                } 
    
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Camera Feed Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Camera className="w-6 h-6 text-blue-600" />
              Camera Giám Sát
            </h2>
            
            {/* Camera Images Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Camera 1</p>
                  </div>
                </div>
                {/* License Plate Overlay */}
                <div className="absolute bottom-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold">
                  {
                    vehicleInfo?.plateNumber
                  }
                </div>
              </div>
              
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Camera 2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Car className="w-6 h-6 text-green-600" />
              Thông Tin Xe
            </h2>
            
            {/* Vehicle Details */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Biển số xe:</span>
                  <span className="font-bold text-lg">{
                    vehicleInfo?.plateNumber
                  }</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Loại xe:</span>
                  <span className="font-medium">{
                    vehicleInfo?.vehicleType
                  }</span>  
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Thời gian vào:</span>
                  <span className="font-medium">{
                    recordsParking && recordsParking.entryTime
                      ? formatDateTime(recordsParking.entryTime)
                      : 'Chưa vào'
                  }</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Thời gian ra:</span>
                  <span className="font-medium">{
                    recordsParking && recordsParking.exitTime
                      ? formatDateTime(recordsParking.exitTime)
                      : 'Chưa ra'
                  }</span>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-700">Phí đỗ xe:</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">0,000 ₫</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                onClick={openFunction}
                className="bg-green-500 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Open
                </button>
                <button 
                onClick={closeFunction}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ControllerParking;