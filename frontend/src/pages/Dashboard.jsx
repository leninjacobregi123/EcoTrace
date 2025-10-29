import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Building2, FileText, Newspaper, BookOpen, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle, XCircle, Clock, Filter, Download,
  ArrowUp, ArrowDown, Activity, Target, Award, Zap, Bell, Search,
  Calendar, Eye, ThumbsUp, ThumbsDown, AlertTriangle, Shield, Leaf
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data } = await axios.get('/api/analytics/overview')
      return data
    }
  })

  const { data: trends } = useQuery({
    queryKey: ['trends', timeRange],
    queryFn: async () => {
      const { data } = await axios.get(`/api/analytics/trends?days=30`)
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Mock data for enhanced visualizations
  const monthlyTrends = [
    { month: 'Jan', verified: 45, disputed: 12, pending: 8 },
    { month: 'Feb', verified: 52, disputed: 15, pending: 10 },
    { month: 'Mar', verified: 61, disputed: 18, pending: 7 },
    { month: 'Apr', verified: 58, disputed: 14, pending: 9 },
    { month: 'May', verified: 67, disputed: 16, pending: 11 },
    { month: 'Jun', verified: 73, disputed: 19, pending: 6 },
  ]

  const industryData = [
    { name: 'Technology', claims: 156, credibility: 82 },
    { name: 'Automotive', claims: 143, credibility: 75 },
    { name: 'Energy', claims: 98, credibility: 68 },
    { name: 'Retail', claims: 87, credibility: 71 },
    { name: 'Manufacturing', claims: 76, credibility: 79 },
  ]

  const claimTypes = [
    { type: 'Carbon Reduction', value: 156, color: '#10b981' },
    { type: 'Renewable Energy', value: 143, color: '#3b82f6' },
    { type: 'Waste Management', value: 98, color: '#f59e0b' },
    { type: 'Water Conservation', value: 87, color: '#8b5cf6' },
    { type: 'Biodiversity', value: 65, color: '#ec4899' },
  ]

  const credibilityDistribution = [
    { range: '90-100%', companies: 12, color: '#10b981' },
    { range: '80-89%', companies: 23, color: '#3b82f6' },
    { range: '70-79%', companies: 18, color: '#f59e0b' },
    { range: '60-69%', companies: 9, color: '#ef4444' },
    { range: '<60%', companies: 5, color: '#991b1b' },
  ]

  const topCompanies = [
    { name: 'Apple', score: 92, change: +5, trend: 'up' },
    { name: 'Microsoft', score: 89, change: +3, trend: 'up' },
    { name: 'Google', score: 87, change: -2, trend: 'down' },
    { name: 'Amazon', score: 84, change: +1, trend: 'up' },
    { name: 'Tesla', score: 81, change: +4, trend: 'up' },
  ]

  const recentAlerts = [
    {
      type: 'warning',
      company: 'Company X',
      message: 'Discrepancy found in carbon emissions report',
      time: '2 hours ago',
      icon: AlertTriangle
    },
    {
      type: 'success',
      company: 'Company Y',
      message: 'New sustainability report verified',
      time: '5 hours ago',
      icon: CheckCircle
    },
    {
      type: 'info',
      company: 'Company Z',
      message: 'Target deadline approaching (Net Zero 2030)',
      time: '1 day ago',
      icon: Clock
    },
  ]

  const stats = [
    {
      name: 'Total Companies',
      value: analytics?.total_companies || 0,
      icon: Building2,
      color: 'primary',
      change: '+12%',
      trend: 'up'
    },
    {
      name: 'Claims Analyzed',
      value: analytics?.total_claims || 0,
      icon: FileText,
      color: 'blue',
      change: '+23%',
      trend: 'up'
    },
    {
      name: 'Verified Claims',
      value: Math.floor((analytics?.total_claims || 0) * 0.73),
      icon: CheckCircle,
      color: 'green',
      change: '+8%',
      trend: 'up'
    },
    {
      name: 'Avg Credibility',
      value: `${analytics?.average_credibility_score?.toFixed(1) || '0.0'}%`,
      icon: Shield,
      color: 'purple',
      change: '+2.3%',
      trend: 'up'
    },
    {
      name: 'Active Alerts',
      value: 23,
      icon: Bell,
      color: 'yellow',
      change: '-5%',
      trend: 'down'
    },
    {
      name: 'Data Sources',
      value: 847,
      icon: Database,
      color: 'indigo',
      change: '+156',
      trend: 'up'
    },
  ]

  const performanceMetrics = [
    { metric: 'Transparency', value: 85 },
    { metric: 'Accuracy', value: 92 },
    { metric: 'Timeliness', value: 78 },
    { metric: 'Coverage', value: 88 },
    { metric: 'Verification', value: 91 },
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Actions */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl shadow-hard p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 flex items-center space-x-3">
                <Activity className="h-10 w-10" />
                <span>Sustainability Dashboard</span>
              </h1>
              <p className="text-primary-100 text-lg">Real-time monitoring of corporate environmental claims</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 border border-white/30"
              >
                <Download className="h-5 w-5" />
                <span>Export Report</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </motion.button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="mt-6 flex items-center space-x-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? 'bg-white text-primary-700 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {range === '7d' && 'Last 7 Days'}
                {range === '30d' && 'Last 30 Days'}
                {range === '90d' && 'Last 90 Days'}
                {range === '1y' && 'Last Year'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card group hover:shadow-hard transition-all duration-300 relative overflow-hidden"
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>

              <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
              <p className="text-xs text-gray-500 mt-2">vs last period</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alerts Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <Bell className="h-5 w-5 text-amber-600" />
            <span>Recent Alerts</span>
          </h3>
          <button className="text-sm font-medium text-amber-700 hover:text-amber-800">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {recentAlerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`flex items-start space-x-3 p-4 rounded-xl ${
                alert.type === 'warning' ? 'bg-amber-100' :
                alert.type === 'success' ? 'bg-green-100' :
                'bg-blue-100'
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                alert.type === 'warning' ? 'bg-amber-500' :
                alert.type === 'success' ? 'bg-green-500' :
                'bg-blue-500'
              }`}>
                <alert.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{alert.company}</p>
                <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts Row 1 - Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            <span>Claim Verification Trends</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrends}>
              <defs>
                <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorDisputed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="verified" stroke="#10b981" fillOpacity={1} fill="url(#colorVerified)" name="Verified" />
              <Area type="monotone" dataKey="disputed" stroke="#ef4444" fillOpacity={1} fill="url(#colorDisputed)" name="Disputed" />
              <Area type="monotone" dataKey="pending" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Claim Types Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Target className="h-5 w-5 text-secondary-600" />
            <span>Claim Types Distribution</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={claimTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {claimTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 - Industry & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Industry Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card lg:col-span-2"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary-600" />
            <span>Industry Performance</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={industryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="claims" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Total Claims" />
              <Bar yAxisId="right" dataKey="credibility" fill="#10b981" radius={[8, 8, 0, 0]} name="Credibility Score" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Zap className="h-5 w-5 text-accent-600" />
            <span>System Performance</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceMetrics}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Performance" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Companies Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Award className="h-5 w-5 text-yellow-500" />
          <span>Top Performing Companies</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Company</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Credibility Score</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Change</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Trend</th>
              </tr>
            </thead>
            <tbody>
              {topCompanies.map((company, index) => (
                <motion.tr
                  key={company.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-900">{company.name}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${company.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{company.score}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center space-x-1 text-sm font-semibold ${
                      company.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span>{company.change > 0 ? '+' : ''}{company.change}%</span>
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {company.trend === 'up' ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <TrendingUp className="h-5 w-5" />
                        <span className="text-sm font-medium">Rising</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-red-600">
                        <TrendingDown className="h-5 w-5" />
                        <span className="text-sm font-medium">Falling</span>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Credibility Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="card"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary-600" />
          <span>Credibility Score Distribution</span>
        </h3>

        <div className="space-y-4">
          {credibilityDistribution.map((range, index) => (
            <motion.div
              key={range.range}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="w-24 text-sm font-semibold text-gray-700">{range.range}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(range.companies / 67) * 100}%` }}
                  transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                  className="h-full rounded-full flex items-center justify-end pr-3"
                  style={{ backgroundColor: range.color }}
                >
                  <span className="text-sm font-bold text-white">{range.companies} companies</span>
                </motion.div>
              </div>
              <div className="w-16 text-right text-sm font-semibold text-gray-700">
                {((range.companies / 67) * 100).toFixed(0)}%
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="card"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Activity className="h-5 w-5 text-primary-600" />
          <span>Recent Activity</span>
        </h3>
        <div className="space-y-3">
          {analytics?.recent_activity?.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 + index * 0.1 }}
              className="flex items-start space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{activity.company}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{activity.text}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-xs text-gray-400 flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(activity.timestamp).toLocaleString()}</span>
                  </p>
                  <button className="text-xs font-medium text-primary-600 hover:text-primary-700">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:shadow-hard transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-lg">Add Company</h4>
            <Building2 className="h-8 w-8 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-primary-100 text-sm mb-4">Start tracking a new company's sustainability claims</p>
          <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all">
            Get Started
          </button>
        </div>

        <div className="card bg-gradient-to-br from-secondary-500 to-secondary-600 text-white hover:shadow-hard transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-lg">Run Analysis</h4>
            <Search className="h-8 w-8 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-secondary-100 text-sm mb-4">Analyze sustainability claims across multiple sources</p>
          <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all">
            Analyze Now
          </button>
        </div>

        <div className="card bg-gradient-to-br from-accent-500 to-accent-600 text-white hover:shadow-hard transition-all duration-300 cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-lg">Generate Report</h4>
            <Download className="h-8 w-8 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-accent-100 text-sm mb-4">Export comprehensive sustainability verification reports</p>
          <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all">
            Export PDF
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// Missing import for Database icon
import { Database, BarChart3 } from 'lucide-react'
