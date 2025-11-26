'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function CreateRoomPage() {
  const [name, setName] = useState('')
  const [floor, setFloor] = useState('')
  const [capacity, setCapacity] = useState('')
  const [amenities, setAmenities] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert([
          {
            name,
            floor: parseInt(floor),
            capacity: parseInt(capacity),
            amenities: amenities.split(',').map((s) => s.trim()),
            status: 'available',
          },
        ])
        .select()

      if (error) throw error

      router.push('/rooms')
    } catch (error) {
      console.error('Error creating room:', error)
      setError('Failed to create room. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='mb-6'>
        <Button asChild variant='outline' size='sm'>
          <Link href='/rooms' className='gap-2'>
            <ArrowLeft className='w-4 h-4' />
            Back to Rooms
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create a New Room</CardTitle>
          <CardDescription>Fill out the details below to add a new room.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Room Name</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g., Conference Room A'
                required
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='floor'>Floor</Label>
                <Input
                  id='floor'
                  type='number'
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder='e.g., 5'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='capacity'>Capacity</Label>
                <Input
                  id='capacity'
                  type='number'
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder='e.g., 12'
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='amenities'>Amenities</Label>
              <Input
                id='amenities'
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
                placeholder='e.g., Projector, Whiteboard, Video Conferencing'
              />
              <p className='text-sm text-slate-500'>Separate amenities with a comma.</p>
            </div>

            {error && <p className='text-red-600 text-sm'>{error}</p>}

            <div className='flex justify-end gap-4'>
              <Button type='button' variant='outline' asChild>
                <Link href='/rooms'>Cancel</Link>
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating...
                  </>
                ) : (
                  'Create Room'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
