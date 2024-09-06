import { useEffect, useState } from 'react';

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY > 200 && window.scrollY < totalHeight - 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleScroll = () => {
      toggleVisibility();

      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const percentageScrolled = (scrollPosition / totalHeight) * 100;
      setScrollPercentage(percentageScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed bottom-10 right-10 z-50 transition-opacity duration-1000 ease-in-out"
      style={{
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      <div className="relative size-12">
        <div
          className="absolute inset-0 z-10 scale-[1.15] rounded-full"
          style={{
            background: `conic-gradient(rgba(242, 135, 13, 1) 0% ${scrollPercentage}%, transparent ${scrollPercentage}% 100%)`,
          }}
        ></div>

        <button
          onClick={scrollToTop}
          className="relative z-20 flex size-12 items-center justify-center rounded-full bg-blue-800 text-white"
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default ScrollToTopButton;
