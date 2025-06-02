// import React from 'react'
import Footer from '~/components/footer'
import Navbar from '~/components/navbar'

export default function DefaultLayout({ children }: any) {
  return (
    <>
    <script
      type="text/javascript"
      src="https://app.sandbox.midtrans.com/snap/snap.js"
      data-client-key="SB-Mid-client-eio6vWClf2N6sMAh"
    />
      <Navbar/>
      {children}
      <Footer />
    </>
  )
}
