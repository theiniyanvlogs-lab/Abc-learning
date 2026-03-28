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
  Pause
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const current = alphabetData[index];

  const speakText = (text: string) => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
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
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [index, autoSpeak]);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % alphabetData.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [autoPlay]);

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

  return (
    <main className="min-h-screen px-4 py-3 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - ABC Card */}
          <div className="lg:col-span-2">
            <motion.div
              layout
              className="rounded-3xl bg-white/80 backdrop-blur-lg shadow-2xl border border-white p-4 md:p-8"
            >
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={prevLetter}
                  className="rounded-2xl bg-orange-100 hover:bg-orange-200 p-3 shadow"
                >
                  <ChevronLeft className="w-6 h-6 text-orange-600" />
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-500">Letter {index + 1} / 26</p>
                  <p className="text-lg font-bold text-gray-700">Tap and Learn!</p>
                </div>

                <button
                  onClick={nextLetter}
                  className="rounded-2xl bg-cyan-100 hover:bg-cyan-200 p-3 shadow"
                >
                  <ChevronRight className="w-6 h-6 text-cyan-600" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.letter}
                  initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 8 }}
                  transition={{ duration: 0.4 }}
                  className={`rounded-[2rem] bg-gradient-to-br ${current.color} p-6 md:p-10 text-white shadow-xl`}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2.2 }}
                      className="text-[7rem] md:text-[10rem] font-black leading-none drop-shadow-lg"
                    >
                      {current.letter}
                    </motion.div>

                    <motion.div
                      animate={{ rotate: [0, -4, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="text-6xl md:text-8xl"
                    >
                      {current.emoji}
                    </motion.div>

                    <p className="mt-4 text-3xl md:text-5xl font-extrabold">
                      {current.word}
                    </p>

                    <p className="mt-2 text-lg md:text-2xl font-semibold">
                      {current.letter} for {current.word}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-5 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={speakCurrent}
                  className="flex items-center gap-2 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 font-bold shadow-lg"
                >
                  <Volume2 className="w-5 h-5" />
                  Speak
                </button>

                <button
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={`rounded-2xl px-5 py-3 font-bold shadow-lg ${
                    autoSpeak ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Auto Voice: {autoSpeak ? "ON" : "OFF"}
                </button>

                <button
                  onClick={() => setAutoPlay(!autoPlay)}
                  className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-bold shadow-lg ${
                    autoPlay ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {autoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {autoPlay ? "Auto Play: ON" : "Auto Play: OFF"}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Kid Profile */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl bg-white/80 backdrop-blur-lg shadow-xl border border-white p-5"
            >
              <h2 className="text-2xl font-extrabold text-gray-800 mb-4">Kid Profile 📸</h2>

              <input
                value={kidName}
                onChange={(e) => setKidName(e.target.value)}
                placeholder="Enter kid name"
                className="w-full mb-3 rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300"
              />

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 font-bold"
                >
                  <ImagePlus className="w-5 h-5" />
                  Upload from Computer / Gallery
                </button>

                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white px-4 py-3 font-bold"
                >
                  <Camera className="w-5 h-5" />
                  Open Phone Camera
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

              <div className="mt-5">
                {kidImage ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-3xl overflow-hidden shadow-lg border-4 border-pink-200 bg-white"
                  >
                    <img
                      src={kidImage}
                      alt="Kid uploaded"
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-3 text-center font-bold text-lg text-pink-600">
                      {kidName || "My Little Star ⭐"}
                    </div>
                  </motion.div>
                ) : (
                  <div className="rounded-3xl border-2 border-dashed border-gray-300 h-72 flex items-center justify-center text-center text-gray-500 p-4">
                    Upload a kid photo from computer, gallery, or phone camera
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
