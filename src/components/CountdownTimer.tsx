"use client";
import React, { useEffect, useState } from "react";

type TimeLabels = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

type LabelsConfig = {
  ar: TimeLabels;
  fr: TimeLabels;
};

const COUNTDOWN_SECONDS = 1 * 24 * 60 * 60 - 5 * 60 * 60; // 1 day minus 5 hours

const CountdownTimer: React.FC<{ lang: "ar" | "fr" }> = ({ lang }) => {
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [remaining]);

  const days = Math.floor(remaining / (24 * 60 * 60));
  const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((remaining % (60 * 60)) / 60);
  const seconds = remaining % 60;

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

  return (
    <div className="bg-green-50 p-4 rounded-lg my-4 flex items-center justify-between">
      <h3 className="font-bold text-green-800 text-sm md:text-base">
        {lang === "ar" ? "العرض ينتهي في:" : "L'offre se termine dans :"}
      </h3>
      <div className="flex justify-center items-center gap-3" dir="ltr">
        <TimeSlot value={days} label={labels[lang].days} />
        <span className="text-3xl font-bold text-green-800">:</span>
        <TimeSlot value={hours} label={labels[lang].hours} />
        <span className="text-3xl font-bold text-green-800">:</span>
        <TimeSlot value={minutes} label={labels[lang].minutes} />
        <span className="text-3xl font-bold text-green-800">:</span>
        <TimeSlot value={seconds} label={labels[lang].seconds} />
      </div>
    </div>
  );
};

export default CountdownTimer;
