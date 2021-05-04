import React, { useState, useEffect, useMemo } from 'react';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import './App.scss';

export const App = () => {
  const [time, setTime] = useState(0);
  const [secondClick, setSecondClick] = useState(0);
  const [status, setStatus] = useState('stopped');

  useEffect(() => {
    const unsubscribe$ = new Subject();

    interval(1000)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        if (status === 'started') {
          setTime(v => v + 1000);
        }
      });

    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  }, [status]);

  const start = () => {
    setStatus('started');
  };

  const stop = () => {
    if (status === 'started') {
      setStatus('stopped');
    }

    setTime(0);
  };

  const wait = () => {
    const timeNow = new Date().getTime();

    if ((timeNow - secondClick) < 300) {
      setStatus('waiting');
    }

    setSecondClick(timeNow);
  };

  const reset = () => {
    setTime(0);
  };

  const resultedTime = useMemo(() => new Date(time)
    .toISOString().slice(11, 19), [time]);

  return (
    <div className="stopwatch">
      <div className="stopwatch__time">
        {resultedTime}
      </div>
      <div className="stopwatch__buttons">
        <button
          className="stopwatch__btn"
          type="button"
          onClick={() => {
            start();
            if (status !== 'waiting') {
              stop();
            }
          }}
        >
          <span className={status === 'stopped' && 'button_started'}>
            Start
          </span>
          {` `}
          /
          {` `}
          <span className={status === 'started' && 'button_stopped'}>
            Stop
          </span>
        </button>
        <button
          className="stopwatch__btn"
          type="button"
          onClick={() => {
            wait();
          }}
        >
          Wait
        </button>
        <button
          className="stopwatch__btn"
          type="button"
          onClick={() => {
            reset();
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};
