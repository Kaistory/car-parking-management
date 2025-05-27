import React, { useState } from 'react';
import { Home, Users, Car, BarChart3, Calendar, Mail, Archive, Clock, Layers, FileText, Grid, TrendingUp, TrendingDown, Facebook, Twitter, Linkedin, Bell, Search, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import MediaStats from "../components/MediaStats"
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
      <SideBar/>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header/>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <StatsCards/>

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
            <MediaStats/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;