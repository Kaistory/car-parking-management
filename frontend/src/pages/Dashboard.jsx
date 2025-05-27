import React, { useState } from 'react';
import { Home, Users, Car, BarChart3, Calendar, Mail, Archive, Clock, Layers, FileText, Grid, TrendingUp, TrendingDown, Facebook, Twitter, Linkedin, Bell, Search, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
// import { Sidebar } from '../components/SideBar';
const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Users, label: 'Clients' },
    { icon: Car, label: 'Vehicles' },
    { icon: Calendar, label: 'Parking Records' },
    { icon: Mail, label: 'Mail' },
    { icon: Archive, label: 'Archive' },
    { icon: Clock, label: 'Charts' },
    { icon: FileText, label: 'Blog' },
    { icon: Bell, label: 'Notifications' },
    { icon: Grid, label: 'Widgets' },
  ];

  const statsCards = [
    {
      title: '26K',
      subtitle: '(-12.4%)',
      description: 'Sessions',
      color: 'bg-blue-500',
      trend: 'down'
    },
    {
      title: '56,200',
      subtitle: '(+12.4%)',
      description: 'Pageviews',
      color: 'bg-sky-400',
      trend: 'up'
    },
    {
      title: '2.10%',
      subtitle: '(+0.2%)',
      description: 'Bounce Rate',
      color: 'bg-orange-400',
      trend: 'up'
    },
    {
      title: '54K',
      subtitle: '(+2.4%)',
      description: 'Sessions Duration',
      color: 'bg-red-400',
      trend: 'up'
    }
  ];

  const trafficData = [
    { name: 'Jan', organic: 20, social: 15, referral: 25, direct: 30 },
    { name: 'Feb', organic: 25, social: 20, referral: 20, direct: 35 },
    { name: 'Mar', organic: 15, social: 10, referral: 30, direct: 25 },
    { name: 'Apr', organic: 30, social: 25, referral: 35, direct: 40 },
    { name: 'May', organic: 35, social: 30, referral: 25, direct: 45 },
    { name: 'Jun', organic: 40, social: 35, referral: 40, direct: 50 },
    { name: 'Jul', organic: 45, social: 40, referral: 35, direct: 55 },
  ];

  const socialStats = [
    { platform: 'facebook', users: '89,400 Users', percentage: '(60%)' },
    { platform: 'twitter', users: '56,600 Users', percentage: '(34%)' },
    { platform: 'linkedin', users: '22,128 Users', percentage: '(14%)' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-semibold">CoreUI</span>
          </div>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 mb-2">
            <span className="text-gray-400 text-xs uppercase tracking-wider">Navigation</span>
          </div>
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center px-4 py-2 text-sm hover:bg-gray-700 ${
                item.label === activeItem ? 'bg-blue-600 border-r-2 border-blue-400' : ''
              }`}
              onClick={() => setActiveItem(item.label)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
              <span className="text-gray-500">/</span>
              <span className="text-gray-500">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <MessageSquare className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Traffic Chart */}
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

            {/* Social Media Stats */}
            <div className="space-y-4">
              <div className="bg-blue-600 rounded-lg p-6 text-white flex items-center justify-between">
                <Facebook className="w-8 h-8" />
                <div className="text-right">
                  <p className="text-2xl font-bold">89,400</p>
                  <p className="text-sm opacity-90">friends</p>
                </div>
              </div>
              
              <div className="bg-sky-400 rounded-lg p-6 text-white flex items-center justify-between">
                <Twitter className="w-8 h-8" />
                <div className="text-right">
                  <p className="text-2xl font-bold">973k</p>
                  <p className="text-sm opacity-90">followers</p>
                </div>
              </div>
              
              <div className="bg-blue-700 rounded-lg p-6 text-white flex items-center justify-between">
                <Linkedin className="w-8 h-8" />
                <div className="text-right">
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm opacity-90">contacts</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;