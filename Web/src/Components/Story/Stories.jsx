import React, { useRef, useState, useEffect } from "react";
import StoryCard from "./StoryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Stories({ stories }) {
  const scrollRef = useRef();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    checkScroll();
  }, [stories]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
    const scrollAmount =
      direction === "left"
        ? Math.max(0, scrollLeft - clientWidth / 2)
        : Math.min(scrollLeft + clientWidth / 2, scrollWidth - clientWidth);
    scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="relative w-[100%] px-2 py-4">
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex space-x-3 overflow-x-auto overflow-y-hidden scrollbar-hide w-full"
      >
        <StoryCard isCreate />
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow z-20 hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow z-20 hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}
    </div>
  );
}
