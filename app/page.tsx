"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ImagePlus,
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
  const [kidImage, setKidImage] = useState<string | null>(null);
  const [kidName, setKidName] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(3000); // 2s / 3s / 5s
  const [loopMode, setLoopMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const current = alphabetData[index];

  // Load saved kid data
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedKidName = localStorage.getItem("abc_kid_name");
    const savedKidImage = localStorage.getItem("abc_kid_image");

    if (savedKidName) setKidName(savedKidName);
    if (savedKidImage) setKidImage(savedKidImage);

    setIsLoaded(true);
  }, []);

  // Save kid name
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("abc_kid_name", kidName);
  }, [kidName, isLoaded]);

  // Save kid image
  useEffect(() => {
    if (!isLoaded) return;

    if (kidImage) {
      localStorage.setItem("abc_kid_image", kidImage);
    } else {
      localStorage.removeItem("abc_kid_image");
    }
  }, [kidImage, isLoaded]);

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

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis?.getVoices();
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Auto speak on letter change
  useEffect(() => {
    if (autoSpeak) {
      const timer = setTimeout(() => {
        speakCurrent();
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [index, autoSpeak]);

  // Auto play logic
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setKidImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearKidProfile = () => {
    setKidName("");
    setKidImage(null);
    localStorage.removeItem("abc_kid_name");
    localStorage.removeItem("abc_kid_image");
  };

  const handleAutoPlayToggle = () => {
    if (!autoPlay) {
      setIndex(0); // Start from A
    }
    setAutoPlay((prev) => !prev);
  };

  return (
    <main className="min-h-screen px-2 py-2 md:px-6 bg-gradient-to-b from-cyan-50 via-white to-pink-50">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-5">
          {/* ABC Card */}
          <div className="lg:col-span-2">
            <motion.div
              layout
              className="rounded-3xl bg-white/90 backdrop-blur-lg shadow-xl border border-white p-2.5 md:p-5"
            >
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={prevLetter}
                  className="rounded-2xl bg-orange-100 hover:bg-orange-200 p-2 shadow"
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
                  className="rounded-2xl bg-cyan-100 hover:bg-cyan-200 p-2 shadow"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-cyan-600" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.letter}
                  initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.92, rotate: 3 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-[1.8rem] bg-gradient-to-br ${current.color} px-3 py-4 md:px-6 md:py-6 text-white shadow-lg`}
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

                    <p className="mt-1.5 text-xl md:text-4xl font-extrabold">
                      {current.word}
                    </p>

                    <p className="mt-1 text-sm md:text-xl font-semibold">
                      {current.letter} for {current.word}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Buttons */}
              <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={speakCurrent}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white px-2.5 py-2.5 font-bold shadow text-xs md:text-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  Speak
                </button>

                <button
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={`rounded-2xl px-2.5 py-2.5 font-bold shadow text-xs md:text-sm ${
                    autoSpeak ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Voice {autoSpeak ? "ON" : "OFF"}
                </button>

                <button
                  onClick={handleAutoPlayToggle}
                  className={`flex items-center justify-center gap-1.5 rounded-2xl px-2.5 py-2.5 font-bold shadow text-xs md:text-sm ${
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
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-2.5 font-bold shadow text-xs md:text-sm"
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
                  className={`rounded-2xl px-3 py-2 font-bold shadow text-xs md:text-sm ${
                    loopMode ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  Loop {loopMode ? "ON" : "OFF"}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Kid Profile */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl bg-white/90 backdrop-blur-lg shadow-xl border border-white p-2.5 md:p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base md:text-xl font-extrabold text-gray-800">
                  Kid Profile 📸
                </h2>

                <button
                  onClick={clearKidProfile}
                  className="rounded-xl bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 text-[10px] md:text-xs font-bold"
                >
                  Clear
                </button>
              </div>

              <input
                value={kidName}
                onChange={(e) => setKidName(e.target.value)}
                placeholder="Enter kid name"
                className="w-full mb-2 rounded-2xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-300 text-xs md:text-sm"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white px-2 py-2.5 font-bold text-[11px] md:text-sm"
                >
                  <ImagePlus className="w-4 h-4" />
                  Upload
                </button>

                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white px-2 py-2.5 font-bold text-[11px] md:text-sm"
                >
                  <Camera className="w-4 h-4" />
                  Camera
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="mt-2">
                {kidImage ? (
                  <motion.div
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-3xl overflow-hidden shadow-lg border-4 border-pink-200 bg-white"
                  >
                    <img
                      src={kidImage}
                      alt="Kid uploaded"
                      className="w-full h-28 sm:h-32 md:h-52 object-cover"
                    />
                    <div className="p-2 text-center font-bold text-xs md:text-base text-pink-600">
                      {kidName || "My Little Star ⭐"}
                    </div>
                  </motion.div>
                ) : (
                  <div className="rounded-3xl border-2 border-dashed border-gray-300 h-24 sm:h-28 md:h-52 flex items-center justify-center text-center text-gray-500 p-2 text-[11px] md:text-sm">
                    Kid photo will show here
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
