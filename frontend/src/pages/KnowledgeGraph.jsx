import { useState, useCallback, useMemo, useEffect } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Network, Building2, FileText, BookOpen, Newspaper, Shield, Scale,
  CheckCircle, AlertTriangle, XCircle, Clock, Info, Search, Filter,
  LayoutGrid, GitBranch, Target, Zap, Download, RefreshCw, Maximize2,
  X, TrendingUp, TrendingDown, Award, Database, Globe, Leaf, Wind,
  Droplet, Trees, Trash2
} from 'lucide-react'

// Custom Company Node Component
const CompanyNode = ({ data }) => {
  return (
    <div className="px-4 py-3 rounded-xl shadow-lg bg-gradient-to-br from-green-500 to-green-600 border-2 border-green-400 min-w-[150px]">
      <div className="flex items-center space-x-2 text-white">
        <Building2 className="h-5 w-5" />
        <div>
          <div className="font-bold text-sm">{data.label}</div>
          {data.score && (
            <div className="text-xs opacity-90">{data.score}% credibility</div>
          )}
        </div>
      </div>
    </div>
  )
}

// Custom Claim Node Component
const ClaimNode = ({ data }) => {
  const getStatusColor = () => {
    switch (data.status) {
      case 'verified': return 'from-blue-500 to-blue-600 border-blue-400'
      case 'pending': return 'from-yellow-500 to-yellow-600 border-yellow-400'
      case 'disputed': return 'from-red-500 to-red-600 border-red-400'
      default: return 'from-gray-500 to-gray-600 border-gray-400'
    }
  }

  const StatusIcon = () => {
    switch (data.status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'disputed': return <XCircle className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className={`px-3 py-2 rounded-lg shadow-lg bg-gradient-to-br ${getStatusColor()} border-2 max-w-[220px]`}>
      <div className="flex items-start space-x-2 text-white">
        <StatusIcon />
        <div>
          <div className="text-xs font-semibold">{data.label}</div>
          {data.confidence && (
            <div className="text-xs opacity-80 mt-1">{data.confidence}% confidence</div>
          )}
        </div>
      </div>
    </div>
  )
}

// Custom Source Node Component
const SourceNode = ({ data }) => {
  const getSourceIcon = () => {
    switch (data.type) {
      case 'report': return <FileText className="h-4 w-4 text-primary-600" />
      case 'scientific': return <BookOpen className="h-4 w-4 text-purple-600" />
      case 'news': return <Newspaper className="h-4 w-4 text-blue-600" />
      case 'regulatory': return <Scale className="h-4 w-4 text-amber-600" />
      default: return <Database className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="px-3 py-2 rounded-lg shadow-md bg-white border-2 border-gray-300 min-w-[140px] hover:border-primary-400 transition-colors">
      <div className="flex items-center space-x-2">
        {getSourceIcon()}
        <div className="text-xs font-medium text-gray-700">{data.label}</div>
      </div>
    </div>
  )
}

// Custom Regulatory Node Component
const RegulatoryNode = ({ data }) => {
  return (
    <div className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-purple-400 min-w-[140px]">
      <div className="flex items-center space-x-2 text-white">
        <Shield className="h-4 w-4" />
        <div className="text-xs font-bold">{data.label}</div>
      </div>
    </div>
  )
}

const nodeTypes = {
  company: CompanyNode,
  claim: ClaimNode,
  source: SourceNode,
  regulatory: RegulatoryNode,
}

// Enhanced node data with more companies and relationships
const generateNodes = () => [
  // Companies (Tier 1)
  { id: 'amazon', type: 'company', data: { label: 'Amazon', score: 84 }, position: { x: 400, y: 50 } },
  { id: 'google', type: 'company', data: { label: 'Google', score: 87 }, position: { x: 700, y: 50 } },
  { id: 'apple', type: 'company', data: { label: 'Apple', score: 92 }, position: { x: 1000, y: 50 } },
  { id: 'microsoft', type: 'company', data: { label: 'Microsoft', score: 89 }, position: { x: 100, y: 50 } },
  { id: 'tesla', type: 'company', data: { label: 'Tesla', score: 81 }, position: { x: 1300, y: 50 } },

  // Claims (Tier 2) - Verified
  { id: 'claim1', type: 'claim', data: { label: '100% Renewable Energy 2025', status: 'verified', confidence: 92 }, position: { x: 50, y: 250 } },
  { id: 'claim2', type: 'claim', data: { label: 'Carbon Neutral by 2030', status: 'verified', confidence: 88 }, position: { x: 350, y: 250 } },
  { id: 'claim3', type: 'claim', data: { label: 'Net Zero Supply Chain', status: 'pending', confidence: 72 }, position: { x: 650, y: 250 } },
  { id: 'claim4', type: 'claim', data: { label: 'Zero Waste Operations', status: 'verified', confidence: 85 }, position: { x: 950, y: 250 } },
  { id: 'claim5', type: 'claim', data: { label: '50% Emission Reduction', status: 'disputed', confidence: 58 }, position: { x: 1250, y: 250 } },
  { id: 'claim6', type: 'claim', data: { label: 'Water Conservation 40%', status: 'verified', confidence: 90 }, position: { x: 200, y: 250 } },
  { id: 'claim7', type: 'claim', data: { label: 'Biodiversity Protection', status: 'pending', confidence: 75 }, position: { x: 500, y: 250 } },
  { id: 'claim8', type: 'claim', data: { label: 'Circular Economy Model', status: 'verified', confidence: 83 }, position: { x: 800, y: 250 } },
  { id: 'claim9', type: 'claim', data: { label: 'Sustainable Sourcing', status: 'verified', confidence: 87 }, position: { x: 1100, y: 250 } },

  // Evidence Sources (Tier 3)
  { id: 'source1', type: 'source', data: { label: 'Sustainability Report 2024', type: 'report' }, position: { x: 100, y: 450 } },
  { id: 'source2', type: 'source', data: { label: 'IPCC Climate Study', type: 'scientific' }, position: { x: 300, y: 450 } },
  { id: 'source3', type: 'source', data: { label: 'Reuters News Article', type: 'news' }, position: { x: 500, y: 450 } },
  { id: 'source4', type: 'source', data: { label: 'SEC 10-K Filing', type: 'report' }, position: { x: 700, y: 450 } },
  { id: 'source5', type: 'source', data: { label: 'EPA Compliance Report', type: 'regulatory' }, position: { x: 900, y: 450 } },
  { id: 'source6', type: 'source', data: { label: 'Nature Journal Publication', type: 'scientific' }, position: { x: 1100, y: 450 } },
  { id: 'source7', type: 'source', data: { label: 'Annual Environmental Report', type: 'report' }, position: { x: 200, y: 450 } },
  { id: 'source8', type: 'source', data: { label: 'Bloomberg Analysis', type: 'news' }, position: { x: 400, y: 450 } },
  { id: 'source9', type: 'source', data: { label: 'GHG Protocol Standard', type: 'regulatory' }, position: { x: 600, y: 450 } },
  { id: 'source10', type: 'source', data: { label: 'MIT Energy Research', type: 'scientific' }, position: { x: 800, y: 450 } },
  { id: 'source11', type: 'source', data: { label: 'Corporate ESG Disclosure', type: 'report' }, position: { x: 1000, y: 450 } },
  { id: 'source12', type: 'source', data: { label: 'UN Climate Report', type: 'regulatory' }, position: { x: 1200, y: 450 } },

  // Regulatory Bodies (Tier 3)
  { id: 'reg1', type: 'regulatory', data: { label: 'EPA' }, position: { x: 150, y: 650 } },
  { id: 'reg2', type: 'regulatory', data: { label: 'SEC' }, position: { x: 450, y: 650 } },
  { id: 'reg3', type: 'regulatory', data: { label: 'UN Climate' }, position: { x: 750, y: 650 } },
  { id: 'reg4', type: 'regulatory', data: { label: 'EU Commission' }, position: { x: 1050, y: 650 } },
]

const generateEdges = () => [
  // Company to Claims
  { id: 'e1', source: 'microsoft', target: 'claim1', animated: true, style: { stroke: '#10b981', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, label: 'makes' },
  { id: 'e2', source: 'amazon', target: 'claim2', animated: true, style: { stroke: '#10b981', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, label: 'makes' },
  { id: 'e3', source: 'amazon', target: 'claim6', animated: true, style: { stroke: '#10b981', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, label: 'makes' },
  { id: 'e4', source: 'google', target: 'claim3', animated: true, style: { stroke: '#10b981', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, label: 'makes' },
  { id: 'e5', source: 'google', target: 'claim7', animated: true, style: { stroke: '#10b981', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, label: 'makes' },
  { id: 'e6', source: 'apple', target: 'claim4', animated: true, style: { stroke: '#10b981', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, label: 'makes' },
  { id: 'e7', source: 'apple', target: 'claim8', animated: true, style: { stroke: '#10b981', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, label: 'makes' },
  { id: 'e8', source: 'tesla', target: 'claim5', animated: true, style: { stroke: '#10b981', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, label: 'makes' },
  { id: 'e9', source: 'tesla', target: 'claim9', animated: true, style: { stroke: '#10b981', strokeWidth: 2.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, label: 'makes' },

  // Claims to Sources (Verified)
  { id: 'e10', source: 'claim1', target: 'source1', style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, label: 'verified by' },
  { id: 'e11', source: 'claim1', target: 'source2', style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, label: 'verified by' },
  { id: 'e12', source: 'claim2', target: 'source3', style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, label: 'verified by' },
  { id: 'e13', source: 'claim2', target: 'source4', style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, label: 'verified by' },
  { id: 'e14', source: 'claim4', target: 'source5', style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, label: 'verified by' },
  { id: 'e15', source: 'claim4', target: 'source6', style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, label: 'verified by' },
  { id: 'e16', source: 'claim6', target: 'source7', style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, label: 'verified by' },
  { id: 'e17', source: 'claim8', target: 'source8', style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, label: 'verified by' },
  { id: 'e18', source: 'claim9', target: 'source11', style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }, label: 'verified by' },

  // Claims to Sources (Pending)
  { id: 'e19', source: 'claim3', target: 'source9', style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' }, label: 'under review' },
  { id: 'e20', source: 'claim7', target: 'source10', style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' }, label: 'under review' },

  // Claims to Sources (Disputed)
  { id: 'e21', source: 'claim5', target: 'source12', style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' }, label: 'disputed' },

  // Sources to Regulatory
  { id: 'e22', source: 'source5', target: 'reg1', style: { stroke: '#8b5cf6', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
  { id: 'e23', source: 'source4', target: 'reg2', style: { stroke: '#8b5cf6', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
  { id: 'e24', source: 'source12', target: 'reg3', style: { stroke: '#8b5cf6', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
  { id: 'e25', source: 'source9', target: 'reg3', style: { stroke: '#8b5cf6', strokeWidth: 1.5 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
]

function KnowledgeGraphContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(generateNodes())
  const [edges, setEdges, onEdgesChange] = useEdgesState(generateEdges())
  const [selectedNode, setSelectedNode] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [layoutMode, setLayoutMode] = useState('default')
  const { fitView } = useReactFlow()

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node)
  }, [])

  // Calculate statistics
  const stats = useMemo(() => {
    const companies = nodes.filter(n => n.type === 'company').length
    const claims = nodes.filter(n => n.type === 'claim').length
    const sources = nodes.filter(n => n.type === 'source').length
    const verified = nodes.filter(n => n.data.status === 'verified').length
    const pending = nodes.filter(n => n.data.status === 'pending').length
    const disputed = nodes.filter(n => n.data.status === 'disputed').length

    return { companies, claims, sources, verified, pending, disputed, total: nodes.length }
  }, [nodes])

  // Filter nodes based on search and filters
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = !searchQuery ||
        node.data.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = filterType === 'all' || node.type === filterType

      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'verified' && node.data.status === 'verified') ||
        (filterStatus === 'pending' && node.data.status === 'pending') ||
        (filterStatus === 'disputed' && node.data.status === 'disputed')

      return matchesSearch && matchesType && matchesStatus
    })
  }, [nodes, searchQuery, filterType, filterStatus])

  // Update visible nodes
  useEffect(() => {
    setNodes(nodes.map(node => ({
      ...node,
      hidden: !filteredNodes.find(n => n.id === node.id)
    })))
  }, [filteredNodes, setNodes])

  // Auto-layout function
  const handleAutoLayout = useCallback(() => {
    const layoutedNodes = nodes.map((node, index) => {
      let newPosition = { ...node.position }

      if (layoutMode === 'hierarchical') {
        // Hierarchical layout
        if (node.type === 'company') newPosition = { x: index * 320, y: 50 }
        else if (node.type === 'claim') newPosition = { x: (index - 5) * 160, y: 300 }
        else if (node.type === 'source') newPosition = { x: (index - 14) * 120, y: 550 }
        else if (node.type === 'regulatory') newPosition = { x: (index - 26) * 300, y: 750 }
      } else if (layoutMode === 'circular') {
        // Circular layout
        const radius = 300
        const angle = (index / nodes.length) * 2 * Math.PI
        newPosition = {
          x: 600 + radius * Math.cos(angle),
          y: 400 + radius * Math.sin(angle)
        }
      } else if (layoutMode === 'grid') {
        // Grid layout
        const cols = 5
        newPosition = {
          x: (index % cols) * 280 + 100,
          y: Math.floor(index / cols) * 200 + 100
        }
      }

      return { ...node, position: newPosition }
    })

    setNodes(layoutedNodes)
    setTimeout(() => fitView({ duration: 800 }), 100)
  }, [nodes, layoutMode, setNodes, fitView])

  const legend = [
    { icon: Building2, label: 'Companies', color: 'bg-gradient-to-r from-green-500 to-green-600', count: stats.companies },
    { icon: CheckCircle, label: 'Verified Claims', color: 'bg-gradient-to-r from-blue-500 to-blue-600', count: stats.verified },
    { icon: Clock, label: 'Pending Claims', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600', count: stats.pending },
    { icon: XCircle, label: 'Disputed Claims', color: 'bg-gradient-to-r from-red-500 to-red-600', count: stats.disputed },
    { icon: FileText, label: 'Evidence Sources', color: 'bg-white border-2 border-gray-300 text-gray-700', count: stats.sources },
    { icon: Shield, label: 'Regulatory Bodies', color: 'bg-gradient-to-r from-purple-500 to-purple-600', count: nodes.filter(n => n.type === 'regulatory').length },
  ]

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl shadow-hard p-8 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 flex items-center space-x-3">
              <Network className="h-10 w-10" />
              <span>Knowledge Graph</span>
            </h1>
            <p className="text-primary-100 text-lg">Interactive network visualization of sustainability claims, evidence, and relationships</p>
          </div>
          <div className="flex space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30">
              <div className="text-4xl font-bold">{stats.total}</div>
              <div className="text-sm text-primary-100">Total Nodes</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30">
              <div className="text-4xl font-bold">{edges.length}</div>
              <div className="text-sm text-primary-100">Connections</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {legend.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-soft p-4 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center shadow-md mb-3`}>
              <item.icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{item.count}</div>
            <div className="text-sm text-gray-600">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-xl shadow-soft p-4 border border-gray-100">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Filter by Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Types</option>
            <option value="company">Companies</option>
            <option value="claim">Claims</option>
            <option value="source">Sources</option>
            <option value="regulatory">Regulatory</option>
          </select>

          {/* Filter by Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="disputed">Disputed</option>
          </select>

          {/* Layout Mode */}
          <select
            value={layoutMode}
            onChange={(e) => setLayoutMode(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="default">Default Layout</option>
            <option value="hierarchical">Hierarchical</option>
            <option value="circular">Circular</option>
            <option value="grid">Grid</option>
          </select>

          {/* Action Buttons */}
          <button
            onClick={handleAutoLayout}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Apply Layout</span>
          </button>

          <button
            onClick={() => fitView({ duration: 800 })}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
            <span>Fit View</span>
          </button>

          <button
            className="flex items-center space-x-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Graph Container */}
      <div className="card p-0 overflow-hidden" style={{ height: '700px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          defaultEdgeOptions={{
            type: 'smoothstep',
          }}
        >
          <Background
            variant="dots"
            gap={20}
            size={1.5}
            color="#e5e7eb"
          />
          <Controls
            className="bg-white rounded-xl shadow-lg border border-gray-200"
            showInteractive={false}
          />
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'company') return '#10b981'
              if (node.data.status === 'verified') return '#3b82f6'
              if (node.data.status === 'pending') return '#f59e0b'
              if (node.data.status === 'disputed') return '#ef4444'
              if (node.type === 'regulatory') return '#8b5cf6'
              return '#e5e7eb'
            }}
            className="bg-white rounded-xl shadow-lg border border-gray-200"
            maskColor="rgba(0, 0, 0, 0.05)"
          />

          {/* Custom Panel */}
          <Panel position="top-right" className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="font-bold text-gray-900 mb-2">Network Stats</div>
              <div className="flex justify-between">
                <span className="text-gray-600">Companies:</span>
                <span className="font-semibold text-gray-900">{stats.companies}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Claims:</span>
                <span className="font-semibold text-gray-900">{stats.claims}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sources:</span>
                <span className="font-semibold text-gray-900">{stats.sources}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Connections:</span>
                <span className="font-semibold text-gray-900">{edges.length}</span>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Node Details Modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Node Details</h2>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {selectedNode.type === 'company' && <Building2 className="h-8 w-8 text-green-600" />}
                    {selectedNode.type === 'claim' && <FileText className="h-8 w-8 text-blue-600" />}
                    {selectedNode.type === 'source' && <Database className="h-8 w-8 text-gray-600" />}
                    {selectedNode.type === 'regulatory' && <Shield className="h-8 w-8 text-purple-600" />}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedNode.data.label}</h3>
                      <p className="text-sm text-gray-600 capitalize">{selectedNode.type} Node</p>
                    </div>
                  </div>

                  {/* Node-specific details */}
                  {selectedNode.data.score && (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Credibility Score</span>
                        <span className="text-2xl font-bold text-green-600">{selectedNode.data.score}%</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedNode.data.score}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-green-500 to-green-600"
                        />
                      </div>
                    </div>
                  )}

                  {selectedNode.data.confidence && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Confidence Level</span>
                        <span className="text-2xl font-bold text-blue-600">{selectedNode.data.confidence}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedNode.data.confidence}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                        />
                      </div>
                    </div>
                  )}

                  {selectedNode.data.status && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        selectedNode.data.status === 'verified' ? 'bg-blue-100 text-blue-700' :
                        selectedNode.data.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {selectedNode.data.status.charAt(0).toUpperCase() + selectedNode.data.status.slice(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Technical Details */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-gray-900 mb-3">Technical Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Node ID:</span>
                      <p className="font-mono font-semibold text-gray-900">{selectedNode.id}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <p className="font-semibold text-gray-900 capitalize">{selectedNode.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Position X:</span>
                      <p className="font-mono font-semibold text-gray-900">{selectedNode.position.x.toFixed(0)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Position Y:</span>
                      <p className="font-mono font-semibold text-gray-900">{selectedNode.position.y.toFixed(0)}</p>
                    </div>
                  </div>
                </div>

                {/* Connections */}
                <div className="bg-primary-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <GitBranch className="h-5 w-5 text-primary-600" />
                    <span>Connections</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Incoming:</span>
                      <p className="text-2xl font-bold text-primary-600">
                        {edges.filter(e => e.target === selectedNode.id).length}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Outgoing:</span>
                      <p className="text-2xl font-bold text-primary-600">
                        {edges.filter(e => e.source === selectedNode.id).length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold">
                    View Full Details
                  </button>
                  <button className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
                    Related Nodes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span>Interactive Controls</span>
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Click & Drag</strong> nodes to rearrange the graph layout
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Scroll or Pinch</strong> to zoom in and out
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Click Nodes</strong> to view detailed information in modal
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Pan</strong> by dragging the background
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Use Filters</strong> to focus on specific node types or status
              </div>
            </li>
          </ul>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Edge Types</span>
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start space-x-3">
              <div className="w-8 h-0.5 bg-green-500 mt-2 rounded"></div>
              <div>
                <strong>Green Solid</strong> - Company makes claim relationship
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-8 h-0.5 border-t-2 border-dashed border-blue-500 mt-2"></div>
              <div>
                <strong>Blue Dashed</strong> - Claim verified by source
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-8 h-0.5 border-t-2 border-dashed border-yellow-500 mt-2"></div>
              <div>
                <strong>Yellow Dashed</strong> - Claim under review
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-8 h-0.5 border-t-2 border-dashed border-red-500 mt-2"></div>
              <div>
                <strong>Red Dashed</strong> - Disputed claim
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-8 h-0.5 bg-purple-500 mt-2 rounded"></div>
              <div>
                <strong>Purple Solid</strong> - Regulatory oversight
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function KnowledgeGraph() {
  return (
    <ReactFlowProvider>
      <KnowledgeGraphContent />
    </ReactFlowProvider>
  )
}
