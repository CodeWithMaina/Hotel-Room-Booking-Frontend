import { Footer } from "../components/Footer"
import { FeaturedRooms } from "../components/home/FeaturedHotels"
import { Hero } from "../components/home/Hero"
import { Newsletter } from "../components/home/Newsletter"
import { Testimonials } from "../components/home/Testimonials"
import NavBar from "../components/NavBar"

export const Home = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <FeaturedRooms />
      {/* <WhyChooseUs /> */}
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  )
}
