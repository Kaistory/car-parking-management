import { Home, Users, Car, BarChart3, Calendar, Mail, Archive, Clock, Layers, FileText, Grid, TrendingUp, TrendingDown, Facebook, Twitter, Linkedin, Bell, Search, MessageSquare } from 'lucide-react';



const SideBar = () =>{
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
    return(
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
    )
}

export default SideBar;