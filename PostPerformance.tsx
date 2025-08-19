import { Heart, MessageCircle, Share, Calendar, Instagram, Facebook, Zap, ExternalLink } from 'lucide-react'

interface Post {
  id: number
  content: string
  platform: string
  engagement: number
  likes: number
  comments: number
  shares: number
  linkClicks?: number
  date: string
}

interface PostPerformanceProps {
  title: string
  posts: Post[]
  type: 'best' | 'worst'
}

const platformIcons = {
  Instagram: Instagram,
  Facebook: Facebook,
  Pinterest: Zap
}

const platformColors = {
  Instagram: '#E4405F',
  Facebook: '#1877F2',
  Pinterest: '#BD081C'
}

export function PostPerformance({ title, posts, type }: PostPerformanceProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-6 text-foreground">{title}</h3>
      
      <div className="space-y-4">
        {posts.map((post) => {
          const PlatformIcon = platformIcons[post.platform as keyof typeof platformIcons] || Zap
          const platformColor = platformColors[post.platform as keyof typeof platformColors] || '#816f41'
          
          return (
            <div 
              key={post.id} 
              className="p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200 bg-background/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <PlatformIcon 
                    className="h-4 w-4" 
                    style={{ color: platformColor }}
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    {post.platform}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              <p className="text-sm text-foreground mb-4 leading-relaxed">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-foreground">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-medium text-foreground">{post.shares}</span>
                  </div>
                  {post.linkClicks !== undefined && (
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{post.linkClicks}</span>
                    </div>
                  )}
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  type === 'best' 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {post.engagement.toLocaleString()} engagements
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}