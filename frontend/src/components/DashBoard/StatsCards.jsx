
import { TrendingUp, TrendingDown} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { DashBoardContext } from '../../context/DashboardContext';
import { getRequest, baseUrl } from '../../utils/services';
const StatsCards = () => {
  const {vehicleResident} = useContext(DashBoardContext);
  const [parkingRecords, setParkingRecords] = useState([]);
  const [carRecords, setCarRecords] = useState([]);
  const [motorbikeRecords, setMotorbikeRecords] = useState([]);
  const [bicycleRecords, setBicycleRecords] = useState([]);
    useEffect(() => {
      const fetchInfo = async () => {
                  const response3 = await getRequest(`${baseUrl}/parking/records`);  
                      if (response3.error) {
                          return console.error("Failed to fetch recordsParking");
                      } 
                      setParkingRecords(response3.filter(record => record.status === "IN"));

                      const motorbikeIds = vehicleResident
                      .filter(v => v.vehicleType === "Motorbike")
                      .map(v => v._id);

                      const filteredRecords = parkingRecords.filter(record =>
                        motorbikeIds.includes(record.vehicleId) && record.status === "IN"
                      );
                      setMotorbikeRecords(filteredRecords);
                      const carIds = vehicleResident
                      .filter(v => v.vehicleType === "Car")
                      .map(v => v._id);
                      const filteredCarRecords = parkingRecords.filter(record =>
                        carIds.includes(record.vehicleId) && record.status === "IN"
                      );
                      setCarRecords(filteredCarRecords);
                      const bicycleIds = vehicleResident
                      .filter(v => v.vehicleType === "Bicycle")
                      .map(v => v._id);
                      const filteredBicycleRecords = parkingRecords.filter(record =>
                        bicycleIds.includes(record.vehicleId) && record.status === "IN"
                      );
                      setBicycleRecords(filteredBicycleRecords);
                  }
              fetchInfo();
    }, [parkingRecords]);
    const statsCards = [
        {
          title: carRecords.length,
          subtitle: '(-12.4%)',
          description: 'Ô tô',
          color: 'bg-blue-500',
          trend: 'down'
        },
        {
          title: motorbikeRecords.length,
          subtitle: '(+12.4%)',
          description: 'Xe máy',
          color: 'bg-sky-400',
          trend: 'up'
        },
        {
          title: bicycleRecords.length,
          subtitle: '(+0.2%)',
          description: 'Xe đạp',
          color: 'bg-orange-400',
          trend: 'up'
        },
        {
          title: parkingRecords.length,
          subtitle: '(+2.4%)',
          description: 'Tổng số các loại',
          color: 'bg-red-400',
          trend: 'up'
        }
      ];


    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {statsCards.map((card, index) => (
                  <div key={index} className={`${card.color} rounded-lg p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">{card.title}</h3>
                        <p className="text-sm opacity-90">{card.description}</p>
                      </div>
                      <div className="flex items-center text-sm">
                        {card.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {card.subtitle}
                      </div>
                    </div>
                    <div className="mt-4 bg-black bg-opacity-20 rounded h-1">
                      <div className="bg-white bg-opacity-50 h-1 rounded" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
              )
}
export default StatsCards