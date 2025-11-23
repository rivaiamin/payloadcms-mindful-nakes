import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { draftMode } from 'next/headers'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <>
      <AdminBar
        adminBarProps={{
          preview: isEnabled,
        }}
      />
      <Header />
      {children}
      <Footer />
    </>
  )
}

