import StatsCards from './DashBoard/StatsCards';
import MediaStats from "../components/DashBoard/MediaStats";
import TrafficChart from '../components/DashBoard/TrafficChart';

const MainContent = () =>{
return (<main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <StatsCards/>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Traffic Chart */}
            <TrafficChart/>

            {/* Social Media Stats */}
            <MediaStats/>
          </div>
        </main>
    );
}

export default MainContent;