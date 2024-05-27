import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { useCountUp } from 'react-countup'
import { SUBSCRIPTION_GET_BALANCE } from '../apollo/subscription'
import { useLazyQuery, useSubscription } from '@apollo/client'
import { GET_CASHBACK_BALANCE, GET_LATEST_EXPO } from '../apollo/get'
import StatusBox from './commons/StatusBox'
import TitleText from './commons/TitleText'

const Counter = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [refetch, setRefetch] = useState(false)

  const [balance, setBalance] = useState({
    balanceAmount: 0,
    day: 0,
    instantCashpool: 0,
  })

  const countUpRef = useRef(null)
  const { update: updateCountdown } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: balance.balanceAmount,
    delay: 0,
    duration: 20,
  })

  const [getLatestExpo, { data }] = useLazyQuery(GET_LATEST_EXPO, { context: { clientName: 'expo' } })

  const [getCashbackBalance] = useLazyQuery(GET_CASHBACK_BALANCE, {
    context: { clientName: 'operation' },
    onCompleted: data => {
      setBalance(data.getCashbackBalance)
    },
    fetchPolicy: 'no-cache',
  })

  const { data: dataSubs } = useSubscription(SUBSCRIPTION_GET_BALANCE, {
    context: { clientName: 'operation' },
    shouldResubscribe: true,
    onError: err => {
      refetchData()
    },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    getLatestExpo()

    const interval = setInterval(() => {
      console.log('Interval')
      setRefetch(x => !x)
    }, 300000)

    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOfflineChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOfflineChange)
    }
  }, [])

  useEffect(() => {
    if (!data?.getLatestExpo) {
      getLatestExpo()
    }
    if (data?.getLatestExpo) {
      getCashbackBalance({ variables: { input: { id: data.getLatestExpo.id } } })
    }
  }, [data, dataSubs, refetch])

  useEffect(() => {
    updateCountdown(balance.balanceAmount)
  }, [balance])

  const handleOfflineChange = () => {
    setIsOnline(navigator.onLine)
  }

  const handleOnlineStatus = () => {
    setIsOnline(navigator.onLine)

    setTimeout(() => {
      refetchData()
    }, 5000)
  }

  const refetchData = () => {
    setRefetch(x => !x)
  }

  return (
    <div className="relative z-50">
      <div className={`fixed bottom-1 right-1 pr-2 ${isOnline && 'hide'}`}>
        <StatusBox
          text={isOnline ? 'Online' : 'Offline'}
          color={`${
            isOnline ? 'bg-green-200 border-green-700 text-green-700' : 'bg-red-200 border-red-700 text-red-700'
          }`}
        />
      </div>
      <div className="font-extrabold flex-col bg-cover px-5">
        <div className="py-5">
          <TitleText main="Date" sub={`${dayjs().format('DD MMMM YYYY').toLocaleUpperCase()}`} />
          <h1 className="text-4xl ">{`${`(Day ${balance.day})`.toUpperCase()}`}</h1>
        </div>
        <div className="py-5">
          <TitleText main="Instant Cashpool" sub={`RM ${balance.instantCashpool.toLocaleString()}`} />
        </div>
        <div className="py-5 ">
          <TitleText main="Cash Remaining" />
          <div
            className={`shadow-yellow-400 shadow-2xl text-[8rem] mb-4 mt-3 relative z-50 py-3 px-8 text-black bg-amber-300 inline-flex justify-center animated-spin-box`}>
            RM
            <span className="p-6" />
            <div ref={countUpRef} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Counter
