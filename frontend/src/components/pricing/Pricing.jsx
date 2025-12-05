import React, { useRef, useEffect } from "react";
import { Heading } from "../layout/heading";
import { CircleCheck } from "lucide-react";
import { Button } from "../layout/button";
import { Card, CardContent, CardFooter } from "../layout/card";
import PageContainer from "../layout/page-container";
import FadeContent from "../animation/fade";
import { motion, useAnimation, useInView } from "framer-motion";
import { staggeredPop } from "../../mock";

const plans = [
  {
    name: "Starter Plan",
    price: "19",
    features: [
      "Up to 2 hours of AI-generated audio or video",
      "Access to standard voice agents",
      "Script editing and instant updates",
      "Publish to major platforms"
    ]
  },
  {
    name: "Creator Plan",
    price: "49",
    features: [
      "Up to 10 hours of AI-generated content",
      "Unlimited voice agent selection and cloning",
      "Team collaboration features",
      "Priority email support"
    ]
  },
  {
    name: "Pro Plan",
    price: "99",
    features: [
      "Unlimited content creation",
      "Advanced voice cloning & multi-language support",
      "Premium analytics and audience insights",
      "Dedicated customer success manager"
    ]
  }
];

const Pricing = () => {
const showRef = useRef(null);
const isInView = useInView(showRef, { amount: 0.1, once: false });
const mainControls = useAnimation();
const hasAnimated = useRef(false);

useEffect(() => {
  if (isInView) {
    mainControls.start("animate");
    hasAnimated.current = true;
  }
}, [isInView, mainControls]);

// Fallback: ensure cards are visible after a short delay if animation hasn't triggered
useEffect(() => {
  const timer = setTimeout(() => {
    if (!hasAnimated.current) {
      mainControls.start("animate");
      hasAnimated.current = true;
    }
  }, 500);
  return () => clearTimeout(timer);
}, [mainControls]);



  return (
    <PageContainer>
      <div className="space-y-10 w-full" ref={showRef}>
  <FadeContent blur duration={1000} easing="ease-out" initialOpacity={0}>
    <Heading size="large" title="Simple, Transparent Pricing" />
  </FadeContent>

  <div className="grid grid-cols-1 gap-8 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:gap-10 w-full">
    {plans.map((plan, idx) => (
      <motion.div
        key={idx}
        variants={staggeredPop}
        initial="initial"
        animate={mainControls}
        custom={idx}
        className="w-full"
      >
        <Card className="
          rounded-[32px] p-6 
          bg-white/10
          border border-white/20
          text-white 
          backdrop-blur-lg
          flex flex-col justify-between 
          h-full
          w-full
        ">
          <CardContent className="flex flex-col gap-6 flex-1 p-0">

            <div className="
              bg-[radial-gradient(80.69%_99.7%_at_50%_0.04%,_#0C4230_0%,_#000000_100%)]
              h-[160px] sm:h-[190px]
              w-full 
              rounded-[32px] 
              flex flex-col justify-center items-center
            ">
              <h1 className="font-normal sm:text-2xl text-xl">{plan.name}</h1>

              <p className="py-6 mt-4">
                <span className="text-6xl font-bold">${plan.price}</span>
                <span className="text-5xl font-normal text-[#BDBDBD]">/</span>
                <span className="text-[#BDBDBD] font-normal">month</span>
              </p>
            </div>

            <div>
              {plan.features.map((feat, i) => (
                <div key={i} className="flex gap-4 border-b border-[#DEDEDE]/50 py-4 items-center">
                  <CircleCheck />
                  <p className="font-medium sm:text-lg text-sm 2xl:text-xl">
                    {feat}
                  </p>
                </div>
              ))}
            </div>

          </CardContent>

          <CardFooter className="pt-4">
            <Button className="magic-btn w-full" variant="alpha">
              Get Started
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    ))}
  </div>
</div>

    </PageContainer>
  );
};

export default Pricing;
