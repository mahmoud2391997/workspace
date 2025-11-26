import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function EditGadgetPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: { session } } = await (await supabase).auth.getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  const { data: gadget, error } = await (await supabase).from('gadgets').select('*').eq('id', params.id).single()
    
  if (error || !gadget) {
    redirect('/gadgets')
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Gadget</h1>
      <div>Form component will be implemented here</div>
    </div>
  )
}