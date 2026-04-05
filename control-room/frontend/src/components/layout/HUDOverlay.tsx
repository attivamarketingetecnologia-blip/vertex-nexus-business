import React from 'react';
import { Bell, X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { SystemStatus, Notification } from '../../types/vertex';

interface HUDOverlayProps {
  systemStatus: SystemStatus;
  currentTime: Date;
  notifications: Notification[];
  onNotificationRead: (id: string) => void;
}

const HUDOverlay: React.FC<HUDOverlayProps> = ({
  systemStatus,
  currentTime,
  notifications,
  onNotificationRead,
}) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-vertex-green" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-vertex-amber" />;
      case 'critical': return <AlertCircle className="w-4 h-4 text-vertex-danger" />;
      default: return <Info className="w-4 h-4 text-vertex-cyan" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-vertex-green';
      case 'warning': return 'text-vertex-amber';
      case 'critical': return 'text-vertex-danger';
      default: return 'text-vertex-cyan';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Status Bar */}
      <div className="holographic-glass border-b border-vertex-surface/50">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left: System Status */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(systemStatus.overall).replace('text-', 'bg-')}`} />
                <span className="text-sm font-medium">
                  System: <span className={getStatusColor(systemStatus.overall)}>{systemStatus.overall.toUpperCase()}</span>
                </span>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                {Object.entries(systemStatus.components).map(([key, component]) => (
                  <div key={key} className="flex items-center space-x-2">
                    {getStatusIcon(component.status)}
                    <span className="text-xs text-vertex-cyan/70 capitalize">{key}</span>
                    <span className={`text-xs ${getStatusColor(component.status)}`}>
                      {component.status === 'healthy' ? '✓' : '!'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Center: Time & Uptime */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-xs text-vertex-cyan/70">Mission Time</div>
                <div className="text-sm font-mono">{format(currentTime, 'HH:mm:ss')}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-vertex-cyan/70">Uptime</div>
                <div className="text-sm font-mono">{systemStatus.uptime}%</div>
              </div>
            </div>

            {/* Right: Notifications */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-vertex-surface/50 transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-vertex-cyan" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-vertex-danger text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 holographic-glass rounded-xl shadow-holographic border border-vertex-surface/50">
                    <div className="p-4 border-b border-vertex-surface/50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="p-1 hover:bg-vertex-surface/50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-vertex-cyan/70">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-vertex-surface/30 hover:bg-vertex-surface/30 transition-colors ${notification.read ? 'opacity-70' : ''}`}
                            onClick={() => onNotificationRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              {getStatusIcon(notification.type === 'error' ? 'critical' : notification.type === 'warning' ? 'warning' : 'healthy')}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{notification.title}</h4>
                                  <span className="text-xs text-vertex-cyan/70">
                                    {format(notification.timestamp, 'HH:mm')}
                                  </span>
                                </div>
                                <p className="text-sm text-vertex-cyan/80 mt-1">{notification.message}</p>
                                {!notification.read && (
                                  <div className="mt-2">
                                    <span className="text-xs px-2 py-1 bg-vertex-blue/20 text-vertex-blue rounded">
                                      New
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {unreadCount > 0 && (
                      <div className="p-3 border-t border-vertex-surface/50">
                        <button
                          onClick={() => notifications.forEach(n => !n.read && onNotificationRead(n.id))}
                          className="w-full text-sm text-vertex-cyan hover:text-vertex-blue transition-colors"
                        >
                          Mark all as read
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status Indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
        <div className="flex items-center space-x-2 px-4 py-2 holographic-glass rounded-b-xl border-t-0">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-vertex-green animate-pulse" />
            <span className="text-xs text-vertex-cyan/70">Connected</span>
          </div>
          <div className="text-xs text-vertex-purple/70">•</div>
          <div className="text-xs text-vertex-cyan/70">Latency: 24ms</div>
        </div>
      </div>
    </div>
  );
};

export default HUDOverlay;