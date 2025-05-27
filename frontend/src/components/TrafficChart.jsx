import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const TrafficChart = () =>{
    const trafficData = [
    { name: 'Jan', car: 20, motobike: 15, bike: 25, all: 30 },
    { name: 'Feb', car: 25, motobike: 20, bike: 20, all: 35 },
    { name: 'Mar', car: 15, motobike: 10, bike: 30, all: 25 },
    { name: 'Apr', car: 30, motobike: 25, bike: 35, all: 40 },
    { name: 'May', car: 35, motobike: 30, bike: 25, all: 45 },
    { name: 'Jun', car: 40, motobike: 35, bike: 40, all: 50 },
    { name: 'Jul', car: 45, motobike: 40, bike: 35, all: 55 },
    ];

    return (
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Traffic</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded">Day</button>
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded">Month</button>
                  <button className="px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded">Year</button>
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="car" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="motobike" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bike" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="all" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-center space-x-6 mt-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Car(60%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Motobike(20%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Bike (15%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">All</span>
                </div>
              </div>
            </div>
    )
}

export default TrafficChart;