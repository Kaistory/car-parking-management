
import { Home, Users, Car, BarChart3, Calendar, Mail, Archive, Clock, Layers, FileText, Grid, TrendingUp, TrendingDown, Facebook, Twitter, Linkedin, Bell, Search, MessageSquare } from 'lucide-react';
// import {DashboardContext} from '../context/DashboardContext';
import { useContext } from 'react';
const StatsCards = () => {
    // const {} = useContext(DashboardContext);
      const statsCards = [
        {
          title: '26K',
          subtitle: '(-12.4%)',
          description: 'Ô tô',
          color: 'bg-blue-500',
          trend: 'down'
        },
        {
          title: '56,200',
          subtitle: '(+12.4%)',
          description: 'Xe máy',
          color: 'bg-sky-400',
          trend: 'up'
        },
        {
          title: '2.10%',
          subtitle: '(+0.2%)',
          description: 'Xe đạp',
          color: 'bg-orange-400',
          trend: 'up'
        },
        {
          title: '54K',
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