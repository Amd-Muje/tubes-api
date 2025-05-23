// import React from 'react'
import Navbar from '~/components/navbar'
import Footer from '~/components/footer'

export default function DefaultLayout({ children }: any) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
