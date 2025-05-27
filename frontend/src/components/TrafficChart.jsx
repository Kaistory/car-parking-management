import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const TrafficChart = () =>{
    const trafficData = [
    { name: 'Jan', organic: 20, social: 15, referral: 25, direct: 30 },
    { name: 'Feb', organic: 25, social: 20, referral: 20, direct: 35 },
    { name: 'Mar', organic: 15, social: 10, referral: 30, direct: 25 },
    { name: 'Apr', organic: 30, social: 25, referral: 35, direct: 40 },
    { name: 'May', organic: 35, social: 30, referral: 25, direct: 45 },
    { name: 'Jun', organic: 40, social: 35, referral: 40, direct: 50 },
    { name: 'Jul', organic: 45, social: 40, referral: 35, direct: 55 },
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
                      dataKey="organic" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="social" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="referral" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="direct" 
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
                  <span className="text-gray-600">Organic Search (60%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Social Media (20%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Referrals (15%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Direct (5%)</span>
                </div>
              </div>
            </div>
    )
}

export default TrafficChart;