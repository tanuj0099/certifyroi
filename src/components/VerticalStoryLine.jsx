import React from 'react';

const VerticalStoryLine = () => {
  const storyItems = [
    "ANALYSIS COMPLETE",
    "ROUTE OPTIMIZED",
    "ROI CONFIRMED",
    "FUTURE SECURED",
    "GOLDMINE DETECTED"
  ];

  // Duplicate items to create seamless infinite scroll effect
  const scrollItems = [...storyItems, ...storyItems, ...storyItems];

  return (
    <div className="fixed right-6 top-0 h-full hidden lg:flex items-center z-50 pointer-events-none select-none">
      <div 
        className="flex flex-col items-center justify-center space-y-12 animate-scroll-vertical"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        {scrollItems.map((item, index) => (
          <span 
            key={index}
            className="text-xl font-medium tracking-[0.3em] text-gray-300 dark:text-gray-700/50 opacity-80"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default VerticalStoryLine;