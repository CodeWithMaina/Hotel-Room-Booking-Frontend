import { Footer } from "../components/Footer"
import { BrowseByDestination } from "../components/home/BrowseByDestination"
import { FeaturedHotels } from "../components/home/FeaturedHotels"
import { Hero } from "../components/home/Hero"
import { Newsletter } from "../components/home/Newsletter"
import { Testimonials } from "../components/home/Testimonials"
import { WhyChooseUs } from "../components/home/WhyChooseUs"
import NavBar from "../components/NavBar"

export const Home = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <FeaturedHotels />
      <BrowseByDestination />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  )
}
