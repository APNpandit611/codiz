import Loader from '@/components/Loader';
import dynamic from 'next/dynamic'
import React from 'react'

const HistoryPage = dynamic(() => import("@/components/HistoryComponent"), { loading: () => <Loader className="mt-20" text = "History Loading..."/> });
const History = async ({searchParams}:{searchParams: Promise<{[key:string]:string | undefined}>}) => {
  const {page, ...queryParams} = await searchParams
    const p = page ? parseInt(page) : 1

  return <HistoryPage p={p}/>
}

export default History
