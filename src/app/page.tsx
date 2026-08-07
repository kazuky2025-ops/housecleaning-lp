import Hero from "@/components/sections/Hero";
import Reasons from "@/components/sections/Reasons";
import Pricing from "@/components/sections/Pricing";
import BeforeAfter from "@/components/sections/BeforeAfter";
import OtherServices from "@/components/sections/OtherServices";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Reasons />
      <Pricing />
      <BeforeAfter />
      <OtherServices />
      <Testimonials />
      <Faq />
      <Contact />
    </>
  );
}
