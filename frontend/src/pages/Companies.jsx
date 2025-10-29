import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Building2, ExternalLink, TrendingUp, AlertCircle, CheckCircle, Leaf } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useState } from 'react'

// Helper function to get company logo URL using Clearbit API
const getCompanyLogo = (website) => {
  if (!website) return null
  // Extract domain from website
  const domain = website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  return `https://logo.clearbit.com/${domain}?size=80`
}

// Mock credibility scores (would come from API in production)
const getCredibilityBadge = (score = 75) => {
  if (score >= 80) {
    return {
      label: 'High Credibility',
      color: 'from-primary-500 to-primary-600',
      icon: CheckCircle,
      textColor: 'text-primary-700',
      bgColor: 'bg-primary-50'
    }
  } else if (score >= 60) {
    return {
      label: 'Medium Credibility',
      color: 'from-accent-500 to-accent-600',
      icon: AlertCircle,
      textColor: 'text-accent-700',
      bgColor: 'bg-accent-50'
    }
  } else {
    return {
      label: 'Needs Review',
      color: 'from-danger-500 to-danger-600',
      icon: AlertCircle,
      textColor: 'text-danger-700',
      bgColor: 'bg-danger-50'
    }
  }
}

export default function Companies() {
  const [imageErrors, setImageErrors] = useState({})

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data } = await axios.get('/api/companies?limit=50')
      return data
    }
  })

  const handleImageError = (companyId) => {
    setImageErrors(prev => ({ ...prev, [companyId]: true }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-hard p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Tracked Companies</h1>
            <p className="text-primary-100">Monitor corporate sustainability claims in real-time</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
            <div className="text-3xl font-bold">{companies?.length || 0}</div>
            <div className="text-sm text-primary-100">Companies</div>
          </div>
        </div>
      </div>

      {/* Filter/Sort Options */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="h-5 w-5 text-primary-600" />
          <span className="text-sm font-medium text-gray-700">Sustainability Leaders</span>
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          <option>All Industries</option>
          <option>Technology</option>
          <option>Automotive</option>
          <option>Retail</option>
          <option>Energy</option>
        </select>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies?.map((company, index) => {
          const badge = getCredibilityBadge(Math.floor(Math.random() * 40) + 60)
          const logoUrl = getCompanyLogo(company.website)
          const hasError = imageErrors[company.company_id]

          return (
            <motion.div
              key={company.company_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/companies/${company.company_id}`}>
                <div className="card group hover:shadow-hard transition-all duration-300 h-full overflow-hidden relative">
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-secondary-50/0 group-hover:from-primary-50/50 group-hover:to-secondary-50/50 transition-all duration-300 pointer-events-none"></div>

                  <div className="relative">
                    {/* Logo and Company Name */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        {logoUrl && !hasError ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 flex items-center justify-center p-2">
                            <img
                              src={logoUrl}
                              alt={`${company.name} logo`}
                              className="w-full h-full object-contain"
                              onError={() => handleImageError(company.company_id)}
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                            <Building2 className="h-8 w-8 text-primary-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                            {company.name}
                          </h3>
                          {company.ticker && (
                            <p className="text-sm text-gray-500 font-medium">{company.ticker}</p>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:scale-110 transition-all" />
                    </div>

                    {/* Credibility Badge */}
                    <div className={`inline-flex items-center space-x-2 ${badge.bgColor} ${badge.textColor} px-3 py-2 rounded-lg text-sm font-medium mb-3`}>
                      <badge.icon className="h-4 w-4" />
                      <span>{badge.label}</span>
                    </div>

                    {/* Industry Badge */}
                    {company.industry && (
                      <div className="badge badge-info mb-3">{company.industry}</div>
                    )}

                    {/* Website */}
                    {company.website && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                        <ExternalLink className="h-4 w-4" />
                        <p className="truncate">{company.website}</p>
                      </div>
                    )}

                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{Math.floor(Math.random() * 20) + 5}</div>
                        <div className="text-xs text-gray-500">Claims</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{Math.floor(Math.random() * 50) + 50}%</div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{Math.floor(Math.random() * 5) + 1}</div>
                        <div className="text-xs text-gray-500">Sources</div>
                      </div>
                    </div>

                    {/* View Details Footer */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700">View Details</span>
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        className="text-primary-600"
                      >
                        →
                      </motion.span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {companies?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Building2 className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-500">Start tracking companies to see them here</p>
        </motion.div>
      )}
    </div>
  )
}
