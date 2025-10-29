import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search as SearchIcon, Filter, TrendingUp, Clock, X, Building2,
  FileText, Newspaper, BookOpen, ChevronDown, ChevronUp, Download,
  Star, Bookmark, Share2, ExternalLink, CheckCircle, AlertTriangle,
  BarChart3, Grid, List, Sparkles, Zap, Target, ArrowRight, Leaf
} from 'lucide-react'
import axios from 'axios'

export default function Search() {
  // State management
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [resultType, setResultType] = useState('all') // 'all', 'companies', 'claims', 'news', 'sources'
  const [sortBy, setSortBy] = useState('relevance') // 'relevance', 'date', 'score'
  const [showFilters, setShowFilters] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [savedSearches, setSavedSearches] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 12

  // Popular searches
  const popularSearches = [
    { text: 'Carbon neutral', icon: Leaf, count: 1234 },
    { text: 'Renewable energy', icon: Zap, count: 987 },
    { text: 'Tesla sustainability', icon: Building2, count: 756 },
    { text: 'Green washing', icon: AlertTriangle, count: 654 },
    { text: 'Net zero emissions', icon: Target, count: 543 },
  ]

  // Quick filters
  const quickFilters = [
    { label: 'Verified Only', key: 'verified', icon: CheckCircle },
    { label: 'High Confidence', key: 'highConfidence', icon: TrendingUp },
    { label: 'Recent', key: 'recent', icon: Clock },
    { label: 'Featured', key: 'featured', icon: Star },
  ]

  const [activeFilters, setActiveFilters] = useState([])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
    const savedSearchesData = localStorage.getItem('savedSearches')
    if (savedSearchesData) {
      setSavedSearches(JSON.parse(savedSearchesData))
    }
  }, [])

  // Save search to recent searches
  const addToRecentSearches = (searchQuery) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Handle search
  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setCurrentPage(1)
    addToRecentSearches(query)

    try {
      const { data } = await axios.get(`/api/search?q=${encodeURIComponent(query)}&limit=50`)
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Filter results
  const filteredResults = results.filter(result => {
    if (resultType === 'all') return true
    if (resultType === 'companies') return result._index === 'companies'
    if (resultType === 'claims') return result._index === 'claims'
    if (resultType === 'news') return result._index === 'news'
    if (resultType === 'sources') return result._index?.includes('sources')
    return true
  })

  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'relevance') return (b._score || 0) - (a._score || 0)
    if (sortBy === 'date') {
      const dateA = new Date(a.published_date || a.last_updated || 0)
      const dateB = new Date(b.published_date || b.last_updated || 0)
      return dateB - dateA
    }
    if (sortBy === 'score') {
      const scoreA = a.credibility_score || a.confidence_score || 0
      const scoreB = b.credibility_score || b.confidence_score || 0
      return scoreB - scoreA
    }
    return 0
  })

  // Paginate results
  const paginatedResults = sortedResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  )
  const totalPages = Math.ceil(sortedResults.length / resultsPerPage)

  // Get result type icon and color
  const getResultTypeInfo = (result) => {
    const index = result._index
    if (index === 'companies') {
      return {
        icon: Building2,
        label: 'Company',
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200'
      }
    }
    if (index === 'claims') {
      return {
        icon: FileText,
        label: 'Claim',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200'
      }
    }
    if (index === 'news') {
      return {
        icon: Newspaper,
        label: 'News',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200'
      }
    }
    return {
      icon: BookOpen,
      label: 'Source',
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200'
    }
  }

  // Toggle filter
  const toggleFilter = (filterKey) => {
    setActiveFilters(prev =>
      prev.includes(filterKey)
        ? prev.filter(f => f !== filterKey)
        : [...prev, filterKey]
    )
  }

  // Save current search
  const saveSearch = () => {
    if (!query.trim()) return
    const searchData = {
      query,
      resultType,
      sortBy,
      timestamp: new Date().toISOString(),
      resultsCount: sortedResults.length
    }
    const updated = [searchData, ...savedSearches.filter(s => s.query !== query)].slice(0, 10)
    setSavedSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
  }

  // Remove saved search
  const removeSavedSearch = (searchQuery) => {
    const updated = savedSearches.filter(s => s.query !== searchQuery)
    setSavedSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
  }

  // Load saved search
  const loadSavedSearch = (savedSearch) => {
    setQuery(savedSearch.query)
    setResultType(savedSearch.resultType)
    setSortBy(savedSearch.sortBy)
    // Trigger search
    setTimeout(() => {
      const form = document.getElementById('search-form')
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
    }, 100)
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl shadow-hard p-8 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="search-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#search-grid)" />
          </svg>
        </div>

        <div className="relative">
          <div className="flex items-center space-x-3 mb-3">
            <SearchIcon className="h-10 w-10" />
            <h1 className="text-4xl font-display font-bold">Advanced Search</h1>
          </div>
          <p className="text-primary-100 text-lg">Search across companies, claims, news, and evidence sources</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="card">
        <form id="search-form" onSubmit={handleSearch} className="space-y-4">
          {/* Main Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for companies, sustainability claims, news articles..."
              className="w-full pl-14 pr-32 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => toggleFilter(filter.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  activeFilters.includes(filter.key)
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                }`}
              >
                <filter.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{filter.label}</span>
              </button>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Advanced Filters</span>
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-50 rounded-xl p-4 space-y-4 border-2 border-gray-200">
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Result Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Result Type</label>
                      <select
                        value={resultType}
                        onChange={(e) => setResultType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="all">All Results</option>
                        <option value="companies">Companies Only</option>
                        <option value="claims">Claims Only</option>
                        <option value="news">News Only</option>
                        <option value="sources">Sources Only</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="relevance">Most Relevant</option>
                        <option value="date">Most Recent</option>
                        <option value="score">Highest Score</option>
                      </select>
                    </div>

                    {/* View Mode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setViewMode('grid')}
                          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                            viewMode === 'grid'
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'bg-white text-gray-700 border-gray-300'
                          }`}
                        >
                          <Grid className="h-4 w-4" />
                          <span>Grid</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('list')}
                          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                            viewMode === 'list'
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'bg-white text-gray-700 border-gray-300'
                          }`}
                        >
                          <List className="h-4 w-4" />
                          <span>List</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Search Suggestions (when no results) */}
      {!loading && results.length === 0 && !query && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Popular Searches */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              <h3 className="font-bold text-gray-900">Popular Searches</h3>
            </div>
            <div className="space-y-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => { setQuery(search.text); setTimeout(() => handleSearch(), 100); }}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <search.icon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    <span className="text-gray-700 group-hover:text-primary-600 font-medium transition-colors">{search.text}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{search.count.toLocaleString()}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent & Saved Searches */}
          <div className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="card">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <h3 className="font-bold text-gray-900">Recent Searches</h3>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => { setQuery(search); setTimeout(() => handleSearch(), 100); }}
                      className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                    >
                      <span className="text-gray-700 group-hover:text-primary-600 transition-colors">{search}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Searches */}
            {savedSearches.length > 0 && (
              <div className="card">
                <div className="flex items-center space-x-2 mb-4">
                  <Bookmark className="h-5 w-5 text-amber-600" />
                  <h3 className="font-bold text-gray-900">Saved Searches</h3>
                </div>
                <div className="space-y-2">
                  {savedSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <button
                        onClick={() => loadSavedSearch(search)}
                        className="flex-1 text-left"
                      >
                        <div className="text-gray-700 group-hover:text-primary-600 font-medium transition-colors">{search.query}</div>
                        <div className="text-xs text-gray-500 mt-1">{search.resultsCount} results</div>
                      </button>
                      <button
                        onClick={() => removeSavedSearch(search.query)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Header */}
      {results.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">
              {sortedResults.length} {sortedResults.length === 1 ? 'result' : 'results'} for "{query}"
            </h2>
            <button
              onClick={saveSearch}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <Bookmark className="h-4 w-4" />
              <span>Save Search</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      )}

      {/* Results Grid */}
      {!loading && paginatedResults.length > 0 && (
        <>
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {paginatedResults.map((result, index) => {
              const typeInfo = getResultTypeInfo(result)
              const Icon = typeInfo.icon

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`card hover:shadow-lg transition-all ${viewMode === 'list' ? 'flex space-x-4' : ''}`}
                >
                  {/* Type Badge */}
                  <div className={viewMode === 'list' ? 'flex-shrink-0' : 'mb-3'}>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${typeInfo.bg} ${typeInfo.border} border`}>
                      <Icon className={`h-4 w-4 ${typeInfo.color}`} />
                      <span className={`text-xs font-semibold ${typeInfo.color}`}>{typeInfo.label}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                      {result.name || result.company_name || result.title || result.claim_text?.substring(0, 80) || 'Result'}
                    </h3>

                    {result.claim_text && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{result.claim_text}</p>
                    )}

                    {result.summary && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{result.summary}</p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500 mb-3">
                      {result.credibility_score && (
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="h-3 w-3" />
                          <span>{Math.round(result.credibility_score * 100)}% credibility</span>
                        </div>
                      )}
                      {result.confidence_score && (
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{Math.round(result.confidence_score * 100)}% confidence</span>
                        </div>
                      )}
                      {(result.published_date || result.last_updated) && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(result.published_date || result.last_updated).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                        View Details
                      </button>
                      {result.source_url && (
                        <a
                          href={result.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-600" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === i + 1
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {!loading && query && results.length === 0 && (
        <div className="card text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
              <SearchIcon className="h-10 w-10 text-primary-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search terms or filters</p>
          <button
            onClick={() => setQuery('')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Search Tips */}
      <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
        <div className="flex items-start space-x-3">
          <Sparkles className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Search Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Use quotes</strong> for exact phrases (e.g., "carbon neutral")</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Combine keywords</strong> to narrow results (e.g., Tesla renewable energy)</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Use filters</strong> to refine by type, date, or score</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Save searches</strong> for quick access later</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
