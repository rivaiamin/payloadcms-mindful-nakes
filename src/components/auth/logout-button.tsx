'use client'

import { signOut } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)
    await signOut()
    // Redirect happens in server action
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full sm:w-auto"
    >
      {isLoading ? 'Keluar...' : 'Keluar'}
    </Button>
  )
}
