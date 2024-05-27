import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { useCountUp } from 'react-countup'
import { SUBSCRIPTION_GET_BALANCE } from '../apollo/subscription'
import { useLazyQuery, useSubscription } from '@apollo/client'
import { GET_CASHBACK_BALANCE, GET_LATEST_EXPO } from '../apollo/get'

const Counter = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [refetch, setRefetch] = useState(false)

  const [balance, setBalance] = useState({
    balanceAmount: 0,
    day: 0,
    instantCashpool: 0,
  })

  const countUpRef = useRef(null)
  const { update } = useCountUp({
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
    update(balance.balanceAmount)
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
    <div className="text-center text-white relative h-screen bg-[url('../public/bkg-tv.jpg')] bg-cover">
      <div className="fixed p-8 z-10">
        <img
          src="/duck-expo.png"
          className=" w-[120px] rounded-full border-solid border-4 border-amber-300"
          alt="duck-expo"></img>
      </div>
      <div className="relative z-50">
        <div className={`fixed bottom-1 right-1 pr-2 ${isOnline && 'hide'}`}>
          <span
            className={`text-xs font-bold inline-flex items-center px-2.5 py-0.5 rounded mr-2 border
            ${isOnline ? 'bg-green-200 border-green-700 text-green-700' : 'bg-red-200 border-red-700 text-red-700'}`}>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3 mr-1.5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
              />
            </svg>
            <span className="pt-1"> {isOnline ? 'Online' : 'Offline'}</span>
          </span>
        </div>
        <div className="min-w-screen  font-extrabold flex-col  bg-cover flex justify-between items-center px-5">
          <div className="py-10">
            <h1 className="text-4xl mb-3">Date</h1>
            <h1 className="text-8xl">{`${dayjs().format('DD MMMM YYYY').toLocaleUpperCase()}`}</h1>
            <h1 className="text-4xl ">{`${`(Day ${balance.day})`.toUpperCase()}`}</h1>
          </div>
          <div>
            <h1 className="text-4xl mb-6">Instant Cashpool</h1>
            <h1 className="text-8xl mb-3 ">RM {`${balance.instantCashpool.toLocaleString()}`}</h1>
          </div>
          <div>
            <h1 className={`text-6xl mb-3`}>Cash Remaining</h1>
            <div className="text-[8rem]">
              <div
                className={`mb-4 relative z-50 mt-4 py-3 px-8 text-black bg-amber-300 inline-flex justify-center animated-spin-box`}>
                RM
                <span className="p-6" />
                <div ref={countUpRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-screen h-screen bg-yellow-500/70"></div>
    </div>
  )
}

export default Counter
