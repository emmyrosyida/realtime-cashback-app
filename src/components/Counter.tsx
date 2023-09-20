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

    return () => clearInterval(interval);
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

  useEffect(() => {
    window.addEventListener("online", handleStatusChange);
    return () => {
      window.removeEventListener("online", handleStatusChange);
    };
  }, [isOnline]);

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
