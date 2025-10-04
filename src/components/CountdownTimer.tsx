"use client";
import { Language } from "firebase/ai";
import { useEffect, useState } from "react";

type TimeLabels = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

type LabelsConfig = {
  [K in Language]: TimeLabels;
};

const CountdownTimer: React.FC<{ expiryTimestamp: number; lang: Language }> = ({
  expiryTimestamp,
  lang,
}) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(expiryTimestamp) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const labels: LabelsConfig = {
    ar: { days: "أيام", hours: "ساعات", minutes: "دقائق", seconds: "ثواني" },
    fr: { days: "Jours", hours: "Heures", minutes: "Min", seconds: "Sec" },
  };

  const TimeSlot: React.FC<{ value: number; label: string }> = ({
    value,
    label,
  }) => (
    <div className="text-center">
      <span className="text-3xl font-bold text-green-800">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs text-gray-500 block">{label}</span>
    </div>
  );

  if (!Object.values(timeLeft).some((v) => v > 0)) {
    return null;
  }

  return (
    <div className="bg-green-50 p-4 rounded-lg my-4 flex items-center justify-between">
      <h3 className="font-bold text-green-800 text-sm md:text-base">
        {lang === "ar" ? "العرض ينتهي في:" : "L'offre se termine dans :"}
      </h3>
      <div className="flex justify-center items-center gap-3" dir="ltr">
        <TimeSlot value={timeLeft.days} label={labels[lang].days} />
        <span className="text-3xl font-bold text-green-800">:</span>
        <TimeSlot value={timeLeft.hours} label={labels[lang].hours} />
        <span className="text-3xl font-bold text-green-800">:</span>
        <TimeSlot value={timeLeft.minutes} label={labels[lang].minutes} />
        <span className="text-3xl font-bold text-green-800">:</span>
        <TimeSlot value={timeLeft.seconds} label={labels[lang].seconds} />
      </div>
    </div>
  );
};

export default CountdownTimer;
