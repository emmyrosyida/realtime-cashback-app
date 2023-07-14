import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useCountUp } from "react-countup";

const Counter = () => {
  const [balance, setBalance] = useState({
    balanceAmount: 0,
    day: 0,
    instantCashpool: 0,
  });
  const [prevBalance, setPrevBalance] = useState(0);

  const countUpRef = useRef(null);
  const { update } = useCountUp({
    ref: countUpRef,
    start: prevBalance,
    end: balance.balanceAmount,
    delay: 0,
    duration: 20,
  });

  useEffect(() => {
    getCashbackBalance();
    const interval = setInterval(() => {
      getCashbackBalance();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    update(balance.balanceAmount);
  }, [balance]);

  const getCashbackBalance = async () => {
    setPrevBalance(balance.balanceAmount);

    //! DEV
    const url = "https://operation-dev.api.tcetech.co/graphql";
    const key = "da2-5pgoiezksvf4re6n22iz46qi4u";
    const idExpo = "63bfbab84c8e86f15af8af67";

    //! PRODUCTION
    // const url = "https://operation.api.tcetech.co/graphql";
    // const key = "da2-ofdua3ip2ba4xfenpx6tb25qoe";
    // const idExpo = "6423e3691d56e5990fee85f8";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
        },
        body: JSON.stringify({
          query: `
              query getCashbackBalance($input: ExhibitionInput!) {
                getCashbackBalance(input: $input) {
                  balanceAmount
                  date
                  instantCashpool
                  day
                }
        }
          `,
          variables: {
            input: {
              id: idExpo,
            },
          },
        }),
      });

      const json = await response.json();
      const data = json.data.getCashbackBalance;
      const { balanceAmount } = data;

      if (balanceAmount <= prevBalance || prevBalance === 0) setBalance(data);
    } catch (error) {
      console.log(`[ERROR]:`, error);
    }
  };

  return (
    <div>
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
      <div className="min-w-screen font-extrabold min-h-screen flex-col bg-baby-yellow-900 bg-[url('../public/bkg-tv.jpg')] bg-cover flex justify-between items-center px-5 py-28">
        <div className="">
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
          <h1 className="text-6xl mb-3">Cash Remaining</h1>
          <div className="text-[10rem]">
            <div className="mb-4 relative z-50 mt-4 p-3 px-14 bg-white inline-flex justify-center animated-spin-box ">
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
