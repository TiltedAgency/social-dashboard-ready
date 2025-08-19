import { useState } from 'react'
import { Button } from './ui/button'
import { Instagram, Facebook, Zap } from 'lucide-react'

interface SocialMediaSelectorProps {
  selectedPlatforms: string[]
  onPlatformsChange: (platforms: string[]) => void
}

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'pinterest', name: 'Pinterest', icon: Zap, color: '#BD081C' }
]

export function SocialMediaSelector({ selectedPlatforms, onPlatformsChange }: SocialMediaSelectorProps) {
  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      onPlatformsChange(selectedPlatforms.filter(id => id !== platformId))
    } else {
      onPlatformsChange([...selectedPlatforms, platformId])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => {
        const Icon = platform.icon
        const isSelected = selectedPlatforms.includes(platform.id)
        
        return (
          <Button
            key={platform.id}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => togglePlatform(platform.id)}
            className={`flex items-center gap-2 transition-all duration-200 ${
              isSelected 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Icon className="h-4 w-4" />
            {platform.name}
          </Button>
        )
      })}
    </div>
  )
}