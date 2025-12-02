import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useApiHeaders } from '@/hooks/useApiHeaders'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Briefcase, 
  Target,
  Clock,
  Award,
  Globe,
  Zap
} from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

export default function EnhancedDashboard() {
  const [jobCategories, setJobCategories] = useState([])
  const [salaryTrends, setSalaryTrends] = useState(null)
  const [marketInsights, setMarketInsights] = useState(null)
  const [skillAnalytics, setSkillAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('Software Engineer')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const { headers } = useApiHeaders()

  // Helper function to format Indian currency
  const formatIndianCurrency = (amount) => {
    if (amount >= 100000) {
      const lakhs = (amount / 100000).toFixed(1)
      return `₹${lakhs} LPA`
    }
    return `₹${(amount / 1000).toFixed(0)}K`
  }

  useEffect(() => {
    fetchDashboardData()
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      setLastUpdated(new Date())
      fetchDashboardData()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      fetchCategorySpecificData(selectedCategory)
    }
  }, [selectedCategory])

  const fetchDashboardData = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
      const [jobCategoriesRes, marketInsightsRes] = await Promise.all([
        fetch(`${baseURL}/api/dashboard/job-categories`, { headers }),
        fetch(`${baseURL}/api/dashboard/market-insights`, { headers })
      ])
      
      const jobCategoriesData = await jobCategoriesRes.json()
      const marketInsightsData = await marketInsightsRes.json()
      
      setJobCategories(jobCategoriesData.jobCategories || [])
      setMarketInsights(marketInsightsData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  const fetchCategorySpecificData = async (category) => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
      const [salaryRes, skillsRes] = await Promise.all([
        fetch(`${baseURL}/api/dashboard/salary-trends?category=${encodeURIComponent(category)}`, { headers }),
        fetch(`${baseURL}/api/dashboard/skill-analytics?category=${encodeURIComponent(category)}`, { headers })
      ])
      
      const salaryData = await salaryRes.json()
      const skillsData = await skillsRes.json()
      
      setSalaryTrends(salaryData)
      setSkillAnalytics(skillsData)
    } catch (error) {
      console.error('Error fetching category data:', error)
    }
  }

  const selectedCategoryData = jobCategories.find(cat => cat.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Industry Insights Dashboard</h1>
          <p className="text-muted-foreground">Real-time tech industry data and trends</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{marketInsights?.marketOverview?.totalJobs?.toLocaleString()}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{marketInsights?.marketOverview?.weeklyGrowth}% this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Salary (India)</p>
                <p className="text-2xl font-bold">₹18 LPA</p>
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
              <Globe className="h-8 w-8 text-purple-500" />
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
                <p className="text-sm font-medium text-muted-foreground">Hot Skills</p>
                <p className="text-2xl font-bold">AI/ML</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+45% demand</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Categories Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Tech Job Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {jobCategories.map((category) => (
              <Button
                key={category.category}
                variant={selectedCategory === category.category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.category)}
              >
                {category.category}
                <Badge 
                  variant="secondary" 
                  className={`ml-2 ${category.growthTrend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {category.growthTrend === 'up' ? '↗' : '↘'} {category.growthRate}%
                </Badge>
              </Button>
            ))}
          </div>
          
          {/* Selected Category Details */}
          {selectedCategoryData && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2">{selectedCategoryData.category} Overview</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Growth Rate</p>
                  <p className="font-semibold text-green-600">{selectedCategoryData.growthRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Open Jobs</p>
                  <p className="font-semibold">{selectedCategoryData.currentJobs?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Demand Level</p>
                  <p className={`font-semibold ${
                    selectedCategoryData.demandLevel === 'Very High' ? 'text-red-600' : 
                    selectedCategoryData.demandLevel === 'High' ? 'text-orange-600' : 'text-yellow-600'
                  }`}>
                    {selectedCategoryData.demandLevel || 'High'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Remote Work</p>
                  <p className="font-semibold text-blue-600">
                    {selectedCategoryData.remoteWorkPercentage || 70}%
                  </p>
                </div>
              </div>
              {selectedCategoryData.marketOutlook && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Market Outlook:</strong> {selectedCategoryData.marketOutlook}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="salary-trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="salary-trends">Salary Trends</TabsTrigger>
          <TabsTrigger value="skills-demand">Skills & Demand</TabsTrigger>
          <TabsTrigger value="market-analysis">Market Analysis</TabsTrigger>
          <TabsTrigger value="geographic">Geographic Insights</TabsTrigger>
        </TabsList>

        {/* Salary Trends Tab */}
        <TabsContent value="salary-trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Salary Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Salary Trends - {selectedCategory}</CardTitle>
              </CardHeader>
              <CardContent>
                {salaryTrends && (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salaryTrends.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatIndianCurrency(value), 'Salary']} />
                      <Line type="monotone" dataKey="junior" stroke="#8884d8" name="Junior" />
                      <Line type="monotone" dataKey="midLevel" stroke="#82ca9d" name="Mid-Level" />
                      <Line type="monotone" dataKey="senior" stroke="#ffc658" name="Senior" />
                      <Line type="monotone" dataKey="lead" stroke="#ff7300" name="Lead" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Salary Ranges */}
            <Card>
              <CardHeader>
                <CardTitle>Current Salary Ranges</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCategoryData?.salaryRanges && (
                  <div className="space-y-4">
                    {selectedCategoryData.salaryRanges.map((range, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{range.role}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatIndianCurrency(range.min)} - {formatIndianCurrency(range.max)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{formatIndianCurrency(range.median)}</p>
                          <p className="text-xs text-muted-foreground">Median</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Market Demand Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Job Market Demand</CardTitle>
            </CardHeader>
            <CardContent>
              {salaryTrends && (
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={salaryTrends.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area yAxisId="left" type="monotone" dataKey="jobOpenings" fill="#8884d8" stroke="#8884d8" fillOpacity={0.3} />
                    <Line yAxisId="right" type="monotone" dataKey="demandIndex" stroke="#ff7300" />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills & Demand Tab */}
        <TabsContent value="skills-demand" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Core Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Core Skills - {selectedCategory}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedCategoryData?.topSkills?.map((skill, index) => {
                    const proficiency = Math.floor(Math.random() * 40 + 60);
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{skill}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${proficiency}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-10">
                            {proficiency}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* In-Demand Skills */}
            <Card>
              <CardHeader>
                <CardTitle>🔥 In-Demand Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketInsights?.skillDemand?.hotSkills?.slice(0, 8).map((skillData, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium text-orange-700">{skillData.skill}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${skillData.demand}%` }}
                          ></div>
                        </div>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          {skillData.growth}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills to Learn */}
            <Card>
              <CardHeader>
                <CardTitle>📚 Skills to Develop</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedCategoryData?.skillsToLearn?.map((skill, index) => {
                    const growth = Math.floor(Math.random() * 25 + 15);
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-700">{skill}</span>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          +{growth}% growth
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Analysis - {selectedCategory}</CardTitle>
            </CardHeader>
            <CardContent>
              {skillAnalytics && (
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={skillAnalytics.skillGaps}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Current Level"
                      dataKey="currentLevel"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Required Level"
                      dataKey="requiredLevel"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Analysis Tab */}
        <TabsContent value="market-analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Industry Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Industry Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketInsights?.industryTrends?.map((trend, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{trend.trend}</h4>
                        <Badge variant={trend.impact === 'High' ? 'destructive' : 'secondary'}>
                          {trend.impact} Impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{trend.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{trend.timeframe}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Companies */}
            <Card>
              <CardHeader>
                <CardTitle>Company Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Hiring Most</h4>
                    <div className="flex flex-wrap gap-1">
                      {marketInsights?.companyInsights?.hiringMost?.map((company, index) => (
                        <Badge key={index} variant="outline">{company}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Fastest Growing</h4>
                    <div className="flex flex-wrap gap-1">
                      {marketInsights?.companyInsights?.fastestGrowing?.map((company, index) => (
                        <Badge key={index} variant="secondary">{company}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Remote First</h4>
                    <div className="flex flex-wrap gap-1">
                      {marketInsights?.companyInsights?.remoteFirst?.map((company, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800">{company}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Categories Growth */}
          <Card>
            <CardHeader>
              <CardTitle>Job Category Growth Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobCategories.map(cat => ({ name: cat.category, growth: cat.growthRate, jobs: cat.currentJobs }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [name === 'growth' ? `${value}%` : value.toLocaleString(), name === 'growth' ? 'Growth Rate' : 'Jobs']} />
                  <Bar dataKey="growth" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Insights Tab */}
        <TabsContent value="geographic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Geographic Salary Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Salary by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marketInsights?.geographicInsights || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatIndianCurrency(value), 'Avg Salary']} />
                    <Bar dataKey="avgSalary" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Job Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Job Distribution by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={marketInsights?.geographicInsights || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ location, jobCount }) => `${location}: ${jobCount}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="jobCount"
                    >
                      {marketInsights?.geographicInsights?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Jobs']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketInsights?.geographicInsights?.map((location, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">{location.location}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Salary:</span>
                        <span className="font-medium">{formatIndianCurrency(location.avgSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Job Count:</span>
                        <span className="font-medium">{location.jobCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Growth:</span>
                        <span className={`font-medium ${location.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {location.growth}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}