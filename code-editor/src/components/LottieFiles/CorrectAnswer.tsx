import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";
import correctAnswer from "../LottieJsonFiles/CorrectLottie.json";
export default function CorrectAnswer() {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container.current) {
      const animation: AnimationItem = lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: correctAnswer,
      });

      // Other animations configuration or control logic can be added here

      return () => {
        animation.destroy(); // Clean up animation when the component unmounts
      };
    }
  }, []);
  return (
    <div>
      <div ref={container}></div>
    </div>
  );
}
