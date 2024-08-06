import Image from "next/image";

import bgImage from "./bg.png";

export default function LandingPage() {
  return (
    <div className="relative">
      <div className="fixed top-[0] z-[-1] h-[120px] w-full bg-gradient-to-b from-black"></div>
      <Image
        className="absolute top-[0] z-[-2] w-full opacity-100"
        src={bgImage}
        alt=""
      />
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <div className="grow"></div>
        <div className="h-[70px] w-[700px] bg-white/70"></div>
        <div className="h-[40px] w-[500px] bg-white/70"></div>
        <div className="grow"></div>
        <div className="h-[400px] w-[900px]  bg-white/70"></div>
      </div>
    </div>
  );
}
