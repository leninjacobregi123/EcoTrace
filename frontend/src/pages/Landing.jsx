import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield, TrendingUp, Search, Database,
  CheckCircle, AlertTriangle, Globe, Leaf,
  BarChart3, Network, FileSearch, ArrowRight
} from 'lucide-react'

export default function Landing() {
  const features = [
    {
      icon: Search,
      title: 'Multi-Source Crawling',
      description: 'Automatically collect sustainability claims from corporate reports, regulatory filings, and news sources',
      color: 'from-primary-400 to-primary-600'
    },
    {
      icon: Shield,
      title: 'Claim Verification',
      description: 'AI-powered verification cross-references claims with independent data sources and scientific publications',
      color: 'from-secondary-400 to-secondary-600'
    },
    {
      icon: Network,
      title: 'Knowledge Graph',
      description: 'Visualize relationships between companies, claims, and evidence in an interactive graph',
      color: 'from-accent-400 to-accent-600'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track trends, sentiment, and credibility scores across thousands of environmental claims',
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      icon: AlertTriangle,
      title: 'Greenwashing Detection',
      description: 'Identify inconsistencies and potential greenwashing using machine learning algorithms',
      color: 'from-danger-400 to-danger-600'
    },
    {
      icon: FileSearch,
      title: 'Full-Text Search',
      description: 'Search across millions of documents with Elasticsearch-powered semantic search',
      color: 'from-purple-400 to-purple-600'
    }
  ]

  const stats = [
    { value: '7+', label: 'Companies Tracked' },
    { value: '8+', label: 'Claims Analyzed' },
    { value: '4', label: 'Data Sources' },
    { value: '75%', label: 'Avg Credibility' }
  ]

  const useCases = [
    {
      title: 'Investors',
      description: 'Verify ESG claims before making investment decisions',
      icon: TrendingUp
    },
    {
      title: 'Journalists',
      description: 'Investigate corporate greenwashing with data-backed evidence',
      icon: FileSearch
    },
    {
      title: 'Activists',
      description: 'Hold companies accountable with verified sustainability data',
      icon: Globe
    },
    {
      title: 'Regulators',
      description: 'Monitor corporate environmental compliance at scale',
      icon: Shield
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Leaf className="h-4 w-4" />
                <span>AI-Powered Sustainability Verification</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6 leading-tight">
                Detect Corporate
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                  Greenwashing
                </span>
                with Data
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                EcoTrace automatically collects, verifies, and analyzes corporate sustainability claims across multiple sources.
                Empower your decisions with transparent, data-driven insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <span>Explore Dashboard</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>

                <Link to="/companies">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold border-2 border-primary-200 hover:border-primary-400 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>View Companies</span>
                  </motion.button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mt-12 pt-12 border-t border-gray-200">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Illustration/Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Glassmorphism Card */}
                <div className="bg-gradient-to-br from-primary-500/10 to-secondary-500/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20">
                  <div className="space-y-4">
                    {/* Mock Dashboard Element */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Claim Verified</div>
                            <div className="text-sm text-gray-600">Amazon - Renewable Energy</div>
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '85%' }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                        ></motion.div>
                      </div>
                      <div className="text-right text-sm text-gray-600 mt-2">85% Credibility</div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-danger-400 to-danger-600 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Potential Greenwashing</div>
                            <div className="text-sm text-gray-600">Discrepancy Detected</div>
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '35%' }}
                          transition={{ duration: 1.5, delay: 0.7 }}
                          className="h-full bg-gradient-to-r from-danger-500 to-danger-600"
                        ></motion.div>
                      </div>
                      <div className="text-right text-sm text-gray-600 mt-2">35% Credibility</div>
                    </div>

                    {/* Network Icon */}
                    <div className="flex items-center justify-center py-8">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Database className="h-24 w-24 text-primary-600/20" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full opacity-20 blur-xl"
              ></motion.div>

              <motion.div
                animate={{
                  y: [0, 15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full opacity-20 blur-2xl"
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Powerful Features for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600"> Transparency</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge technology to verify environmental claims and combat greenwashing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="card h-full hover:shadow-hard transition-all duration-300 border-2 border-transparent hover:border-primary-200">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Built for Decision Makers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by investors, journalists, activists, and regulators worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-hard transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                  <useCase.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-gray-600 text-sm">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold mb-6">
              Start Verifying Sustainability Claims Today
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join the movement for transparent and accountable corporate environmental reporting
            </p>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white text-primary-700 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center space-x-2 group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
