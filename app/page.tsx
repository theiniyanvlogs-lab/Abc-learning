"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Repeat,
  Repeat1,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const numbers = [
  { value: 1, emoji: "🍎", title: "One Apple", subtitle: "Number 1" },
  { value: 2, emoji: "🍎", title: "Two Apples", subtitle: "Number 2" },
  { value: 3, emoji: "🍎", title: "Three Apples", subtitle: "Number 3" },
  { value: 4, emoji: "🍎", title: "Four Apples", subtitle: "Number 4" },
  { value: 5, emoji: "🍎", title: "Five Apples", subtitle: "Number 5" },
  { value: 6, emoji: "🍎", title: "Six Apples", subtitle: "Number 6" },
  { value: 7, emoji: "🍎", title: "Seven Apples", subtitle: "Number 7" },
  { value: 8, emoji: "🍎", title: "Eight Apples", subtitle: "Number 8" },
  { value: 9, emoji: "🍦", title: "Nine Ice Creams", subtitle: "Number 9" },
  { value: 10, emoji: "⭐", title: "Ten Stars", subtitle: "Number 10" },
];

export default function Home() {
  const [current, setCurrent] = useState(8); // starts at 9
  const [voiceOn, setVoiceOn] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loop, setLoop] = useState(false);
  const [speed, setSpeed] = useState(3000);
  const [kidName, setKidName] = useState("Naren");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const item = useMemo(() => numbers[current], [current]);

  const speakText = () => {
    if (!voiceOn || typeof window === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(`${item.title}. ${item.subtitle}`);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const nextItem = () => {
    setCurrent((prev) => {
      if (prev < numbers.length - 1) return prev + 1;
      return loop ? 0 : prev;
    });
  };

  const prevItem = () => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const resetToOne = () => {
    setCurrent(0);
    setIsPlaying(false);
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    speakText();
  }, [current]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => {
          if (prev < numbers.length - 1) return prev + 1;
          if (loop) return 0;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, loop]);

  return (
    <main className="min-h-screen bg-[#eef8fb] px-4 py-5">
      <div className="mx-auto max-w-md">
        {/* Main Card */}
        <div className="rounded-[34px] bg-white/90 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-md">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={prevItem}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f9f0df] shadow-md"
            >
              <ChevronLeft className="h-7 w-7 text-[#c98c2f]" />
            </button>

            <div className="text-center">
              <p className="text-lg font-medium text-slate-500">
                Number {item.value} / 10
              </p>
              <h1 className="text-3xl font-extrabold text-slate-800">
                Tap and Learn!
              </h1>
            </div>

            <button
              onClick={nextItem}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d8f8ff] shadow-md"
            >
              <ChevronRight className="h-7 w-7 text-[#1aa5be]" />
            </button>
          </div>

          {/* Learning Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={item.value}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="rounded-[34px] bg-gradient-to-br from-[#9ee52d] to-[#48db82] px-6 py-8 text-center shadow-[0_10px_30px_rgba(72,219,130,0.25)]"
            >
              <div className="text-8xl font-black text-white drop-shadow-md">
                {item.value}
              </div>

              <div className="mt-5 text-5xl">{item.emoji}</div>

              <h2 className="mt-5 text-4xl font-extrabold text-white drop-shadow-sm">
                {item.title}
              </h2>

              <p className="mt-3 text-2xl font-semibold text-white/95">
                {item.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Controls Grid */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <button
              onClick={speakText}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#9d4ef8] to-[#b95ffb] px-4 py-4 text-xl font-bold text-white shadow-lg"
            >
              <Volume2 className="h-6 w-6" />
              Speak
            </button>

            <button
              onClick={() => setVoiceOn(!voiceOn)}
              className="rounded-full bg-gradient-to-r from-[#f04aa5] to-[#e53d93] px-4 py-4 text-xl font-bold text-white shadow-lg"
            >
              Voice {voiceOn ? "ON" : "OFF"}
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4a83f0] to-[#3a79e8] px-4 py-4 text-xl font-bold text-white shadow-lg"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              {isPlaying ? "Playing" : "Play"}
            </button>

            <button
              onClick={resetToOne}
              className="flex items-center justify-center gap-2 rounded-full bg-[#f3f3f7] px-4 py-4 text-xl font-bold text-slate-700 shadow-md"
            >
              <RotateCcw className="h-6 w-6" />
              Reset
            </button>

            <div className="rounded-[28px] bg-[#f7f7fa] px-5 py-4 shadow-md">
              <p className="mb-2 text-lg font-semibold text-slate-500">Speed</p>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full bg-transparent text-2xl font-bold text-slate-700 outline-none"
              >
                <option value={3000}>3 sec</option>
                <option value={5000}>5 sec</option>
                <option value={7000}>7 sec</option>
              </select>
            </div>

            <button
              onClick={() => setLoop(!loop)}
              className="flex items-center justify-center gap-2 rounded-[28px] bg-[#d6f3df] px-4 py-4 text-2xl font-bold text-[#0c6b4f] shadow-md"
            >
              {loop ? <Repeat1 className="h-6 w-6" /> : <Repeat className="h-6 w-6" />}
              Loop {loop ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Kid Name Input */}
        <div className="mt-6 rounded-[30px] bg-white/80 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <input
            type="text"
            value={kidName}
            onChange={(e) => setKidName(e.target.value)}
            placeholder="Enter kid name"
            className="w-full rounded-[24px] border-[3px] border-pink-200 px-6 py-5 text-2xl font-medium text-slate-800 outline-none"
          />
        </div>

        {/* Kid Profile Card */}
        <div className="mt-6 rounded-[34px] bg-white/85 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <div className="rounded-[30px] bg-gradient-to-br from-pink-50 via-white to-cyan-50 p-6 shadow-inner">
            <div className="relative mx-auto flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-r from-pink-200 to-cyan-200 p-3 shadow-lg">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[110px]">
                👶
              </div>
              <div className="absolute right-2 top-2 h-5 w-5 rounded-full bg-pink-200" />
            </div>

            <div className="mt-6 flex justify-center">
              <div className="rounded-full bg-white px-8 py-4 shadow-lg">
                <p className="text-2xl font-bold text-pink-600">
                  ⭐ {kidName || "My Little Star"} ⭐
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
