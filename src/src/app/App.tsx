import { useState } from 'react';
import { House, Wrench, Users, Settings } from 'lucide-react';
import { RentalModule } from './components/RentalModule';
import { ServicesModule } from './components/ServicesModule';
import { CommunityModule } from './components/CommunityModule';

type TabType = 'rental' | 'services' | 'community' | 'settings';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'rental', label: '租房', icon: <House className="w-5 h-5" /> },
  { id: 'services', label: '服务', icon: <Wrench className="w-5 h-5" /> },
  { id: 'community', label: '社区', icon: <Users className="w-5 h-5" /> },
  { id: 'settings', label: '我的', icon: <Settings className="w-5 h-5" /> },
];

function SettingsModule() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-4 py-3 border-b">
        <h1>我的</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg p-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
            用
          </div>
          <h2 className="mb-1">用户名</h2>
          <p className="text-sm text-gray-500">user@example.com</p>
        </div>

        <div className="mt-4 bg-white rounded-lg divide-y">
          <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
            我的收藏
          </button>
          <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
            预约记录
          </button>
          <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
            账户设置
          </button>
          <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
            帮助中心
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('rental');

  const renderContent = () => {
    switch (activeTab) {
      case 'rental':
        return <RentalModule />;
      case 'services':
        return <ServicesModule />;
      case 'community':
        return <CommunityModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <RentalModule />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-xl">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
