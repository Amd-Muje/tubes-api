// import React from 'react'
import Footer from '~/components/footer'
import Navbar from '~/components/navbar'

export default function DefaultLayout({ children }: any) {
  return (
    <>
      <Navbar/>
      {children}
      <Footer />
    </>
  )
}
