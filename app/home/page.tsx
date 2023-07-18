import dynamic from "next/dynamic";
const Features = dynamic(() => import("./components/Features"));
const Footer = dynamic(() => import("./components/Footer"));
const Hero = dynamic(() => import("./components/Hero"));
const StartPublishing = dynamic(() => import("./components/StartPublishing"));

export default function LandingHome() {
  return (
    <div>
      <Hero />
      <Features />
      <StartPublishing />
      <Footer />
    </div>
  );
}
