'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type { Device, Room, Gadget } from '@/lib/types'

export default function CreateMaintenancePage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [gadgets, setGadgets] = useState<Gadget[]>([])
  const [selectedType, setSelectedType] = useState('device')
  const [selectedId, setSelectedId] = useState('')
  const [description, setDescription] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [status, setStatus] = useState('pending')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devicesData, roomsData, gadgetsData] = await Promise.all([
          supabase.from('devices').select('*'),
          supabase.from('rooms').select('*'),
          supabase.from('gadgets').select('*'),
        ])

        if (devicesData.error) throw devicesData.error
        if (roomsData.error) throw roomsData.error
        if (gadgetsData.error) throw gadgetsData.error

        setDevices(devicesData.data || [])
        setRooms(roomsData.data || [])
        setGadgets(gadgetsData.data || [])

        if (devicesData.data && devicesData.data.length > 0) {
          setSelectedId(devicesData.data[0].id)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const maintenanceData: any = {
        description,
        scheduled_date: new Date(scheduledDate).toISOString(),
        status,
      }

      if (selectedType === 'device') {
        maintenanceData.device_id = selectedId
      } else if (selectedType === 'room') {
        maintenanceData.room_id = selectedId
      } else if (selectedType === 'gadget') {
        maintenanceData.gadget_id = selectedId
      }

      const { error: insertError } = await supabase.from('maintenance').insert([maintenanceData])

      if (insertError) throw insertError

      router.push('/maintenances')
    } catch (err) {
      console.error('Error creating maintenance:', err)
      setError('Failed to create maintenance. Please try again.')
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

  const getItems = () => {
    if (selectedType === 'device') return devices
    if (selectedType === 'room') return rooms
    return gadgets
  }

  const getItemLabel = (item: any) => {
    if (selectedType === 'device') return item.name
    if (selectedType === 'room') return item.name
    return item.name
  }

  const items = getItems()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/maintenances" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Maintenance
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule Maintenance</CardTitle>
          <CardDescription>Create a new maintenance record for a device, room, or gadget.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="device">Device</SelectItem>
                  <SelectItem value="room">Room</SelectItem>
                  <SelectItem value="gadget">Gadget</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item">
                {selectedType === 'device' ? 'Device' : selectedType === 'room' ? 'Room' : 'Gadget'}
              </Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger id="item" className="w-full">
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>
                      {getItemLabel(item)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Replace filter, Fix door lock"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/maintenances">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Maintenance'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
