import { Home, Users, Car, Coins, BarChart3, Calendar, Mail, Archive, Clock, Layers, FileText, Grid, TrendingUp, TrendingDown, Facebook, Twitter, Linkedin, Bell, Search, MessageSquare } from 'lucide-react';

const MediaStats = () =>{
    return (
        <div className="space-y-4">
              <div className="bg-blue-600 rounded-lg p-6 text-white flex items-center justify-between">
                <Users className="w-8 h-8" />
                <div className="text-right">
                  <p className="text-2xl font-bold">89,400</p>
                  <p className="text-sm opacity-90">Resident</p>
                </div>
              </div>
              
              <div className="bg-sky-400 rounded-lg p-6 text-white flex items-center justify-between">
                <Car className="w-8 h-8" />
                <div className="text-right">
                  <p className="text-2xl font-bold">973k</p>
                  <p className="text-sm opacity-90">Resident Vehicle</p>
                </div>
              </div>
              
              <div className="bg-blue-700 rounded-lg p-6 text-white flex items-center justify-between">
                <Coins className="w-8 h-8" />
                <div className="text-right">
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm opacity-90">Fund</p>
                </div>
              </div>
            </div>
    );
}

export default  MediaStats;