import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import your 9 static images
import image1 from '../assest/category/image1.png';
import image2 from '../assest/category/image2.png';
import image3 from '../assest/category/image3.png';
import image4 from '../assest/category/image4.png';
import image5 from '../assest/category/image5.png';
import image6 from '../assest/category/image6.png';
import image7 from '../assest/category/image7.png';
import image8 from '../assest/category/image8.png';
import image9 from '../assest/category/image9.png';

const SCALE = 1.75;
const DISTANCE = 110;
const NUDGE = 40;
const SPRING = {
  mass: 0.1,
  stiffness: 170,
  damping: 12,
};

const staticCategories = [
  { category: 'Alfa Romeo', image: image1 },
  { category: 'Aston Martin', image: image2 },
  { category: 'Bugatti', image: image3 },
  { category: 'Maserati', image: image4 },
  { category: 'Mclaren', image: image5 },
  { category: 'Rolls Royce', image: image6 },
  { category: 'Tesla', image: image7 },
  { category: 'bentley', image: image8 },
  { category: 'ferrari', image: image9 },
];

const CategoryList = () => {
  const mouseLeft = useMotionValue(-Infinity);
  const mouseRight = useMotionValue(-Infinity);
  const left = useTransform(mouseLeft, [0, 40], [0, -40]);
  const right = useTransform(mouseRight, [0, 40], [0, -40]);
  const leftSpring = useSpring(left, SPRING);
  const rightSpring = useSpring(right, SPRING);
  const scrollContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="container mx-auto p-4 relative">
      <motion.div
        ref={scrollContainerRef}
        onMouseMove={!isMobile ? (e) => {
          const { left, right } = e.currentTarget.getBoundingClientRect();
          const offsetLeft = e.clientX - left;
          const offsetRight = right - e.clientX;
          mouseLeft.set(offsetLeft);
          mouseRight.set(offsetRight);
        } : undefined}
        onMouseLeave={!isMobile ? () => {
          mouseLeft.set(-Infinity);
          mouseRight.set(-Infinity);
        } : undefined}
        className="flex items-center gap-3 md:gap-4 overflow-x-auto scrollbar-none relative px-8 md:px-0 w-full"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <motion.div
          className="absolute rounded-2xl inset-y-0 -z-10"
          style={{ left: leftSpring, right: rightSpring }}
        />

        <div className="flex items-center gap-3 md:gap-4 flex-nowrap min-w-max">
          {staticCategories.map((category, index) => (
            <AppIcon key={index} mouseLeft={mouseLeft} category={category} isMobile={isMobile} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

function AppIcon({ mouseLeft, category, isMobile }) {
  const ref = useRef(null);
  
  // Desktop-only animations
  const distance = useTransform(() => {
    if (isMobile) return 0;
    const bounds = ref.current
      ? { x: ref.current.offsetLeft, width: ref.current.offsetWidth }
      : { x: 0, width: 0 };
    return mouseLeft.get() - bounds.x - bounds.width / 2;
  });

  const scale = useTransform(distance, [-DISTANCE, 0, DISTANCE], isMobile ? [1, 1, 1] : [1, SCALE, 1]);
  const x = useTransform(() => {
    if (isMobile) return 0;
    const d = distance.get();
    if (d === -Infinity) return 0;
    if (d < -DISTANCE || d > DISTANCE) return Math.sign(d) * -1 * NUDGE;
    return (-d / DISTANCE) * NUDGE * scale.get();
  });

  const scaleSpring = useSpring(scale, SPRING);
  const xSpring = useSpring(x, SPRING);
  const y = useMotionValue(0);

  return (
    <motion.div
      ref={ref}
      style={{ 
        x: isMobile ? 0 : xSpring,
        scale: isMobile ? 1 : scaleSpring,
        y,
        scrollSnapAlign: 'start' 
      }}
      className="flex flex-col items-center gap-3 cursor-pointer flex-shrink-0"
    >
      <Link
        to={`/product-category?category=${category.category}`}
        className="w-20 h-20 md:w-32 md:h-32 overflow-hidden flex items-center justify-center"
      >
        <img
          src={category.image}
          alt={category.category}
          className="h-full w-full object-cover object-center"
          style={{ objectFit: 'contain', objectPosition: 'center' }}
        />
      </Link>
    </motion.div>
  );
}

export default CategoryList;