import DefaultCard from './DefaultCard'
import React from 'react'

export default function VolleyballCard(props: any) {
  const evtStyle = { header: 'bg-emerald-600', bannerFrom: 'from-emerald-700', bannerTo: 'to-emerald-500' }
  return <DefaultCard {...props} evtStyle={evtStyle} />
}
