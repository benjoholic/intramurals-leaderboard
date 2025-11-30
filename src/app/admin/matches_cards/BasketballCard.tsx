import DefaultCard from './DefaultCard'
import React from 'react'

export default function BasketballCard(props: any) {
  const evtStyle = { header: 'bg-orange-600', bannerFrom: 'from-orange-700', bannerTo: 'to-orange-500' }
  return <DefaultCard {...props} evtStyle={evtStyle} />
}
