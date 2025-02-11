// // Slider.tsx
// import { FixedSizeList as List } from "react-window";
// import { useSpring, animated } from "react-spring";
// import dynamic from "next/dynamic";

// // Dynamically import SliderItem component
// const SliderItem = dynamic(() => import("./SliderItem"), { ssr: false });

// interface SliderProps {
//   items: string[]; // Ensure 'items' prop is required
//   children: React.ReactNode; // Accept children as prop
// }

// const Slider = ({ items, children }: SliderProps) => {
//   const animationProps = useSpring({
//     opacity: 1,
//     from: { opacity: 0 },
//     reset: true,
//     reverse: false,
//     config: { tension: 250, friction: 25 },
//   });

//   return (
//     <animated.div style={animationProps} className="relative w-full max-w-3xl mx-auto">

//     </animated.div>
//   );
// };

// export default Slider;
