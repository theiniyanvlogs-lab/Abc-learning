"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

const alphabetData = [
  { letter: "A", word: "Apple", emoji: "🍎", color: "from-red-400 to-pink-400" },
  { letter: "B", word: "Ball", emoji: "⚽", color: "from-blue-400 to-cyan-400" },
  { letter: "C", word: "Cat", emoji: "🐱", color: "from-yellow-400 to-orange-400" },
  { letter: "D", word: "Dog", emoji: "🐶", color: "from-green-400 to-emerald-400" },
  { letter: "E", word: "Elephant", emoji: "🐘", color: "from-purple-400 to-pink-400" },
  { letter: "F", word: "Fish", emoji: "🐟", color: "from-cyan-400 to-blue-400" },
  { letter: "G", word: "Grapes", emoji: "🍇", color: "from-violet-400 to-fuchsia-400" },
  { letter: "H", word: "Hat", emoji: "🎩", color: "from-orange-400 to-red-400" },
  { letter: "I", word: "Ice Cream", emoji: "🍦", color: "from-pink-300 to-purple-300" },
  { letter: "J", word: "Juice", emoji: "🧃", color: "from-lime-400 to-green-400" },
  { letter: "K", word: "Kite", emoji: "🪁", color: "from-sky-400 to-indigo-400" },
  { letter: "L", word: "Lion", emoji: "🦁", color: "from-amber-400 to-orange-500" },
  { letter: "M", word: "Monkey", emoji: "🐵", color: "from-yellow-500 to-orange-400" },
  { letter: "N", word: "Nest", emoji: "🪺", color: "from-stone-400 to-yellow-500" },
  { letter: "O", word: "Orange", emoji: "🍊", color: "from-orange-400 to-amber-400" },
  { letter: "P", word: "Parrot", emoji: "🦜", color: "from-green-400 to-lime-400" },
  { letter: "Q", word: "Queen", emoji: "👑", color: "from-yellow-300 to-pink-400" },
  { letter: "R", word: "Rabbit", emoji: "🐰", color: "from-pink-300 to-fuchsia-400" },
  { letter: "S", word: "Sun", emoji: "☀️", color: "from-yellow-300 to-orange-400" },
  { letter: "T", word: "Tiger", emoji: "🐯", color: "from-orange-400 to-red-500" },
  { letter: "U", word: "Umbrella", emoji: "☂️", color: "from-indigo-400 to-purple-500" },
  { letter: "V", word: "Van", emoji: "🚐", color: "from-cyan-400 to-sky-500" },
  { letter: "W", word: "Watch", emoji: "⌚", color: "from-gray-400 to-slate-500" },
  { letter: "X", word: "Xylophone", emoji: "🎼", color: "from-fuchsia-400 to-purple-500" },
  { letter: "Y", word: "Yak", emoji: "🐂", color: "from-stone-400 to-zinc-500" },
  { letter: "Z", word: "Zebra", emoji: "🦓", color: "from-slate-300 to-gray-500" }
];

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const [kidName, setKidName] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(3000);
  const [loopMode, setLoopMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const current = alphabetData[index];
  const defaultKidImage = "/kid-profile.jpg";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedKidName = localStorage.getItem("abc_kid_name");
    if (savedKidName) setKidName(savedKidName);

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("abc_kid_name", kidName);
  }, [kidName, isLoaded]);

  const speakText = (text: string) => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.15;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find(
        (v) =>
          v.lang.toLowerCase().includes("en") &&
          /female|zira|samantha|google us english/i.test(v.name)
      ) ||
      voices.find((v) => v.lang.toLowerCase().includes("en")) ||
      voices[0];

    if (englishVoice) utterance.voice = englishVoice;

    window.speechSynthesis.speak(utterance);
  };

  const speakCurrent = () => {
    speakText(`${current.letter} for ${current.word}. ${current.word}!`);
  };

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis?.getVoices();
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    if (autoSpeak) {
      const timer = setTimeout(() => {
        speakCurrent();
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [index, autoSpeak]);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setIndex((prev) => {
        if (prev >= alphabetData.length - 1) {
          if (loopMode) {
            return 0;
          } else {
            setAutoPlay(false);
            return prev;
          }
        }
        return prev + 1;
      });
    }, autoPlaySpeed);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlaySpeed, loopMode]);

  const nextLetter = () => {
    setIndex((prev) => (prev + 1) % alphabetData.length);
  };

  const prevLetter = () => {
    setIndex((prev) => (prev - 1 + alphabetData.length) % alphabetData.length);
  };

  const handleAutoPlayToggle = () => {
    if (!autoPlay) {
      setIndex(0);
    }
    setAutoPlay((prev) => !prev);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-pink-50 px-2 py-2 md:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-5 items-start">
          {/* ABC CARD */}
          <div className="lg:col-span-2">
            <motion.div
              layout
              className="rounded-3xl bg-white/90 backdrop-blur-lg shadow-xl border border-white p-3 md:p-5"
            >
              {/* Top Nav */}
              <div className="flex justify-between items-center mb-3">
                <button
                  onClick={prevLetter}
                  className="rounded-2xl bg-orange-100 hover:bg-orange-200 p-2 shadow transition"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                </button>

                <div className="text-center">
                  <p className="text-[11px] md:text-sm text-gray-500">
                    Letter {index + 1} / 26
                  </p>
                  <p className="text-sm md:text-base font-bold text-gray-700">
                    Tap and Learn!
                  </p>
                </div>

                <button
                  onClick={nextLetter}
                  className="rounded-2xl bg-cyan-100 hover:bg-cyan-200 p-2 shadow transition"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-cyan-600" />
                </button>
              </div>

              {/* Letter Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.letter}
                  initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.92, rotate: 3 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-[1.8rem] bg-gradient-to-br ${current.color} px-3 py-5 md:px-6 md:py-8 text-white shadow-lg`}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [0, -4, 0], scale: [1, 1.02, 1] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                      className="text-[4rem] md:text-[7rem] font-black leading-none drop-shadow-lg"
                    >
                      {current.letter}
                    </motion.div>

                    <motion.div
                      animate={{ rotate: [0, -2, 2, 0] }}
                      transition={{ repeat: Infinity, duration: 2.2 }}
                      className="text-3xl md:text-6xl mt-1"
                    >
                      {current.emoji}
                    </motion.div>

                    <p className="mt-2 text-2xl md:text-4xl font-extrabold">
                      {current.word}
                    </p>

                    <p className="mt-1 text-sm md:text-xl font-semibold">
                      {current.letter} for {current.word}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={speakCurrent}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white px-2.5 py-2 font-bold shadow text-xs md:text-sm transition"
                >
                  <Volume2 className="w-4 h-4" />
                  Speak
                </button>

                <button
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={`rounded-2xl px-2.5 py-2 font-bold shadow text-xs md:text-sm transition ${
                    autoSpeak ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Voice {autoSpeak ? "ON" : "OFF"}
                </button>

                <button
                  onClick={handleAutoPlayToggle}
                  className={`flex items-center justify-center gap-1.5 rounded-2xl px-2.5 py-2 font-bold shadow text-xs md:text-sm transition ${
                    autoPlay ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {autoPlay ? "Playing" : "Auto Play"}
                </button>

                <button
                  onClick={() => {
                    setIndex(0);
                    setAutoPlay(false);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-2 font-bold shadow text-xs md:text-sm transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset A
                </button>
              </div>

              {/* Speed + Loop */}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-white border border-gray-200 px-3 py-2 shadow-sm">
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 mb-1">
                    Speed
                  </p>
                  <select
                    value={autoPlaySpeed}
                    onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
                    className="w-full bg-transparent outline-none text-xs md:text-sm font-bold text-gray-700"
                  >
                    <option value={2000}>2 sec</option>
                    <option value={3000}>3 sec</option>
                    <option value={5000}>5 sec</option>
                  </select>
                </div>

                <button
                  onClick={() => setLoopMode(!loopMode)}
                  className={`rounded-2xl px-3 py-2 font-bold shadow text-xs md:text-sm transition ${
                    loopMode ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  Loop {loopMode ? "ON" : "OFF"}
                </button>
              </div>
            </motion.div>
          </div>

          {/* CLEAN PROFILE CARD */}
          <div className="lg:sticky lg:top-4">
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl bg-white/90 backdrop-blur-lg shadow-xl border border-white p-3 md:p-4 overflow-hidden"
            >
              {/* Name Input Only */}
              <input
                value={kidName}
                onChange={(e) => setKidName(e.target.value)}
                placeholder="Enter kid name"
                className="w-full mb-4 rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300 text-base"
              />

              {/* Profile Card */}
              <div className="relative rounded-[2rem] bg-gradient-to-br from-pink-50 via-white to-cyan-50 border border-pink-100 p-4 shadow-inner">
                {/* Decorative Dots */}
                <div className="absolute top-4 right-5 w-3 h-3 rounded-full bg-pink-200" />
                <div className="absolute bottom-6 left-5 w-2.5 h-2.5 rounded-full bg-cyan-200" />

                {/* Circle Photo */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300 to-cyan-300 blur-md opacity-40 scale-105" />
                    <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full p-2 bg-gradient-to-br from-pink-300 via-pink-200 to-cyan-200 shadow-lg">
                      <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                        <img
                          src={defaultKidImage}
                          alt="Kid profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name Badge */}
                <div className="mt-5 flex justify-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md border border-pink-100">
                    <span className="text-lg">⭐</span>
                    <span className="font-extrabold text-sm md:text-lg text-pink-600">
                      {kidName || "My Little Star"}
                    </span>
                    <span className="text-lg">⭐</span>
                  </div>
                </div>

                {/* Subtitle */}
                <p className="mt-4 text-center text-sm md:text-base font-semibold text-gray-500">
                  Smile • Learn • Grow 🌈
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
