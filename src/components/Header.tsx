'use client'

import { Zap, LayoutDashboard, Eye } from 'lucide-react'

interface HeaderProps {
  activeTab: 'dashboard' | 'visualization'
  onTabChange: (tab: 'dashboard' | 'visualization') => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">OpenClaw Mission Control</h1>
              <p className="text-gray-400 text-sm">Real-time agent monitoring dashboard</p>
            </div>
          </div>
          
          <nav className="flex space-x-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => onTabChange('visualization')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'visualization'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>3D Visualization</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}