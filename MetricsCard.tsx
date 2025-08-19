import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

interface MetricsCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  color: 'primary' | 'secondary' | 'destructive'
}

export function MetricsCard({ title, value, change, icon, color }: MetricsCardProps) {
  const isPositive = change >= 0
  
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    destructive: 'text-destructive bg-destructive/10'
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? 'text-secondary' : 'text-destructive'
        }`}>
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : (
            <ArrowDownIcon className="h-4 w-4" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-muted-foreground tracking-wide">
          {title}
        </h3>
        <p className="text-3xl font-semibold text-foreground mt-2 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  )
}