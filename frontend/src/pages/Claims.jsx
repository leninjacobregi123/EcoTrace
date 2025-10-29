import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Filter, Download, Search, Calendar, Eye, ExternalLink,
  CheckCircle, XCircle, AlertTriangle, Clock, TrendingUp, BarChart3,
  Target, Leaf, Droplet, Trash2, Wind, Trees, Building2, Shield,
  ChevronDown, Grid3x3, List, SortAsc, SortDesc, Info
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'

// Claim type icons and colors
const claimTypeConfig = {
  emissions: { icon: Wind, color: 'blue', label: 'Carbon Emissions' },
  renewable_energy: { icon: Leaf, color: 'green', label: 'Renewable Energy' },
  waste: { icon: Trash2, color: 'amber', label: 'Waste Management' },
  water: { icon: Droplet, color: 'cyan', label: 'Water Conservation' },
  biodiversity: { icon: Trees, color: 'emerald', label: 'Biodiversity' },
  default: { icon: Target, color: 'gray', label: 'General' }
}

// Verification status config
const statusConfig = {
  verified: { icon: CheckCircle, color: 'green', label: 'Verified', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  disputed: { icon: XCircle, color: 'red', label: 'Disputed', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  pending: { icon: Clock, color: 'yellow', label: 'Pending Review', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  warning: { icon: AlertTriangle, color: 'orange', label: 'Needs Attention', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' }
}

// Helper to get company logo
const getCompanyLogo = (website) => {
  if (!website) return null
  const domain = website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  return `https://logo.clearbit.com/${domain}?size=60`
}

export default function Claims() {
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [sortBy, setSortBy] = useState('date') // date, company, score
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [imageErrors, setImageErrors] = useState({})

  const { data: claims, isLoading } = useQuery({
    queryKey: ['claims'],
    queryFn: async () => {
      const { data } = await axios.get('/api/claims?limit=100')
      // Enhance claims with mock data for demo
      return data.map((claim, idx) => ({
        ...claim,
        status: ['verified', 'pending', 'verified', 'warning', 'verified', 'disputed'][idx % 6],
        claim_type: ['emissions', 'renewable_energy', 'waste', 'water', 'biodiversity'][idx % 5],
        confidence_score: claim.confidence_score || (0.5 + Math.random() * 0.4),
        claim_text: claim.claim_text || `Sustainability target for ${claim.company_name || 'Company'}`,
        evidence_count: Math.floor(Math.random() * 10) + 3,
        views: Math.floor(Math.random() * 1000) + 100,
        last_updated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }))
    }
  })

  const handleImageError = (companyId) => {
    setImageErrors(prev => ({ ...prev, [companyId]: true }))
  }

  // Statistics
  const stats = claims ? {
    total: claims.length,
    verified: claims.filter(c => c.status === 'verified').length,
    pending: claims.filter(c => c.status === 'pending').length,
    disputed: claims.filter(c => c.status === 'disputed').length,
    avgScore: (claims.reduce((acc, c) => acc + (c.confidence_score || 0), 0) / claims.length * 100).toFixed(1)
  } : {}

  // Chart data
  const typeDistribution = claims ? Object.entries(
    claims.reduce((acc, claim) => {
      const type = claim.claim_type || 'default'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})
  ).map(([type, count]) => ({
    name: claimTypeConfig[type]?.label || 'Other',
    value: count,
    color: claimTypeConfig[type]?.color || 'gray'
  })) : []

  const statusDistribution = claims ? [
    { name: 'Verified', value: stats.verified, color: '#10b981' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Disputed', value: stats.disputed, color: '#ef4444' },
  ] : []

  // Filtering and sorting
  const filteredClaims = claims?.filter(claim => {
    const matchesType = filterType === 'all' || claim.claim_type === filterType
    const matchesStatus = filterStatus === 'all' || claim.status === filterStatus
    const matchesSearch = !searchQuery ||
      claim.claim_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  }).sort((a, b) => {
    if (sortBy === 'date') return new Date(b.last_updated) - new Date(a.last_updated)
    if (sortBy === 'company') return (a.company_name || '').localeCompare(b.company_name || '')
    if (sortBy === 'score') return (b.confidence_score || 0) - (a.confidence_score || 0)
    return 0
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading claims...</p>
        </div>
      </div>
    )
  }

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
                <FileText className="h-10 w-10" />
                <span>Sustainability Claims</span>
              </h1>
              <p className="text-primary-100 text-lg">Track and verify corporate environmental commitments</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 border border-white/30"
              >
                <Download className="h-5 w-5" />
                <span>Export</span>
              </motion.button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-sm text-primary-100">Total Claims</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{stats.verified}</div>
              <div className="text-sm text-primary-100">Verified</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{stats.pending}</div>
              <div className="text-sm text-primary-100">Pending</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{stats.disputed}</div>
              <div className="text-sm text-primary-100">Disputed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold">{stats.avgScore}%</div>
              <div className="text-sm text-primary-100">Avg Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary-600" />
            <span>Claims by Type</span>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={typeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.color === 'green' ? '#10b981' :
                    entry.color === 'blue' ? '#3b82f6' :
                    entry.color === 'amber' ? '#f59e0b' :
                    entry.color === 'cyan' ? '#06b6d4' :
                    entry.color === 'emerald' ? '#10b981' : '#6b7280'
                  } />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-secondary-600" />
            <span>Verification Status</span>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Filters and Controls */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search claims or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium"
            >
              <option value="all">All Types</option>
              <option value="emissions">Carbon Emissions</option>
              <option value="renewable_energy">Renewable Energy</option>
              <option value="waste">Waste Management</option>
              <option value="water">Water Conservation</option>
              <option value="biodiversity">Biodiversity</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="disputed">Disputed</option>
              <option value="warning">Warning</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium"
            >
              <option value="date">Sort by Date</option>
              <option value="company">Sort by Company</option>
              <option value="score">Sort by Score</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-md' : 'hover:bg-gray-200'}`}
              >
                <Grid3x3 className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-md' : 'hover:bg-gray-200'}`}
              >
                <List className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredClaims?.length || 0}</span> of <span className="font-semibold text-gray-900">{claims?.length || 0}</span> claims
        </div>
      </div>

      {/* Claims Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
        {filteredClaims?.map((claim, index) => {
          const typeConfig = claimTypeConfig[claim.claim_type] || claimTypeConfig.default
          const status = statusConfig[claim.status] || statusConfig.pending
          const logoUrl = getCompanyLogo(claim.source_url)
          const hasError = imageErrors[claim.company_id]

          return (
            <motion.div
              key={claim.claim_id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`card group hover:shadow-hard transition-all duration-300 ${viewMode === 'list' ? 'flex items-start space-x-4' : ''}`}
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {logoUrl && !hasError ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shadow-md flex items-center justify-center p-1">
                          <img
                            src={logoUrl}
                            alt={`${claim.company_name} logo`}
                            className="w-full h-full object-contain"
                            onError={() => handleImageError(claim.company_id)}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary-600" />
                        </div>
                      )}
                      <div>
                        <Link to={`/companies/${claim.company_id}`} className="font-bold text-gray-900 hover:text-primary-600 transition-colors">
                          {claim.company_name || 'Unknown Company'}
                        </Link>
                        <p className="text-xs text-gray-500">{new Date(claim.last_updated).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg ${status.bg} ${status.text} border ${status.border} flex items-center space-x-1 text-xs font-semibold`}>
                      <status.icon className="h-3 w-3" />
                      <span>{status.label}</span>
                    </div>
                  </div>

                  {/* Claim Type Badge */}
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-${typeConfig.color}-50 text-${typeConfig.color}-700 border border-${typeConfig.color}-200 text-sm font-medium mb-3`}>
                    <typeConfig.icon className="h-4 w-4" />
                    <span>{typeConfig.label}</span>
                  </div>

                  {/* Claim Text */}
                  <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {claim.claim_text || 'No description available'}
                  </p>

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{claim.evidence_count} sources</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{claim.views} views</span>
                      </div>
                    </div>
                    {claim.target_year && (
                      <div className="flex items-center space-x-1 font-semibold text-primary-600">
                        <Calendar className="h-4 w-4" />
                        <span>Target: {claim.target_year}</span>
                      </div>
                    )}
                  </div>

                  {/* Confidence Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Confidence Score</span>
                      <span className="font-bold text-gray-900">{(claim.confidence_score * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          claim.confidence_score >= 0.8 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          claim.confidence_score >= 0.6 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                          'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: `${claim.confidence_score * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedClaim(claim)}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                    >
                      <Info className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    {claim.source_url && (
                      <a
                        href={claim.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </>
              ) : (
                // List View
                <>
                  <div className="flex-shrink-0">
                    {logoUrl && !hasError ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-md flex items-center justify-center p-1">
                        <img
                          src={logoUrl}
                          alt={`${claim.company_name} logo`}
                          className="w-full h-full object-contain"
                          onError={() => handleImageError(claim.company_id)}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-primary-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link to={`/companies/${claim.company_id}`} className="font-bold text-lg text-gray-900 hover:text-primary-600 transition-colors">
                          {claim.company_name || 'Unknown Company'}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">{claim.claim_text || 'No description available'}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-lg ${status.bg} ${status.text} border ${status.border} flex items-center space-x-1 text-xs font-semibold flex-shrink-0 ml-4`}>
                        <status.icon className="h-3 w-3" />
                        <span>{status.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded bg-${typeConfig.color}-50 text-${typeConfig.color}-700`}>
                        <typeConfig.icon className="h-3 w-3" />
                        <span>{typeConfig.label}</span>
                      </div>
                      <span>{claim.evidence_count} sources</span>
                      <span>{claim.views} views</span>
                      <span>{(claim.confidence_score * 100).toFixed(0)}% confidence</span>
                      {claim.target_year && <span className="font-semibold text-primary-600">Target: {claim.target_year}</span>}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredClaims?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No claims found</h3>
          <p className="text-gray-500">Try adjusting your filters or search query</p>
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedClaim(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Claim Details</h2>
                  <button
                    onClick={() => setSelectedClaim(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Company</label>
                    <p className="text-lg font-bold text-gray-900 mt-1">{selectedClaim.company_name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600">Claim</label>
                    <p className="text-gray-700 mt-1 leading-relaxed">{selectedClaim.claim_text}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Status</label>
                      <p className="font-medium text-gray-900 mt-1">{statusConfig[selectedClaim.status]?.label}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Confidence Score</label>
                      <p className="font-bold text-gray-900 mt-1">{(selectedClaim.confidence_score * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  {selectedClaim.target_year && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Target Year</label>
                      <p className="font-medium text-gray-900 mt-1">{selectedClaim.target_year}</p>
                    </div>
                  )}

                  {selectedClaim.source_url && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Source</label>
                      <a
                        href={selectedClaim.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 mt-1 flex items-center space-x-1"
                      >
                        <span className="truncate">{selectedClaim.source_url}</span>
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                      </a>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                      Verify Claim
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
