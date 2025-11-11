import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
} from 'recharts'

export default function Dashboard() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const { headers } = useApiHeaders()

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const [statsRes, insightsRes] = await Promise.all([
          fetch('/api/dashboard/stats', { headers }),
          fetch('/api/dashboard/insights', { headers })
        ])
        const stats = await statsRes.json()
        const insights = await insightsRes.json()
        setInsights({ ...stats, ...insights })
      } catch (error) {
        console.error('Failed to fetch insights:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchInsights()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>
  }

  const salaryData = insights?.salaryRanges?.slice(0, 5) || []
  const skills = insights?.topSkills?.slice(0, 6) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-6xl font-bold gradient-title">
          Industry Insights
        </h1>
        <div className="flex gap-2">
          <Link to="/resume">
            <Button variant="outline">Resume</Button>
          </Link>
          <Link to="/cover-letters">
            <Button variant="outline">Cover Letters</Button>
          </Link>
          <Link to="/interview">
            <Button variant="outline">Interview</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary">{insights?.demandLevel || 'High'}</h3>
              <p className="text-muted-foreground">Market Demand</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary">{insights?.growthRate || 15}%</h3>
              <p className="text-muted-foreground">Industry Growth</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary">{insights?.marketOutlook || 'Positive'}</h3>
              <p className="text-muted-foreground">Market Outlook</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Trends */}
      {salaryData.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Salary Trends by Role</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="median" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Skills */}
      {skills.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Top In-Demand Skills</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map((skill, index) => (
                <div key={index} className="bg-primary/10 rounded-lg p-3 text-center">
                  <p className="font-medium">{skill}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Trends */}
      {insights?.keyTrends && insights.keyTrends.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Key Industry Trends</h3>
            <div className="space-y-3">
              {insights.keyTrends.map((trend, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p>{trend}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Skills */}
      {insights?.recommendedSkills && insights.recommendedSkills.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Skills to Develop</h3>
            <div className="space-y-3">
              {insights.recommendedSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                  <p className="font-medium">{skill}</p>
                  <Button size="sm" variant="outline">
                    Learn More
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

