// import { interval } from "rxjs";
// import { sampleTime, switchAll, map } from "rxjs/operators";
import { useEffect, useState } from "react";
import { interval } from "rxjs";

import styles from "./App.module.scss";

function App() {
  const DOM = [];
  const [additionalStyle, handelAdditionalStyle] = useState(styles.start);
  const [subscriptions, handleSubscriptions] = useState({});

  function fixValue(DomElement) {
    let result = "";
    DomElement.dataset.value.length < 2
      ? (result = "0" + DomElement.dataset.value)
      : (result = DomElement.dataset.value);
    return result;
  }

  function stopwatch() {
    DOM[0].dataset.value < +DOM[0].dataset.limit
      ? increment([DOM[0]])
      : newRound();

    function newRound() {
      const [inc, res] = checkValue();
      res.push(DOM[0]);
      increment(inc);
      handleReset(res);
    }

    function checkValue() {
      const inc = [],
        res = [];
      for (let i = 1; i < DOM.length; i++) {
        if (+DOM[i].dataset.value < +DOM[i].dataset.limit) {
          inc.push(DOM[i]);
          return [inc, res];
        }
        if (+DOM[i].dataset.value === +DOM[i].dataset.limit) {
          res.push(DOM[i]);
        }
      }
      return [inc, res];
    }

    function increment(arrOfDomElement) {
      if (Array.isArray(arrOfDomElement) && arrOfDomElement.length === 1) {
        ++arrOfDomElement[0].dataset.value;
        arrOfDomElement[0].innerText = fixValue(arrOfDomElement[0]);
      }
      if (Array.isArray(arrOfDomElement) && arrOfDomElement.length > 1) {
        arrOfDomElement.forEach((el) => {
          ++el.dataset.value;
          el.innerText = fixValue(el);
        });
      }
    }
  }

  function handleStart() {
    const id = interval(16).subscribe(stopwatch);
    handleSubscriptions({ interval: id });
  }
  function handleStop() {
    subscriptions.interval?.unsubscribe();
    handleSubscriptions({ interval: null });
  }
  function handleReset(arrOfDomElement = DOM) {
    if (Array.isArray(arrOfDomElement) && arrOfDomElement.length === 1) {
      arrOfDomElement[0].innerText = "00";
      arrOfDomElement[0].dataset.value = "0";
    }
    if (
      arrOfDomElement &&
      Array.isArray(arrOfDomElement) &&
      arrOfDomElement.length > 1
    ) {
      arrOfDomElement.forEach((el) => {
        el.innerText = "00";
        el.dataset.value = "0";
      });
    }
  }

  // lifecycle methods
  useEffect(() => {
    DOM.push(...[...document.querySelector("#clockFace").children].reverse());
    // DOM.last = function(){return this[this.length-1]};
  });
  useEffect(() => {
    return () => handleStop();
  }, []);
  // lifecycle methods  ______END______
  return (
    <div className={styles.gridContainer}>
      <ul id="clockFace" className={styles.clockFace}>
        <li data-value="0" data-limit="24">
          00
        </li>
        <li data-value="0" data-limit="59">
          00
        </li>
        <li data-value="0" data-limit="59">
          00
        </li>
      </ul>
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
