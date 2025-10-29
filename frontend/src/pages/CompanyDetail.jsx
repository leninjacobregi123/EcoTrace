import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { Building2, ArrowLeft, FileText, Newspaper, TrendingUp, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function CompanyDetail() {
  const { id } = useParams()

  const { data: company } = useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/companies/${id}`)
      return data
    }
  })

  const { data: claims } = useQuery({
    queryKey: ['company-claims', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/companies/${id}/claims`)
      return data
    }
  })

  const { data: score } = useQuery({
    queryKey: ['company-score', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/companies/${id}/score`)
      return data
    }
  })

  if (!company) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const scoreBreakdownData = Object.entries(score?.score_breakdown || {}).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    score: value
  }))

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/companies" className="btn btn-secondary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
      </div>

      {/* Company Overview */}
      <div className="card bg-gradient-to-br from-primary-50 to-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">{company.name}</h1>
              {company.industry && (
                <p className="text-gray-600 mt-1">{company.industry}</p>
              )}
              {company.website && (
                <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-primary-600 hover:text-primary-700 mt-1 inline-block">
                  {company.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Credibility Score */}
      {score && (
        <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Credibility Score</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-primary-100 text-sm">Total Claims</p>
                  <p className="text-2xl font-bold">{score.total_claims}</p>
                </div>
                <div>
                  <p className="text-primary-100 text-sm">Verified</p>
                  <p className="text-2xl font-bold">{score.verified_claims}</p>
                </div>
                <div>
                  <p className="text-primary-100 text-sm">Contradicted</p>
                  <p className="text-2xl font-bold">{score.contradicted_claims}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold">{score.overall_score.toFixed(0)}%</div>
              <p className="text-primary-100 mt-2">Overall Score</p>
            </div>
          </div>
        </div>
      )}

      {/* Score Breakdown Chart */}
      {scoreBreakdownData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score by Claim Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Claims List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary-600" />
          Sustainability Claims ({claims?.total_claims || 0})
        </h3>
        <div className="space-y-3">
          {claims?.claims?.slice(0, 10).map((claim, index) => (
            <motion.div
              key={claim.claim_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{claim.claim_text}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    {claim.claim_type && (
                      <span className="badge badge-info">{claim.claim_type}</span>
                    )}
                    {claim.target_year && (
                      <span className="text-sm text-gray-500">Target: {claim.target_year}</span>
                    )}
                  </div>
                </div>
                {claim.confidence_score && (
                  <div className="ml-4">
                    <div className={`text-sm font-semibold ${
                      claim.confidence_score > 0.7 ? 'text-green-600' :
                      claim.confidence_score > 0.4 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {(claim.confidence_score * 100).toFixed(0)}%
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
