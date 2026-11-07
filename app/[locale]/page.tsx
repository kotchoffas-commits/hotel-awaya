import Hero from '@/components/sections/Hero';
import WhyUs from '@/components/sections/WhyUs';
import FeaturedRooms from '@/components/sections/FeaturedRooms';
import Testimonials from '@/components/sections/Testimonials';

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyUs />
      <FeaturedRooms />
      <Testimonials />
    </>
  );
}