import {useEffect, useMemo, useState} from 'react';

type TimeParts = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

function formatTimeParts(diff: number): TimeParts {
  if (diff <= 0) {
    return {days: '00', hours: '00', minutes: '00', seconds: '00'};
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const format = (value: number) => value.toString().padStart(2, '0');

  return {
    days: format(days),
    hours: format(hours),
    minutes: format(minutes),
    seconds: format(seconds),
  };
}

interface CountdownTimerProps {
  target: string;
  label?: string;
}

export function CountdownTimer({target, label}: CountdownTimerProps) {
  const targetTime = useMemo(() => new Date(target).getTime(), [target]);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = targetTime - now;
  const timeRemaining = formatTimeParts(Number.isFinite(diff) ? diff : 0);

  return (
    <div className="card-panel relative overflow-hidden border border-slate-800/60 bg-slate-900/70">
      <div className="absolute inset-0 bg-gradient-to-r from-electric-500/10 via-transparent to-amber-400/10" />
      <div className="relative flex flex-col gap-6">
        {label ? (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
        ) : null}
        <div className="grid grid-cols-4 gap-3 text-center">
          {Object.entries(timeRemaining).map(([unit, value]) => (
            <div key={unit} className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 shadow-inner">
              <p className="font-display text-3xl text-electric-400">{value}</p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">{unit}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Dropping exclusively on Thrivv. Sync your calendar and secure the capsule before it disappears.
        </p>
      </div>
    </div>
  );
}
