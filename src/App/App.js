import { Fragment, useEffect, useState } from "react";
import { interval } from "rxjs";
import { timestamp, take } from "rxjs/operators";

function App() {
  const [buttons, handleButtons] = useState(["start", "wait", "reset"]);
  const [ms, handleMs] = useState(0);
  const [sec, handleSec] = useState(0);
  const [min, handleMin] = useState(0);
  const [hh, handleHh] = useState(0);
  const [subId, handleSubId] = useState(null);
  const [isWait, handleIsWait] = useState(null);
  const [arrayOfTimestamp, handleArrayOfTimestamp] = useState([]);

  const intervalStep = 16;
  const delayForWaitButton = 300;
  const lengthArrayOfTimestamp = Math.floor(delayForWaitButton / intervalStep);
  const interval$ = interval(intervalStep);

  function resetValue() {
    handleMs(0);
    handleSec(0);
    handleMin(0);
    handleHh(0);
  }
  function resetMainSubscribe() {
    subId && subId.unsubscribe();
    handleSubId(null);
  }
  function resetWaitSubscribe() {
    isWait && isWait.unsubscribe();
    handleIsWait(null);
  }

  function handleClick(e) {
    e.preventDefault();
    if (e.target.nodeName === "BUTTON" && e.target.innerText === "start") {
      const subscribeID = interval$.subscribe((value) =>
        handleMs((prev) => prev + intervalStep)
      );
      handleButtons([["stop"], ...buttons.splice(1)]);
      handleSubId(subscribeID);
    }
    if (e.target.nodeName === "BUTTON" && e.target.innerText === "stop") {
      handleButtons([["start"], ...buttons.splice(1)]);
      resetMainSubscribe();
      resetValue();
    }
    // подумати як удосконалити
    if (e.target.nodeName === "BUTTON" && e.target.innerText === "wait") {
      resetWaitSubscribe();
        if (isWait && arrayOfTimestamp.length && arrayOfTimestamp.length <= lengthArrayOfTimestamp) {
          handleButtons([["start"], ...buttons.splice(1)]);
          resetMainSubscribe();
        } else {
        handleArrayOfTimestamp(()=>[])
        const takeTimestamp = interval$.pipe(
          timestamp(),
          take(lengthArrayOfTimestamp)
        );
        const subscribeID = takeTimestamp.subscribe((value) =>
          handleArrayOfTimestamp((prev) => {
            return [...prev, value];
          })
        );
        handleIsWait(() => subscribeID);
      }
    }
    if (e.target.nodeName === "BUTTON" && e.target.innerText === "reset") {
      resetValue();
    }
  }
  useEffect(() => {
    if (ms >= 999) {
      handleMs(() => 0);
      handleSec(sec + 1);
    }
    if (sec >= 60) {
      handleSec(() => 0);
      handleMin(min + 1);
    }
    if (min >= 60) {
      handleMin(() => 0);
      handleHh(hh + 1);
    }
    if (hh >= 24) {
      resetMainSubscribe();
    }
    if (isWait && arrayOfTimestamp.length === lengthArrayOfTimestamp) {
      resetWaitSubscribe();
    }
  }, [ms, sec, min, hh, isWait, arrayOfTimestamp]);

  useEffect(() => {
    return () => {
      resetMainSubscribe();
      resetMainSubscribe();
    };
  }, []);

  return (
    <Fragment>
      <div>
      <span>{`${min}`}</span>:<span>{`${min}`}</span>:<span>{`${sec}`}</span>:<span>{`${ms}`}</span>
      </div>
      <ul onClick={handleClick}>
        {buttons.map((el, idx) => {
          return (
            <li key={idx}>
              <button type="button">{el}</button>
            </li>
          );
        })}
      </ul>
    </Fragment>
  );
}

export default App;
