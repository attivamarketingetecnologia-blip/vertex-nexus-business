import { Home, Users, Calendar, BarChart3, Settings, Terminal, Database, Shield, Globe, Cpu } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', active: true },
  { icon: Users, label: 'Agent Fleet', count: 5 },
  { icon: Calendar, label: 'Mission Diary', count: 4 },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Terminal, label: 'System Controls' },
  { icon: Database, label: 'Database' },
  { icon: Shield, label: 'Security' },
  { icon: Globe, label: 'Network' },
  { icon: Cpu, label: 'System Vitals' },
  { icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-2">Navigation</h2>
          <p className="text-sm text-gray-400">Control Room Interface</p>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-white border-l-4 border-purple-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.count && (
                <span className="px-2 py-1 text-xs font-medium bg-gray-800 text-gray-300 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
        
        <div className="mt-8 pt-8 border-t border-gray-800">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
              Deploy Agent
            </button>
            <button className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors">
              System Scan
            </button>
            <button className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-400">All Systems Normal</span>
          </div>
          <p className="text-xs text-gray-400">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </aside>
  );
}