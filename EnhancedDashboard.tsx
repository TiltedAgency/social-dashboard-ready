import { useState, useEffect } from 'react'
import { MetricsCard } from './MetricsCard'
import { EngagementChart } from './EngagementChart'
import { PostPerformance } from './PostPerformance'
import { PostEditor } from './PostEditor'
import { MonthSelector } from './MonthSelector'
import { SocialMediaSelector } from './SocialMediaSelector'
import { Button } from './ui/button'
import { useAuth } from './AuthContext'
import { Users, Heart, Eye, Share, Settings, LogOut, Edit, ExternalLink, Calculator } from 'lucide-react'
import { projectId } from '../utils/supabase/info'

interface DashboardData {
  totalFollowers: string
  followersChange: number
  totalEngagement: string
  engagementChange: number
  totalReach: string
  reachChange: number
  totalShares: string
  sharesChange: number
  totalLinkClicks: string
  linkClicksChange: number
  bestPosts: any[]
  worstPosts: any[]
}

// Sample data for demonstration
const sampleData: DashboardData = {
  totalFollowers: '48.2K',
  followersChange: 8.2,
  totalEngagement: '12.4K',
  engagementChange: 15.3,
  totalReach: '156K',
  reachChange: -2.4,
  totalShares: '2.1K',
  sharesChange: 23.1,
  totalLinkClicks: '1.8K',
  linkClicksChange: 12.7,
  bestPosts: [
    {
      id: 1,
      content: 'Behind the scenes of our latest photoshoot! 📸✨',
      platform: 'Instagram',
      engagement: 1250,
      likes: 890,
      comments: 67,
      shares: 23,
      linkClicks: 45,
      date: '2025-01-15'
    },
    {
      id: 2,
      content: 'New collection launch - limited edition pieces now available',
      platform: 'Facebook',
      engagement: 980,
      likes: 654,
      comments: 89,
      shares: 45,
      linkClicks: 78,
      date: '2025-01-12'
    }
  ],
  worstPosts: [
    {
      id: 4,
      content: 'Weekly newsletter signup reminder',
      platform: 'Facebook',
      engagement: 45,
      likes: 23,
      comments: 2,
      shares: 1,
      linkClicks: 3,
      date: '2025-01-08'
    }
  ]
}

