import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

// Platform-specific data for each metric
const chartData = {
  followers: {
    instagram: [
      { name: 'Week 1', value: 25200 },
      { name: 'Week 2', value: 26100 },
      { name: 'Week 3', value: 27300 },
      { name: 'Week 4', value: 28200 }
    ],
    facebook: [
      { name: 'Week 1', value: 15000 },
      { name: 'Week 2', value: 15200 },
      { name: 'Week 3', value: 15800 },
      { name: 'Week 4', value: 16000 }
    ],
    pinterest: [
      { name: 'Week 1', value: 5000 },
      { name: 'Week 2', value: 4800 },
      { name: 'Week 3', value: 4200 },
      { name: 'Week 4', value: 4000 }
    ]
  },
  engagement: {
    instagram: [
      { name: 'Week 1', value: 7800 },
      { name: 'Week 2', value: 8200 },
      { name: 'Week 3', value: 8600 },
      { name: 'Week 4', value: 8400 }
    ],
    facebook: [
      { name: 'Week 1', value: 2800 },
      { name: 'Week 2', value: 2900 },
      { name: 'Week 3', value: 3100 },
      { name: 'Week 4', value: 3200 }
    ],
    pinterest: [
      { name: 'Week 1', value: 1200 },
      { name: 'Week 2', value: 1300 },
      { name: 'Week 3', value: 1900 },
      { name: 'Week 4', value: 800 }
    ]
  },
  reach: {
    instagram: [
      { name: 'Week 1', value: 95000 },
      { name: 'Week 2', value: 92000 },
      { name: 'Week 3', value: 98000 },
      { name: 'Week 4', value: 102000 }
    ],
    facebook: [
      { name: 'Week 1', value: 45000 },
      { name: 'Week 2', value: 44000 },
      { name: 'Week 3', value: 46000 },
      { name: 'Week 4', value: 48000 }
    ],
    pinterest: [
      { name: 'Week 1', value: 12000 },
      { name: 'Week 2', value: 12000 },
      { name: 'Week 3', value: 12000 },
      { name: 'Week 4', value: 8000 }
    ]
  },
  linkClicks: {
    instagram: [
      { name: 'Week 1', value: 200 },
      { name: 'Week 2', value: 240 },
      { name: 'Week 3', value: 280 },
      { name: 'Week 4', value: 260 }
    ],
    facebook: [
      { name: 'Week 1', value: 100 },
      { name: 'Week 2', value: 110 },
      { name: 'Week 3', value: 120 },
      { name: 'Week 4', value: 115 }
    ],
    pinterest: [
      { name: 'Week 1', value: 40 },
      { name: 'Week 2', value: 30 },
      { name: 'Week 3', value: 20 },
      { name: 'Week 4', value: 15 }
    ]
  }
}

const chartOptions = {
  followers: { label: 'Followers', color: '#816f41' },
  engagement: { label: 'Engagement', color: '#7a5353' },
  reach: { label: 'Reach', color: '#d4c7bc' },
  linkClicks: { label: 'Link Clicks', color: '#a67c52' }
}

const platformColors = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  pinterest: '#BD081C'
}

interface EngagementChartProps {
  selectedMetric?: keyof typeof chartOptions
  onMetricChange?: (metric: keyof typeof chartOptions) => void
  selectedPlatforms?: string[]
}

export function EngagementChart({ 
  selectedMetric = 'engagement', 
  onMetricChange,
  selectedPlatforms = ['instagram', 'facebook', 'pinterest']
}: EngagementChartProps) {
  const [metric, setMetric] = useState<keyof typeof chartOptions>(selectedMetric)
  
  const handleMetricChange = (newMetric: keyof typeof chartOptions) => {
    setMetric(newMetric)
    onMetricChange?.(newMetric)
  }

  // Combine data from selected platforms
  const getCombinedData = () => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    return weeks.map(week => {
      const weekData: any = { name: week }
      
      selectedPlatforms.forEach(platform => {
        const platformData = chartData[metric][platform as keyof typeof chartData[typeof metric]]
        const weekValue = platformData?.find(item => item.name === week)?.value || 0
        weekData[platform] = weekValue
      })
      
      return weekData
    })
  }

  const combinedData = getCombinedData()
  const currentChart = chartOptions[metric]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-foreground">Analytics Overview</h3>
        <Select value={metric} onValueChange={handleMetricChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="followers">Followers Growth</SelectItem>
            <SelectItem value="engagement">Engagement Rate</SelectItem>
            <SelectItem value="reach">Total Reach</SelectItem>
            <SelectItem value="linkClicks">Link Clicks</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {selectedPlatforms.length > 0 && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Showing:</span>
          {selectedPlatforms.map(platform => (
            <div key={platform} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: platformColors[platform as keyof typeof platformColors] }}
              />
              <span className="text-foreground capitalize">{platform}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(129, 111, 65, 0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#816f41"
              fontSize={12}
              fontWeight={500}
            />
            <YAxis 
              stroke="#816f41"
              fontSize={12}
              fontWeight={500}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`
                }
                return value.toString()
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid rgba(129, 111, 65, 0.2)',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
              labelStyle={{ color: '#2d2d2d', fontWeight: 600 }}
              formatter={(value: number, name: string) => [
                value.toLocaleString(), 
                name.charAt(0).toUpperCase() + name.slice(1)
              ]}
            />
            {selectedPlatforms.map(platform => (
              <Line
                key={platform}
                type="monotone"
                dataKey={platform}
                stroke={platformColors[platform as keyof typeof platformColors]}
                strokeWidth={3}
                dot={{ fill: platformColors[platform as keyof typeof platformColors], strokeWidth: 0, r: 5 }}
                activeDot={{ r: 7, stroke: platformColors[platform as keyof typeof platformColors], strokeWidth: 2, fill: '#ffffff' }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}