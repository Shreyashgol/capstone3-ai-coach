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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Real-Time Industry Insights</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get comprehensive data on tech job markets, salary trends, and in-demand skills to accelerate your career growth
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">45.6K</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+3.2% this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Salary</p>
                <p className="text-2xl font-bold">$135K</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+6.2% YoY</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Remote Jobs</p>
                <p className="text-2xl font-bold">72%</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+25% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hot Skill</p>
                <p className="text-2xl font-bold">AI/ML</p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+45% demand</span>
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
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Explore Full Industry Insights?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Access comprehensive salary trends, skill analytics, geographic insights, and personalized career recommendations
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                View Full Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}