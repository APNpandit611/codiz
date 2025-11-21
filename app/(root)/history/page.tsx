import Loader from '@/components/Loader';
import dynamic from 'next/dynamic'
import React from 'react'

const HistoryPage = dynamic(() => import("@/components/HistoryComponent"), { loading: () => <Loader className="mt-20" text = "History Loading..."/> });
const History = () => {
  return (
    <HistoryPage />
  )
}

export default History
