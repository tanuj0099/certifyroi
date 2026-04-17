import React from 'react';

const LandingHero = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      
      {/* BACKGROUND & GRADIENTS */}
      {/* Toned down gradients: Light mode blends to white, Dark to black */}
      <div className="absolute inset-0 z-0 bg-[url('/path-to-your-mountain-image.jpg')] bg-cover bg-center" />
      
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-white/60 to-white dark:via-black/40 dark:to-black" />

      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
        
        {/* TEXT WITH SHADOW FOR READABILITY ON MOUNTAIN */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white mb-6">
          Your next cert is either a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-500 drop-shadow-sm">
            goldmine
          </span>{" "}
          or a{" "}
          <span className="text-gray-400 dark:text-gray-500 drop-shadow-md">
            mistake.
          </span>
        </h1>

        {/* CERT IMAGE WITH AURA & PERSONALITY */}
        {/* animate-float adds the gentle movement. shadow-[...] adds the gold glow. */}
        <div className="relative my-12 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          {/* Replace src with your actual cert image path */}
          <img 
            src="/path-to-cert-image.png" 
            alt="Certification" 
            className="relative w-64 h-64 object-cover rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.6)] animate-float border-2 border-white/10" 
          />
        </div>

        {/* CAPSULE BUTTON */}
        {/* rounded-full makes it a pill/capsule shape */}
        <button className="mt-8 px-12 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold tracking-wide hover:scale-105 transition-transform shadow-lg">
          CALCULATE ROI
        </button>

      </div>
    </section>
  );
};

export default LandingHero;