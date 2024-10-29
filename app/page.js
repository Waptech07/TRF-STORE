import Image from "next/image";
import { GiBilledCap, GiTrousers } from "react-icons/gi";
import { FaUser, FaLock, FaShoePrints, FaTshirt } from "react-icons/fa";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-blue-500 to-purple-600 relative">
      <main className="flex flex-col gap-8 row-start-2 justify-center items-center">
        <h1 className="text-5xl font-serif text-white p-5 shadow-lg text-center">
          TRF - The Right Fit
        </h1>
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 shadow-md transform hover:scale-105 duration-200"
          href="/login"
        >
          <FaUser className="text-lg" />
          Login
        </a>
      </main>
      {/* Floating icons */}
      <div className="absolute bottom-10 right-10 text-white text-3xl animate-bounce">
        <GiTrousers />
      </div>
      <div className="absolute top-10 left-10 text-white text-3xl animate-bounce">
        <GiBilledCap />
      </div>
      <div className="absolute top-10 right-10 text-white text-3xl animate-bounce">
        <FaTshirt />
      </div>
      <div className="absolute bottom-10 left-10 text-white text-3xl animate-bounce">
        <FaShoePrints />
      </div>
    </div>
  );
}
