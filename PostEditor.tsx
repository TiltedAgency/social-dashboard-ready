import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react'

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

interface PostEditorProps {
  bestPosts: Post[]
  worstPosts: Post[]
  onPostsChange: (bestPosts: Post[], worstPosts: Post[]) => void
}

export function PostEditor({ bestPosts, worstPosts, onPostsChange }: PostEditorProps) {
  const [activeTab, setActiveTab] = useState<'best' | 'worst'>('best')
  const [editingPost, setEditingPost] = useState<number | null>(null)
  
  const currentPosts = activeTab === 'best' ? bestPosts : worstPosts
  
  const addNewPost = () => {
    const newPost: Post = {
      id: Date.now(),
      content: 'Enter your post content here...',
      platform: 'Instagram',
      engagement: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      linkClicks: 0,
      date: new Date().toISOString().split('T')[0]
    }
    
    if (activeTab === 'best') {
      onPostsChange([...bestPosts, newPost], worstPosts)
    } else {
      onPostsChange(bestPosts, [...worstPosts, newPost])
    }
    
    // Automatically start editing the new post
    setEditingPost(newPost.id)
  }
  
  const updatePost = (postId: number, updatedPost: Partial<Post>) => {
    const updatePosts = (posts: Post[]) => 
      posts.map(post => post.id === postId ? { ...post, ...updatedPost } : post)
    
    if (activeTab === 'best') {
      onPostsChange(updatePosts(bestPosts), worstPosts)
    } else {
      onPostsChange(bestPosts, updatePosts(worstPosts))
    }
  }
  
  const deletePost = (postId: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const filterPosts = (posts: Post[]) => posts.filter(post => post.id !== postId)
      
      if (activeTab === 'best') {
        onPostsChange(filterPosts(bestPosts), worstPosts)
      } else {
        onPostsChange(bestPosts, filterPosts(worstPosts))
      }
      
      if (editingPost === postId) {
        setEditingPost(null)
      }
    }
  }

  const startEditing = (postId: number) => {
    setEditingPost(postId)
  }

  const stopEditing = () => {
    setEditingPost(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-foreground">Manage Posts</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Add, edit, or delete your best and worst performing posts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'best' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setActiveTab('best')
              setEditingPost(null)
            }}
          >
            Best Posts ({bestPosts.length})
          </Button>
          <Button
            variant={activeTab === 'worst' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setActiveTab('worst')
              setEditingPost(null)
            }}
          >
            Worst Posts ({worstPosts.length})
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {currentPosts.length === 0 && (
          <Card className="p-8 text-center border-dashed">
            <p className="text-muted-foreground mb-4">
              No {activeTab} performing posts added yet
            </p>
            <Button onClick={addNewPost} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Your First {activeTab === 'best' ? 'Best' : 'Worst'} Post
            </Button>
          </Card>
        )}

        {currentPosts.map((post) => (
          <Card key={post.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      post.platform === 'Instagram' ? 'bg-pink-500' :
                      post.platform === 'Facebook' ? 'bg-blue-500' : 'bg-red-500'
                    }`} />
                    <span className="font-medium text-sm">{post.platform}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {editingPost === post.id ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={stopEditing}
                        className="flex items-center gap-1 text-primary"
                      >
                        <Save className="h-4 w-4" />
                        Done
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={stopEditing}
                        className="flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(post.id)}
                        className="flex items-center gap-1 text-primary"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePost(post.id)}
                        className="flex items-center gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {editingPost === post.id ? (
                // EDITING MODE
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`platform-${post.id}`}>Platform</Label>
                      <Select
                        value={post.platform}
                        onValueChange={(value) => updatePost(post.id, { platform: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="Pinterest">Pinterest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`date-${post.id}`}>Date</Label>
                      <Input
                        id={`date-${post.id}`}
                        type="date"
                        value={post.date}
                        onChange={(e) => updatePost(post.id, { date: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`content-${post.id}`}>Post Content</Label>
                    <Textarea
                      id={`content-${post.id}`}
                      placeholder="Enter the post content..."
                      value={post.content}
                      onChange={(e) => updatePost(post.id, { content: e.target.value })}
                      className="mt-1 min-h-20"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor={`likes-${post.id}`}>Likes</Label>
                      <Input
                        id={`likes-${post.id}`}
                        type="number"
                        min="0"
                        value={post.likes}
                        onChange={(e) => updatePost(post.id, { likes: parseInt(e.target.value) || 0 })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`comments-${post.id}`}>Comments</Label>
                      <Input
                        id={`comments-${post.id}`}
                        type="number"
                        min="0"
                        value={post.comments}
                        onChange={(e) => updatePost(post.id, { comments: parseInt(e.target.value) || 0 })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`shares-${post.id}`}>Shares</Label>
                      <Input
                        id={`shares-${post.id}`}
                        type="number"
                        min="0"
                        value={post.shares}
                        onChange={(e) => updatePost(post.id, { shares: parseInt(e.target.value) || 0 })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`linkClicks-${post.id}`}>Link Clicks</Label>
                      <Input
                        id={`linkClicks-${post.id}`}
                        type="number"
                        min="0"
                        value={post.linkClicks || 0}
                        onChange={(e) => updatePost(post.id, { linkClicks: parseInt(e.target.value) || 0 })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`engagement-${post.id}`}>Total Engagement</Label>
                      <Input
                        id={`engagement-${post.id}`}
                        type="number"
                        min="0"
                        value={post.engagement}
                        onChange={(e) => updatePost(post.id, { engagement: parseInt(e.target.value) || 0 })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center pt-2">
                    <Button
                      onClick={stopEditing}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </>
              ) : (
                // VIEW MODE
                <>
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-destructive">{post.likes}</span>
                        <span className="text-muted-foreground">likes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-primary">{post.comments}</span>
                        <span className="text-muted-foreground">comments</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-secondary">{post.shares}</span>
                        <span className="text-muted-foreground">shares</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-primary">{post.linkClicks || 0}</span>
                        <span className="text-muted-foreground">clicks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{post.engagement}</span>
                        <span className="text-muted-foreground">engagement</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-2">
                    <Button
                      variant="outline"
                      onClick={() => startEditing(post.id)}
                      className="flex items-center gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit This Post
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
        
        {currentPosts.length > 0 && (
          <Button
            variant="outline"
            onClick={addNewPost}
            className="w-full flex items-center gap-2 py-6 border-dashed hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" />
            Add Another {activeTab === 'best' ? 'Best' : 'Worst'} Performing Post
          </Button>
        )}
      </div>
    </div>
  )
}