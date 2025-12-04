import { useRef, useEffect, useState } from "react";

const FadeContent = ({
  children,
  blur = true,
  duration = 1500,
  easing = "ease-in-out",
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  className = "",
  once = false,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setInView(true), delay);
          if (once && ref.current) observer.unobserve(ref.current);
        } else {
          if (!once) setInView(false);
        }
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold, delay, once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : initialOpacity,
        transition: `opacity ${duration}ms ${easing}, filter ${duration}ms ${easing}`,
        filter: blur ? (inView ? "blur(0px)" : "blur(10px)") : "none",
      }}
    >
      {children}
    </div>
  );
};

export default FadeContent;
