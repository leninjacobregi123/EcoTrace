import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, AlertCircle, CheckCircle, Loader, TrendingUp,
  Building2, ExternalLink, RefreshCw, Play, Clock, Database,
  Activity, BarChart3
} from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function LiveCrawler() {
  const navigate = useNavigate()
  const [companyName, setCompanyName] = useState('')
  const [companyUrl, setCompanyUrl] = useState('')
  const [taskId, setTaskId] = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Poll for status updates
  useEffect(() => {
    if (!taskId) return

    const pollInterval = setInterval(async () => {
      try {
        const { data } = await axios.get(`/api/crawl/status/${taskId}`)
        setStatus(data)

        // Stop polling if completed or failed
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(pollInterval)
          setLoading(false)

          // If completed, wait 2 seconds then refresh companies page
          if (data.status === 'completed') {
            setTimeout(() => {
              // Option 1: Navigate to companies page
              // navigate('/companies')

              // Option 2: Navigate to search with company name
              navigate(`/search?q=${encodeURIComponent(companyName)}`)
            }, 2000)
          }
        }
      } catch (err) {
        console.error('Error polling status:', err)
        setError('Failed to get crawl status')
        clearInterval(pollInterval)
        setLoading(false)
      }
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(pollInterval)
  }, [taskId, companyName, navigate])

  const handleStartCrawl = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setTaskId(null)
    setStatus(null)

    try {
      const { data } = await axios.post('/api/crawl/start', {
        company_name: companyName,
        company_url: companyUrl
      })

      setTaskId(data.task_id)
    } catch (err) {
      console.error('Error starting crawl:', err)
      setError(err.response?.data?.detail || 'Failed to start crawl')
      setLoading(false)
    }
  }

  const getStatusColor = () => {
    if (!status) return 'text-gray-500'
    switch (status.status) {
      case 'completed': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'running': return 'text-blue-600'
      case 'pending': return 'text-yellow-600'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = () => {
    if (!status) return <Clock className="h-8 w-8 text-gray-500" />
    switch (status.status) {
      case 'completed': return <CheckCircle className="h-8 w-8 text-green-600" />
      case 'failed': return <AlertCircle className="h-8 w-8 text-red-600" />
      case 'running': return <Loader className="h-8 w-8 text-blue-600 animate-spin" />
      case 'pending': return <Clock className="h-8 w-8 text-yellow-600 animate-pulse" />
      default: return <Activity className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-3">
            <Sparkles className="h-10 w-10 text-primary-600" />
            <h1 className="text-4xl font-display font-bold text-gray-900">
              Live Company Analysis
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Analyze any company's sustainability claims in real-time
          </p>
        </motion.div>

        {/* Input Form */}
        {!loading && !status && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
          >
            <form onSubmit={handleStartCrawl} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Tesla, Apple, Amazon"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website or Sustainability Page URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  placeholder="e.g., tesla.com/impact or company.com/sustainability"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
                <p className="mt-2 text-sm text-gray-500">
                  💡 Tip: Use their sustainability or impact page URL for best results
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!companyName || !companyUrl}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg font-semibold shadow-lg"
              >
                <Play className="h-5 w-5" />
                <span>Start Analysis</span>
              </button>
            </form>

            {/* Example Companies */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Popular examples:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Tesla', url: 'tesla.com/impact' },
                  { name: 'Apple', url: 'apple.com/environment' },
                  { name: 'Microsoft', url: 'microsoft.com/sustainability' },
                  { name: 'Google', url: 'sustainability.google' }
                ].map((company) => (
                  <button
                    key={company.name}
                    type="button"
                    onClick={() => {
                      setCompanyName(company.name)
                      setCompanyUrl(company.url)
                    }}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    {company.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Display */}
        <AnimatePresence>
          {(loading || status) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
            >
              {/* Status Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {getStatusIcon()}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {status?.company_name || companyName}
                    </h2>
                    <p className={`text-sm font-medium ${getStatusColor()}`}>
                      {status?.status ? status.status.toUpperCase() : 'INITIALIZING'}
                    </p>
                  </div>
                </div>
                {status?.status === 'completed' && (
                  <CheckCircle className="h-12 w-12 text-green-600" />
                )}
              </div>

              {/* Progress Steps */}
              {status?.progress && (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-primary-600" />
                    <p className="text-gray-700">{status.progress.current_step}</p>
                  </div>

                  {/* Progress Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {status.progress.pages_crawled !== undefined && (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <Database className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-700">Pages Crawled</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">{status.progress.pages_crawled}</p>
                      </div>
                    )}

                    {status.progress.claims_found !== undefined && (
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <BarChart3 className="h-4 w-4 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Claims Found</span>
                        </div>
                        <p className="text-2xl font-bold text-green-900">{status.progress.claims_found}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Results */}
              {status?.results && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Analysis Complete!</span>
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Items Processed:</span>
                      <span className="font-bold text-gray-900">{status.results.items_count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Claims Extracted:</span>
                      <span className="font-bold text-gray-900">{status.results.claims?.length || 0}</span>
                    </div>
                  </div>

                  {status.results.claims && status.results.claims.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Sample Claims:</p>
                      <div className="space-y-2">
                        {status.results.claims.slice(0, 3).map((claim, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3 border border-green-200">
                            <p className="text-sm text-gray-700 line-clamp-2">{claim}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-gray-700 mb-2">
                      ✨ Data has been analyzed and saved to the database!
                    </p>
                    <p className="text-xs text-gray-600">
                      Redirecting you to search results in a moment...
                    </p>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {status?.status === 'failed' && (
                <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                  <h3 className="text-lg font-bold text-red-900 mb-2 flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>Analysis Failed</span>
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    {status.error || 'An error occurred during crawling'}
                  </p>

                  {/* Show suggestions if available */}
                  {status.suggestions && status.suggestions.length > 0 && (
                    <div className="bg-white rounded-lg p-4 mb-4 border border-red-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">💡 Suggestions:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {status.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-sm text-gray-600">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setStatus(null)
                      setTaskId(null)
                      setLoading(false)
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Try Again</span>
                  </button>
                </div>
              )}

              {/* Cancel Button */}
              {status?.status === 'running' && (
                <button
                  onClick={() => {
                    setStatus(null)
                    setTaskId(null)
                    setLoading(false)
                  }}
                  className="w-full mt-4 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Cards */}
        {!loading && !status && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-4 mt-6"
          >
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Real-Time Crawling</h3>
              <p className="text-sm text-gray-600">
                Our AI crawls the company website and extracts sustainability claims instantly
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600">
                NLP algorithms calculate credibility scores and verify claims across multiple sources
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">
                View comprehensive analysis, claims, scores, and sources immediately after crawling
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