// Function to get previous month
function getPreviousMonth(monthString: string): string {
  const [year, month] = monthString.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  date.setMonth(date.getMonth() - 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

// Function to parse numeric values from strings like "48.2K"
function parseMetricValue(value: string): number {
  const numStr = value.replace(/[^\d.]/g, '')
  const num = parseFloat(numStr)
  if (value.toLowerCase().includes('k')) return num * 1000
  if (value.toLowerCase().includes('m')) return num * 1000000
  return num
}

// Function to calculate percentage change
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function EnhancedDashboard() {
  const [selectedMonth, setSelectedMonth] = useState('2025-01')
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'facebook', 'pinterest'])
  const [dashboardData, setDashboardData] = useState<DashboardData>(sampleData)
  const [previousMonthData, setPreviousMonthData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [chartMetric, setChartMetric] = useState<'followers' | 'engagement' | 'reach' | 'linkClicks'>('engagement')
  const [calculatingChanges, setCalculatingChanges] = useState(false)
  const { user, logout, accessToken } = useAuth()

  // Filter posts based on selected platforms
  const filteredBestPosts = dashboardData.bestPosts.filter(post => 
    selectedPlatforms.includes(post.platform.toLowerCase())
  )
  const filteredWorstPosts = dashboardData.worstPosts.filter(post => 
    selectedPlatforms.includes(post.platform.toLowerCase())
  )

  useEffect(() => {
    if (user && accessToken) {
      loadDashboardData()
      loadPreviousMonthData()
    }
  }, [selectedMonth, user, accessToken])

  async function loadDashboardData() {
    if (!user || !accessToken) return
    
    setLoading(true)
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1b7356ff/dashboard/${user.id}/${selectedMonth}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      } else {
        console.log('Failed to load dashboard data:', await response.text())
        // Keep sample data for demo
        setDashboardData(sampleData)
      }
    } catch (error) {
      console.log('Dashboard data load error:', error)
      // Keep sample data for demo
      setDashboardData(sampleData)
    }
    setLoading(false)
  }

  async function loadPreviousMonthData() {
    if (!user || !accessToken) return
    
    const previousMonth = getPreviousMonth(selectedMonth)
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1b7356ff/dashboard/${user.id}/${previousMonth}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPreviousMonthData(data)
      } else {
        console.log('No previous month data found')
        setPreviousMonthData(null)
      }
    } catch (error) {
      console.log('Previous month data load error:', error)
      setPreviousMonthData(null)
    }
  }

  async function calculateAutoChanges() {
    if (!previousMonthData) {
      alert('No previous month data available for comparison')
      return
    }

    setCalculatingChanges(true)

    // Calculate percentage changes automatically
    const currentFollowers = parseMetricValue(dashboardData.totalFollowers)
    const previousFollowers = parseMetricValue(previousMonthData.totalFollowers)
    const followersChange = calculatePercentageChange(currentFollowers, previousFollowers)

    const currentEngagement = parseMetricValue(dashboardData.totalEngagement)
    const previousEngagement = parseMetricValue(previousMonthData.totalEngagement)
    const engagementChange = calculatePercentageChange(currentEngagement, previousEngagement)

    const currentReach = parseMetricValue(dashboardData.totalReach)
    const previousReach = parseMetricValue(previousMonthData.totalReach)
    const reachChange = calculatePercentageChange(currentReach, previousReach)

    const currentShares = parseMetricValue(dashboardData.totalShares)
    const previousShares = parseMetricValue(previousMonthData.totalShares)
    const sharesChange = calculatePercentageChange(currentShares, previousShares)

    const currentLinkClicks = parseMetricValue(dashboardData.totalLinkClicks)
    const previousLinkClicks = parseMetricValue(previousMonthData.totalLinkClicks)
    const linkClicksChange = calculatePercentageChange(currentLinkClicks, previousLinkClicks)

    const updatedData = {
      ...dashboardData,
      followersChange: Math.round(followersChange * 10) / 10,
      engagementChange: Math.round(engagementChange * 10) / 10,
      reachChange: Math.round(reachChange * 10) / 10,
      sharesChange: Math.round(sharesChange * 10) / 10,
      linkClicksChange: Math.round(linkClicksChange * 10) / 10
    }

    setDashboardData(updatedData)
    setCalculatingChanges(false)
    
    // Optionally auto-save the calculated changes
    await saveDashboardData(updatedData)
  }

  async function saveDashboardData(data: DashboardData) {
    if (!user || !accessToken) return false
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1b7356ff/dashboard/${user.id}/${selectedMonth}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        setDashboardData(data)
        return true
      } else {
        console.log('Failed to save dashboard data:', await response.text())
        return false
      }
    } catch (error) {
      console.log('Dashboard data save error:', error)
      return false
    }
  }

  const handlePostsChange = (bestPosts: any[], worstPosts: any[]) => {
    const updatedData = {
      ...dashboardData,
      bestPosts,
      worstPosts
    }
    setDashboardData(updatedData)
    // Auto-save when posts change
    saveDashboardData(updatedData)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              Social Media Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 text-base">
              Welcome back, here's your monthly overview
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">Filter by Platform</p>
              <SocialMediaSelector 
                selectedPlatforms={selectedPlatforms}
                onPlatformsChange={setSelectedPlatforms}
              />
              {selectedPlatforms.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Showing data for: {selectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowEditor(!showEditor)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                {showEditor ? 'View Dashboard' : 'Edit Data'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {showEditor && (
          <DataEditor 
            data={dashboardData} 
            onSave={saveDashboardData}
            onPostsChange={handlePostsChange}
            month={selectedMonth}
            onCalculateChanges={calculateAutoChanges}
            calculatingChanges={calculatingChanges}
            hasPreviousData={!!previousMonthData}
          />
        )}

        {!showEditor && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <MetricsCard
                title="Total Followers"
                value={dashboardData.totalFollowers}
                change={dashboardData.followersChange}
                icon={<Users className="h-5 w-5" />}
                color="primary"
              />
              <MetricsCard
                title="Total Engagement"
                value={dashboardData.totalEngagement}
                change={dashboardData.engagementChange}
                icon={<Heart className="h-5 w-5" />}
                color="secondary"
              />
              <MetricsCard
                title="Total Reach"
                value={dashboardData.totalReach}
                change={dashboardData.reachChange}
                icon={<Eye className="h-5 w-5" />}
                color={dashboardData.reachChange >= 0 ? "secondary" : "destructive"}
              />
              <MetricsCard
                title="Total Shares"
                value={dashboardData.totalShares}
                change={dashboardData.sharesChange}
                icon={<Share className="h-5 w-5" />}
                color="primary"
              />
              <MetricsCard
                title="Link Clicks"
                value={dashboardData.totalLinkClicks}
                change={dashboardData.linkClicksChange}
                icon={<ExternalLink className="h-5 w-5" />}
                color="primary"
              />
            </div>

            {/* Analytics Chart */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <EngagementChart 
                selectedMetric={chartMetric}
                onMetricChange={setChartMetric}
                selectedPlatforms={selectedPlatforms}
              />
            </div>

            {/* Post Performance */}
            {(filteredBestPosts.length > 0 || filteredWorstPosts.length > 0) && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {filteredBestPosts.length > 0 && (
                  <PostPerformance
                    title="Best Performing Posts"
                    posts={filteredBestPosts}
                    type="best"
                  />
                )}
                {filteredWorstPosts.length > 0 && (
                  <PostPerformance
                    title="Posts Needing Attention"
                    posts={filteredWorstPosts}
                    type="worst"
                  />
                )}
              </div>
            )}
            
            {filteredBestPosts.length === 0 && filteredWorstPosts.length === 0 && selectedPlatforms.length > 0 && (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground text-lg">
                  No post data available for the selected platforms this month.
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Click "Edit Data" to add your social media metrics or try selecting different platforms above.
                </p>
              </div>
            )}
            
            {selectedPlatforms.length === 0 && (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground text-lg">
                  Please select at least one platform to view your data.
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Use the platform selector above to choose which social media platforms to display.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Enhanced data editor component
function DataEditor({ 
  data, 
  onSave, 
  onPostsChange,
  month, 
  onCalculateChanges, 
  calculatingChanges, 
  hasPreviousData 
}: { 
  data: DashboardData
  onSave: (data: DashboardData) => Promise<boolean>
  onPostsChange: (bestPosts: any[], worstPosts: any[]) => void
  month: string
  onCalculateChanges: () => void
  calculatingChanges: boolean
  hasPreviousData: boolean
}) {
  const [editData, setEditData] = useState(data)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<'metrics' | 'posts'>('metrics')

  // Update editData when data changes
  useEffect(() => {
    setEditData(data)
  }, [data])

  async function handleSave() {
    setSaving(true)
    const success = await onSave(editData)
    if (success) {
      alert('Data saved successfully!')
    } else {
      alert('Failed to save data. Please try again.')
    }
    setSaving(false)
  }

  return (
    <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Edit Data for {month}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant={activeSection === 'metrics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('metrics')}
          >
            Metrics & Numbers
          </Button>
          <Button
            variant={activeSection === 'posts' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('posts')}
          >
            Posts & Content
          </Button>
        </div>
      </div>

      {activeSection === 'metrics' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Total Followers</label>
              <input
                type="text"
                value={editData.totalFollowers}
                onChange={(e) => setEditData({ ...editData, totalFollowers: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="e.g. 48.2K"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Followers Change %</label>
              <input
                type="number"
                step="0.1"
                value={editData.followersChange}
                onChange={(e) => setEditData({ ...editData, followersChange: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="Auto-calculated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Total Engagement</label>
              <input
                type="text"
                value={editData.totalEngagement}
                onChange={(e) => setEditData({ ...editData, totalEngagement: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="e.g. 12.4K"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Engagement Change %</label>
              <input
                type="number"
                step="0.1"
                value={editData.engagementChange}
                onChange={(e) => setEditData({ ...editData, engagementChange: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="Auto-calculated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Link Clicks</label>
              <input
                type="text"
                value={editData.totalLinkClicks}
                onChange={(e) => setEditData({ ...editData, totalLinkClicks: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="e.g. 1.8K"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Total Reach</label>
              <input
                type="text"
                value={editData.totalReach}
                onChange={(e) => setEditData({ ...editData, totalReach: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="e.g. 156K"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Reach Change %</label>
              <input
                type="number"
                step="0.1"
                value={editData.reachChange}
                onChange={(e) => setEditData({ ...editData, reachChange: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="Auto-calculated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Link Clicks Change %</label>
              <input
                type="number"
                step="0.1"
                value={editData.linkClicksChange}
                onChange={(e) => setEditData({ ...editData, linkClicksChange: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="Auto-calculated"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Total Shares</label>
              <input
                type="text"
                value={editData.totalShares}
                onChange={(e) => setEditData({ ...editData, totalShares: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="e.g. 2.1K"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Shares Change %</label>
              <input
                type="number"
                step="0.1"
                value={editData.sharesChange}
                onChange={(e) => setEditData({ ...editData, sharesChange: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="Auto-calculated"
              />
            </div>
          </div>

          {hasPreviousData && (
            <div className="mb-8 p-4 bg-accent/50 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Auto-Calculate Changes</h4>
                  <p className="text-sm text-muted-foreground">
                    Calculate percentage changes based on previous month's data
                  </p>
                </div>
                <Button
                  onClick={onCalculateChanges}
                  disabled={calculatingChanges}
                  className="flex items-center gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  {calculatingChanges ? 'Calculating...' : 'Calculate Changes'}
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {activeSection === 'posts' && (
        <PostEditor
          bestPosts={editData.bestPosts}
          worstPosts={editData.worstPosts}
          onPostsChange={(bestPosts, worstPosts) => {
            const updatedData = { ...editData, bestPosts, worstPosts }
            setEditData(updatedData)
            onPostsChange(bestPosts, worstPosts)
          }}
        />
      )}

      {activeSection === 'metrics' && (
        <div className="flex justify-end gap-4 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => setEditData(data)}>
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  )
}