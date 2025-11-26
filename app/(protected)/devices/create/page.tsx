'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function CreateDevicePage() {
  const [name, setName] = useState('')
  const [roomId, setRoomId] = useState('')
  const [rooms, setRooms] = useState<any[]>([])
  const [type, setType] = useState('light')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase.from('rooms').select('*').order('created_at', { ascending: true })
        if (error) throw error
        setRooms(data || [])
        if (data && data.length > 0) setRoomId(data[0].id)
      } catch (err) {
        console.error('Error fetching rooms:', err)
        setError('Failed to load rooms')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRooms()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { error: insertError } = await supabase.from('devices').insert([
        {
          name,
          room_id: roomId,
          type,
          status: 'off',
        },
      ])

      if (insertError) throw insertError

      router.push('/devices')
    } catch (err) {
      console.error('Error creating device:', err)
      setError('Failed to create device. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/devices" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Devices
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add a New Device</CardTitle>
          <CardDescription>Add a device and assign it to a room.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Device Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Lobby Lights" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Select value={roomId} onValueChange={(v) => setRoomId(v)}>
                <SelectTrigger id="room" className="w-full">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v)}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select a device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="ac">AC</SelectItem>
                  <SelectItem value="door_lock">Door Lock</SelectItem>
                  <SelectItem value="sensor">Sensor</SelectItem>
                  <SelectItem value="projector">Projector</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/devices">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Add Device'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
