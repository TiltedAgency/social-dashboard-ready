import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { User, Plus } from "lucide-react"
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface Client {
  id: string
  name: string
  email: string
  platforms: string[]
}

interface ClientSelectorProps {
  selectedClient: string
  onClientChange: (clientId: string) => void
}

export function ClientSelector({ selectedClient, onClientChange }: ClientSelectorProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    platforms: [] as string[]
  })

  const fetchClients = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1b7356ff/clients`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      })
      
      if (response.ok) {
        const { clients } = await response.json()
        setClients(clients.map((item: any) => item.value))
      }
    } catch (error) {
      console.log('Error fetching clients:', error)
    }
  }

  const createClient = async () => {
    if (!newClient.name || !newClient.email || newClient.platforms.length === 0) {
      alert('Please fill in all fields')
      return
    }

    try {
      const clientId = `client_${Date.now()}`
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1b7356ff/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          clientId,
          ...newClient
        })
      })

      if (response.ok) {
        setNewClient({ name: '', email: '', platforms: [] })
        setIsDialogOpen(false)
        fetchClients()
        onClientChange(clientId)
      }
    } catch (error) {
      console.log('Error creating client:', error)
    }
  }

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setNewClient(prev => ({
      ...prev,
      platforms: checked 
        ? [...prev.platforms, platform]
        : prev.platforms.filter(p => p !== platform)
    }))
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedClient} onValueChange={onClientChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select client" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                value={newClient.name}
                onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label>Platforms</Label>
              <div className="space-y-2">
                {['Instagram', 'Facebook', 'Pinterest'].map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      checked={newClient.platforms.includes(platform)}
                      onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
                    />
                    <Label htmlFor={platform}>{platform}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={createClient} className="w-full">
              Create Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}