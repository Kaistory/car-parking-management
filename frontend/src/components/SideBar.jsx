import { Home, Users, Car, HandCoins, Calendar, Mail, Archive, Clock, Coins, Monitor, Grid, TrendingUp, TrendingDown, Facebook, Twitter, Linkedin, Bell, Search, MessageSquare } from 'lucide-react';
import React, { useState, useContext } from 'react';
import { DashBoardContext } from '../context/DashboardContext';

const SideBar = () =>{
    const {activeItem, updateActiveItem} = useContext(DashBoardContext);
    
     const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Users, label: 'Residents' },
    { icon: Car, label: 'Vehicles' },
    { icon: Calendar, label: 'Parking Records' },
    { icon: Clock, label: 'Real Time Parking' },
    { icon: Coins, label: 'Parking Fees' },
    { icon: HandCoins, label: 'Parking Payments' },
    { icon: Monitor, label: 'Controller Parking' },
    { icon: Mail, label: 'Mail' },
    { icon: Grid, label: 'Widgets' },
    ];
    
    return(
        <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <div className="flex items-center space-x-2">
             <div className="bg-orange-500 p-2 rounded-lg">
                            <Car className="h-6 w-6 text-white" />
              </div>
            <span className="text-xl font-semibold">Parking</span>
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
                item.label == activeItem ? 'bg-blue-600 border-r-2 border-blue-400' : ''
              }`}
              onClick={() => updateActiveItem(item.label)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label }
            </a>
          ))}
        </nav>
      </div>
    )
}

export default SideBar;