import React, { useState } from 'react';
import { MovementHistory } from '../../types/kanban';
import { X, Filter, Calendar, User, Search, Download, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface MovementHistoryPanelProps {
  history: MovementHistory[];
  onClose: () => void;
}

const MovementHistoryPanel: React.FC<MovementHistoryPanelProps> = ({ history, onClose }) => {
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [filterColumn, setFilterColumn] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Get unique agents and columns for filters
  const uniqueAgents = Array.from(new Set(history.map(h => h.agentName)));
  const uniqueColumns = Array.from(new Set([
    ...history.map(h => h.fromColumn),
    ...history.map(h => h.toColumn)
  ])).filter(col => col !== 'created');

  // Filter history
  const filteredHistory = history.filter(entry => {
    // Agent filter
    if (filterAgent !== 'all' && entry.agentName !== filterAgent) return false;
    
    // Column filter
    if (filterColumn !== 'all' && 
        entry.fromColumn !== filterColumn && 
        entry.toColumn !== filterColumn) return false;
    
    // Search query
    if (searchQuery && !entry.agentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !entry.notes?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Date range filter
    const entryDate = new Date(entry.timestamp);
    const now = new Date();
    
    switch (dateRange) {
      case 'today':
        return entryDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return entryDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return entryDate >= monthAgo;
      default:
        return true;
    }
  });

  const getColumnColor = (column: string) => {
    switch (column) {
      case 'todo': return 'text-vertex-blue';
      case 'in-progress': return 'text-vertex-cyan';
      case 'review': return 'text-vertex-amber';
      case 'completed': return 'text-vertex-green';
      default: return 'text-vertex-purple';
    }
  };

  const getColumnBgColor = (column: string) => {
    switch (column) {
      case 'todo': return 'bg-vertex-blue/20';
      case 'in-progress': return 'bg-vertex-cyan/20';
      case 'review': return 'bg-vertex-amber/20';
      case 'completed': return 'bg-vertex-green/20';
      default: return 'bg-vertex-purple/20';
    }
  };

  const formatTimestamp = (date: Date) => {
    return format(date, 'MMM dd, HH:mm:ss');
  };

  const handleExport = () => {
    const data = filteredHistory.map(entry => ({
      timestamp: entry.timestamp.toISOString(),
      agent: entry.agentName,
      from: entry.fromColumn,
      to: entry.toColumn,
      movedBy: entry.movedBy,
      notes: entry.notes || '',
    }));

    const csv = [
      ['Timestamp', 'Agent', 'From', 'To', 'Moved By', 'Notes'],
      ...data.map(row => [
        row.timestamp,
        row.agent,
        row.from,
        row.to,
        row.movedBy,
        row.notes,
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vertex-movement-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="holographic-glass rounded-2xl border border-vertex-surface/50">
      {/* Header */}
      <div className="p-4 border-b border-vertex-surface/50 flex items-center justify-between">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-vertex-amber mr-3" />
          <div>
            <h3 className="font-bold text-lg">Movement History</h3>
            <div className="text-sm text-vertex-cyan/70">
              {filteredHistory.length} of {history.length} movements shown
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="px-3 py-2 border-gradient rounded-lg hover:bg-vertex-surface/30 transition-colors flex items-center text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-vertex-surface/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-vertex-surface/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-vertex-cyan/50" />
            <input
              type="text"
              placeholder="Search movements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-vertex-surface border border-vertex-surface/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-vertex-blue w-full"
            />
          </div>

          {/* Agent Filter */}
          <div>
            <div className="flex items-center mb-1">
              <User className="w-4 h-4 text-vertex-cyan/70 mr-2" />
              <label className="text-sm text-vertex-cyan/70">Agent</label>
            </div>
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="w-full px-3 py-2 bg-vertex-surface border border-vertex-surface/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-vertex-blue text-sm"
            >
              <option value="all">All Agents</option>
              {uniqueAgents.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>

          {/* Column Filter */}
          <div>
            <div className="flex items-center mb-1">
              <Filter className="w-4 h-4 text-vertex-cyan/70 mr-2" />
              <label className="text-sm text-vertex-cyan/70">Column</label>
            </div>
            <select
              value={filterColumn}
              onChange={(e) => setFilterColumn(e.target.value)}
              className="w-full px-3 py-2 bg-vertex-surface border border-vertex-surface/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-vertex-blue text-sm"
            >
              <option value="all">All Columns</option>
              {uniqueColumns.map(col => (
                <option key={col} value={col}>{col.replace('-', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <div className="flex items-center mb-1">
              <Calendar className="w-4 h-4 text-vertex-cyan/70 mr-2" />
              <label className="text-sm text-vertex-cyan/70">Time Range</label>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full px-3 py-2 bg-vertex-surface border border-vertex-surface/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-vertex-blue text-sm"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="p-4 max-h-[400px] overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-vertex-cyan/50">
            <div className="text-4xl mb-3">📊</div>
            <div className="font-medium">No movement history found</div>
            <div className="text-sm mt-1">Try adjusting your filters</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((entry, index) => (
              <div
                key={entry.id}
                className="p-4 rounded-xl border-gradient hover:bg-vertex-surface/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="font-medium">{entry.agentName}</div>
                      <div className="text-xs px-2 py-1 bg-vertex-surface/50 text-vertex-cyan/70 rounded">
                        Task: {entry.taskId.slice(0, 8)}...
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* From Column */}
                      <div className={`px-3 py-1.5 rounded-lg ${getColumnBgColor(entry.fromColumn)} ${getColumnColor(entry.fromColumn)}`}>
                        <div className="text-xs font-medium capitalize">
                          {entry.fromColumn.replace('-', ' ')}
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <ArrowRight className="w-4 h-4 text-vertex-cyan/50" />
                      
                      {/* To Column */}
                      <div className={`px-3 py-1.5 rounded-lg ${getColumnBgColor(entry.toColumn)} ${getColumnColor(entry.toColumn)}`}>
                        <div className="text-xs font-medium capitalize">
                          {entry.toColumn.replace('-', ' ')}
                        </div>
                      </div>
                    </div>
                    
                    {entry.notes && (
                      <div className="mt-3 text-sm text-vertex-cyan/80">
                        {entry.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-sm font-mono text-vertex-cyan/70">
                      {formatTimestamp(entry.timestamp)}
                    </div>
                    <div className="text-xs text-vertex-purple/70 mt-1">
                      By: {entry.movedBy}
                    </div>
                  </div>
                </div>
                
                {/* Timeline indicator */}
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-vertex-cyan mr-2" />
                  <div className="flex-1 h-0.5 bg-vertex-surface/30" />
                  {index < filteredHistory.length - 1 && (
                    <div className="w-3 h-3 rounded-full bg-vertex-surface/50 ml-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-vertex-surface/50">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-vertex-blue">{filteredHistory.length}</div>
            <div className="text-xs text-vertex-cyan/70">Movements</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-vertex-cyan">{uniqueAgents.length}</div>
            <div className="text-xs text-vertex-cyan/70">Unique Agents</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-vertex-amber">
              {new Set(filteredHistory.map(h => h.movedBy)).size}
            </div>
            <div className="text-xs text-vertex-cyan/70">Users</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-vertex-green">
              {filteredHistory.filter(h => h.toColumn === 'completed').length}
            </div>
            <div className="text-xs text-vertex-cyan/70">Completions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementHistoryPanel;