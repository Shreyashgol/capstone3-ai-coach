import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Briefcase,
  ArrowRight,
  BarChart3,
  Target
} from 'lucide-react'

export default function IndustryInsightsPreview() {
  const featuredRoles = [
    { role: 'AI Engineer', growth: '+23%', salary: '$270K', demand: 'Very High', color: 'bg-red-100 text-red-800' },
    { role: 'DevOps Engineer', growth: '+19%', salary: '$225K', demand: 'High', color: 'bg-orange-100 text-orange-800' },
    { role: 'Data Scientist', growth: '+14%', salary: '$240K', demand: 'High', color: 'bg-blue-100 text-blue-800' },
    { role: 'Software Engineer', growth: '+12%', salary: '$215K', demand: 'High', color: 'bg-green-100 text-green-800' }
  ]

  const hotSkills = [
    { skill: 'Generative AI', growth: '+45%' },
    { skill: 'Kubernetes', growth: '+32%' },
    { skill: 'TypeScript', growth: '+28%' },
    { skill: 'GraphQL', growth: '+35%' }
  ]

  return (
    <div className="space-y-8 ">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Live Market Data</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Real-Time Industry Insights
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Get comprehensive data on tech job markets, salary trends, and in-demand skills to accelerate your career growth
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Jobs</p>
                <p className="text-2xl font-bold text-blue-900">45.6K</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+3.2% this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Avg Salary</p>
                <p className="text-2xl font-bold text-green-900">$135K</p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+6.2% YoY</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Remote Jobs</p>
                <p className="text-2xl font-bold text-purple-900">72%</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+25% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Hot Skill</p>
                <p className="text-2xl font-bold text-orange-900">AI/ML</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+45% demand</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Growing Tech Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featuredRoles.map((role, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{role.role}</p>
                    <p className="text-sm text-muted-foreground">Median: {role.salary}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={role.color}>
                      {role.demand}
                    </Badge>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {role.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Hottest Skills Right Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hotSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="font-medium">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${85 + index * 5}%` }}
                      ></div>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {skill.growth}
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  + 20 more trending skills in our full dashboard
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 border-0 shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
          
          <CardContent className="relative p-8 md:p-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Explore Full Industry Insights?
            </h3>
            
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Access comprehensive salary trends, skill analytics, geographic insights, and personalized career recommendations
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="gap-2 bg-white text-indigo-600 hover:bg-gray-50 hover:text-indigo-700 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  View Full Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              
              <div className="flex items-center gap-2 text-blue-100 text-sm">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
                </div>
                <span>Join 10K+ professionals</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-blue-100 text-sm">Job Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1M+</div>
                <div className="text-blue-100 text-sm">Salary Data Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Real-time</div>
                <div className="text-blue-100 text-sm">Market Updates</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}