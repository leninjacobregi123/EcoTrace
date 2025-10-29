import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Activity,
  Calendar, Download, Filter, ArrowUp, ArrowDown, Target, Award,
  Zap, Globe, Users, Building2, Leaf, AlertCircle, CheckCircle,
  ArrowRight, Eye, Clock, Shield, Database
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts'
import { motion } from 'framer-motion'
import axios from 'axios'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('6m')
  const [comparisonMode, setComparisonMode] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('claims')

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
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    )
  }

  // Mock data for comprehensive analytics
  const monthlyTrends = [
    { month: 'Jan', claims: 145, verified: 98, disputed: 25, companies: 45, score: 72 },
    { month: 'Feb', claims: 168, verified: 115, disputed: 28, companies: 52, score: 74 },
    { month: 'Mar', claims: 192, verified: 138, disputed: 32, companies: 58, score: 76 },
    { month: 'Apr', claims: 210, verified: 156, disputed: 29, companies: 61, score: 78 },
    { month: 'May', claims: 235, verified: 178, disputed: 31, companies: 67, score: 80 },
    { month: 'Jun', claims: 258, verified: 195, disputed: 35, companies: 73, score: 82 },
  ]

  const industryComparison = [
    { industry: 'Technology', claims: 156, credibility: 85, growth: 12 },
    { industry: 'Automotive', claims: 143, credibility: 78, growth: 8 },
    { industry: 'Energy', claims: 98, credibility: 72, growth: 15 },
    { industry: 'Retail', claims: 87, credibility: 76, growth: 6 },
    { industry: 'Manufacturing', claims: 76, credibility: 81, growth: 10 },
    { industry: 'Finance', claims: 64, credibility: 88, growth: 14 },
  ]

  const claimTypeEvolution = [
    { type: 'Carbon Reduction', Q1: 45, Q2: 58, Q3: 72, Q4: 85 },
    { type: 'Renewable Energy', Q1: 38, Q2: 52, Q3: 65, Q4: 78 },
    { type: 'Waste Management', Q1: 28, Q2: 35, Q3: 42, Q4: 48 },
    { type: 'Water Conservation', Q1: 22, Q2: 28, Q3: 35, Q4: 42 },
  ]

  const verificationMetrics = [
    { metric: 'Speed', value: 85, benchmark: 75 },
    { metric: 'Accuracy', value: 92, benchmark: 85 },
    { metric: 'Coverage', value: 78, benchmark: 70 },
    { metric: 'Reliability', value: 88, benchmark: 80 },
    { metric: 'Consistency', value: 91, benchmark: 85 },
  ]

  const geographicDistribution = [
    { region: 'North America', claims: 145, percentage: 35 },
    { region: 'Europe', claims: 128, percentage: 31 },
    { region: 'Asia Pacific', claims: 87, percentage: 21 },
    { region: 'Latin America', claims: 32, percentage: 8 },
    { region: 'Middle East', claims: 21, percentage: 5 },
  ]

  const topPerformers = [
    { company: 'Apple', score: 94, change: +8, claims: 23 },
    { company: 'Microsoft', score: 92, change: +5, claims: 28 },
    { company: 'Google', score: 89, change: +3, claims: 31 },
    { company: 'Tesla', score: 87, change: +12, claims: 19 },
    { company: 'Amazon', score: 84, change: +2, claims: 26 },
  ]

  const insights = [
    {
      title: 'Verification Rate Increasing',
      description: 'Overall verification rate improved by 15% this quarter',
      impact: 'positive',
      icon: CheckCircle,
      metric: '+15%'
    },
    {
      title: 'New Companies Tracked',
      description: '28 new companies added to monitoring in the last month',
      impact: 'positive',
      icon: Building2,
      metric: '+28'
    },
    {
      title: 'Disputed Claims Rising',
      description: 'Disputed claims increased by 8% - needs attention',
      impact: 'warning',
      icon: AlertCircle,
      metric: '+8%'
    },
    {
      title: 'Technology Sector Leading',
      description: 'Technology sector has highest average credibility score',
      impact: 'info',
      icon: Award,
      metric: '85%'
    },
  ]

  const kpiCards = [
    {
      title: 'Avg Verification Time',
      value: '4.2 days',
      change: '-12%',
      trend: 'down',
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'Data Sources',
      value: '847',
      change: '+156',
      trend: 'up',
      icon: Database,
      color: 'purple'
    },
    {
      title: 'Credibility Score',
      value: '82%',
      change: '+5%',
      trend: 'up',
      icon: Shield,
      color: 'green'
    },
    {
      title: 'Active Monitoring',
      value: '73',
      change: '+15',
      trend: 'up',
      icon: Eye,
      color: 'amber'
    },
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl shadow-hard p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2 flex items-center space-x-3">
                <BarChart3 className="h-10 w-10" />
                <span>Advanced Analytics</span>
              </h1>
              <p className="text-primary-100 text-lg">Comprehensive insights into sustainability verification trends</p>
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
                onClick={() => setComparisonMode(!comparisonMode)}
                className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2 ${
                  comparisonMode ? 'bg-white text-primary-700' : 'bg-white/20 text-white border border-white/30'
                }`}
              >
                <Filter className="h-5 w-5" />
                <span>Compare</span>
              </motion.button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            {[
              { value: '1m', label: 'Last Month' },
              { value: '3m', label: 'Last 3 Months' },
              { value: '6m', label: 'Last 6 Months' },
              { value: '1y', label: 'Last Year' },
              { value: 'all', label: 'All Time' },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range.value
                    ? 'bg-white text-primary-700 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card group hover:shadow-hard transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-${kpi.color}-50 to-${kpi.color}-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${kpi.color}-400 to-${kpi.color}-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-semibold ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  <span>{kpi.change}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
              <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`card border-2 ${
              insight.impact === 'positive' ? 'border-green-200 bg-green-50' :
              insight.impact === 'warning' ? 'border-amber-200 bg-amber-50' :
              'border-blue-200 bg-blue-50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                insight.impact === 'positive' ? 'bg-green-500' :
                insight.impact === 'warning' ? 'bg-amber-500' :
                'bg-blue-500'
              }`}>
                <insight.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">{insight.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                <div className="text-2xl font-bold text-gray-900">{insight.metric}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            <span>Sustainability Metrics Trends</span>
          </h3>
          <div className="flex items-center space-x-2">
            {['claims', 'verified', 'score'].map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMetric === metric
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={monthlyTrends}>
            <defs>
              <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
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
            <Area yAxisId="left" type="monotone" dataKey="claims" stroke="#10b981" fillOpacity={1} fill="url(#colorClaims)" name="Total Claims" />
            <Area yAxisId="left" type="monotone" dataKey="verified" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVerified)" name="Verified" />
            <Line yAxisId="right" type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} name="Avg Score" dot={{ r: 6 }} />
            <Bar yAxisId="left" dataKey="disputed" fill="#ef4444" radius={[8, 8, 0, 0]} name="Disputed" />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Industry Comparison & Verification Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Comparison */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Globe className="h-5 w-5 text-secondary-600" />
            <span>Industry Performance</span>
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={industryComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" />
              <YAxis dataKey="industry" type="category" width={100} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="claims" fill="#3b82f6" radius={[0, 8, 8, 0]} name="Claims" />
              <Bar dataKey="credibility" fill="#10b981" radius={[0, 8, 8, 0]} name="Credibility" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Verification Metrics Radar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Zap className="h-5 w-5 text-accent-600" />
            <span>Verification Performance</span>
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={verificationMetrics}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Current" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Radar name="Benchmark" dataKey="benchmark" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Claim Type Evolution & Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claim Type Evolution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card lg:col-span-2"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary-600" />
            <span>Claim Type Evolution (Quarterly)</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={claimTypeEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="type" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Q1" stroke="#10b981" strokeWidth={2} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="Q2" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="Q3" stroke="#f59e0b" strokeWidth={2} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="Q4" stroke="#ef4444" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Globe className="h-5 w-5 text-secondary-600" />
            <span>Regional Distribution</span>
          </h3>
          <div className="space-y-4">
            {geographicDistribution.map((region, index) => (
              <div key={region.region}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{region.region}</span>
                  <span className="font-bold text-gray-900">{region.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${region.percentage}%` }}
                    transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                    className="h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Performers Table */}
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
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Company</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Score</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Claims</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Change</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((company, index) => (
                <motion.tr
                  key={company.company}
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
                  <td className="py-4 px-4 font-semibold text-gray-900">{company.company}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                          style={{ width: `${company.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{company.score}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{company.claims}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center space-x-1 text-sm font-semibold text-green-600">
                      <ArrowUp className="h-4 w-4" />
                      <span>+{company.change}%</span>
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                      <CheckCircle className="h-3 w-3" />
                      <span>Excellent</span>
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
          className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold">Overall Progress</h3>
            <Target className="h-8 w-8 opacity-50" />
          </div>
          <p className="text-4xl font-bold mb-2">82%</p>
          <p className="text-primary-100">System performing above target</p>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span>Target: 75%</span>
              <span className="font-semibold">+7% above</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          className="card bg-gradient-to-br from-secondary-500 to-secondary-600 text-white"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold">Growth Rate</h3>
            <TrendingUp className="h-8 w-8 opacity-50" />
          </div>
          <p className="text-4xl font-bold mb-2">+18%</p>
          <p className="text-secondary-100">Month-over-month growth</p>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span>Previous: +12%</span>
              <span className="font-semibold">Accelerating</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="card bg-gradient-to-br from-accent-500 to-accent-600 text-white"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold">Forecast</h3>
            <Activity className="h-8 w-8 opacity-50" />
          </div>
          <p className="text-4xl font-bold mb-2">350+</p>
          <p className="text-accent-100">Expected claims next month</p>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span>Current: 258</span>
              <span className="font-semibold">+36% projected</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
