// import { interval } from "rxjs";
// import { sampleTime, switchAll, map } from "rxjs/operators";
import { useEffect, useState } from "react";
import { interval } from "rxjs";

import styles from "./App.module.scss";

function App() {
  const DOM = {};
  const [additionalStyle, handelAdditionalStyle] = useState(styles.start);
  const [subscriptions, handleSubscriptions] = useState({});

  function fixValue(DomElement) {
    let result = "";
    DomElement.dataset.value.length < 2
      ? (result = "0" + DomElement.dataset.value)
      : (result = DomElement.dataset.value);
    return result;
  }

  //! 23:59:59
  function stopwatch() {
    DOM.sec.dataset.value < 59
      ? increment(DOM.sec)
      : increment(DOM.min, DOM.sec);
    function increment(incrementDomElement, resetDomElement) {
      switch (resetDomElement) {
        case DOM.sec:
          handleReset([resetDomElement]);
          ++incrementDomElement.dataset.value;
          incrementDomElement.innerText = fixValue(incrementDomElement);
          break;
        case DOM.min:

          break;
        default:
          ++incrementDomElement.dataset.value;
          incrementDomElement.innerText = fixValue(incrementDomElement);
      }
    }
  }

  function handleStart() {
    const id = interval(100).subscribe(stopwatch);
    handleSubscriptions({ interval: id });
  }
  function handleStop() {
    subscriptions.interval?.unsubscribe();
    handleSubscriptions({ interval: null });
  }
  function handleReset(arrOfDomElement) {
    if (!arrOfDomElement) {
      handleReset(Object.values(DOM));
    }
    if (arrOfDomElement) {
      arrOfDomElement.forEach((el) => {
        el.innerText = "00";
        el.dataset.value = "0";
      });
    }
  }

  // lifecycle methods
  useEffect(() => {
    DOM.sec = document.querySelector("#sec");
    DOM.min = document.querySelector("#min");
    DOM.hour = document.querySelector("#hour");
  });
  useEffect(() => {
    return () => handleStop();
  }, []);
  // lifecycle methods  ______END______
  return (
    <div className={styles.gridContainer}>
      <div>
        <span id="hour" data-value="0">
          00
        </span>
        :
        <span id="min" data-value="0">
          00
        </span>
        :
        <span id="sec" data-value="0">
          00
        </span>
      </div>
      <button
        type="button"
        id="start&stop"
        className={`${styles.btn} ${additionalStyle}`}
        onClick={handleStart}
      >
        start
      </button>
      <button type="button" id="wait" className={styles.btn}>
        wait
      </button>
      <button
        type="button"
        id="reset"
        className={styles.btn}
        onClick={() => handleReset()}
      >
        reset
      </button>
    </div>
  );
}

export default App;
