import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useCountUp } from "react-countup";
import { SUBSCRIPTION_GET_BALANCE } from "../apollo/subscription";
import { useLazyQuery, useQuery, useSubscription } from "@apollo/client";
import { GET_CASHBACK_BALANCE, GET_LATEST_EXPO } from "../apollo/get";

const Counter = () => {
  const env = process.env.REACT_APP_NODE_ENV === "production";
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [refetch, setRefetch] = useState(false);

  const [balance, setBalance] = useState({
    balanceAmount: 0,
    day: 0,
    instantCashpool: 0,
  });

  const countUpRef = useRef(null);
  const { update } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: balance.balanceAmount,
    delay: 0,
    duration: 20,
  });

  const { data } = useQuery(GET_LATEST_EXPO, {
    context: { clientName: "expo" },
  });

  const [getCashbackBalance] = useLazyQuery(GET_CASHBACK_BALANCE, {
    context: { clientName: "operation" },
    onCompleted: (data) => {
      setBalance(data.getCashbackBalance);
    },
    fetchPolicy: "no-cache",
  });

  const { data: dataSubs } = useSubscription(SUBSCRIPTION_GET_BALANCE, {
    context: { clientName: "operation" },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRefetch((x) => !x);
    }, 300000); // 300000

    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleStatusChange);
    };
  }, []);

  useEffect(() => {
    if (data?.getLatestExpo) {
      getCashbackBalance({
        variables: {
          input: {
            id: data.getLatestExpo.id,
          },
        },
      });
    }
  }, [data, dataSubs, refetch]);

  useEffect(() => {
    update(balance.balanceAmount);
  }, [balance]);

  const handleStatusChange = () => {
    setIsOnline(navigator.onLine);
    setRefetch((x) => !x);
  };

  return (
    <div className="text-center ">
      <div className="fixed p-8">
        <img src="/expo-baby.png" className=" w-[120px]" alt="baby-afro"></img>
      </div>
      <div className="fixed end-0 p-8">
        <img
          src="/tce-baby-logo-dark.png"
          className=" w-[120px]"
          alt="tce-logo"
        ></img>
      </div>

      <div className={`fixed bottom-1 right-1 pr-2 ${isOnline && "hide"}`}>
        <span
          className={`text-xs font-bold inline-flex items-center px-2.5 py-0.5 rounded mr-2 border
            ${
              isOnline
                ? "bg-green-200 border-green-700 text-green-700"
                : "bg-red-200 border-red-700 text-red-700"
            }`}
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-3 h-3 mr-1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
            />
          </svg>

          <span className="pt-1"> {isOnline ? "Online" : "Offline"}</span>
        </span>
      </div>
      <div className="min-w-screen min-h-screen font-extrabold flex-col bg-baby-yellow-900 bg-[url('../public/bkg-tv.jpg')] bg-cover flex justify-between items-center px-5 py-16">
        <div className="py-10">
          <h1 className="text-4xl mb-3">Date</h1>
          <h1 className="text-8xl">{`${dayjs()
            .format("DD MMMM YYYY")
            .toLocaleUpperCase()}`}</h1>
          <h1 className="text-4xl ">{`${`(Day ${balance.day})`.toUpperCase()}`}</h1>
        </div>
        <div>
          <h1 className="text-4xl mb-6">Instant Cashpool</h1>
          <h1 className="text-8xl mb-3 ">
            RM {`${balance.instantCashpool.toLocaleString()}`}
          </h1>
        </div>
        <div>
          <h1
            className={`text-6xl mb-3 ${env ? "text-black" : "text-red-500"}`}
          >
            Cash Remaining
          </h1>
          <div className="text-[10rem]">
            <div
              className={`mb-4 relative z-50 mt-4 p-3 px-14 bg-white inline-flex justify-center animated-spin-box`}
            >
              RM
              <span className="p-4" />
              <div ref={countUpRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter;
