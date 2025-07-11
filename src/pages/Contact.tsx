import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, ChevronDown } from "lucide-react";
import Navbar from "../components/NavBar";
import { Footer } from "../components/Footer";

export const Contact: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1579154204601-01588f351e80?q=80&w=1200&auto=format&fit=crop')",
          }}
        />
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-10 text-white">
          {/* Heading */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 drop-shadow">
              Let's Talk <br />
              <span className="text-yellow-400">Get In Touch</span>
            </h1>
            <p className="text-lg text-white/90 mt-4 max-w-md">
              Whether you're planning your next getaway, have a question, or
              just want to say hi — we’d love to hear from you.
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="flex-1 w-full max-w-md"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <form className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl space-y-5 text-slate-900">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg bg-white/60 border border-white/50 text-slate-900 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg bg-white/60 border border-white/50 text-slate-900 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div className="relative">
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/60 border border-white/50 text-slate-900 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>

        {/* Scroll button */}
        <motion.button
          onClick={handleScroll}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 text-yellow-400 hover:text-yellow-300 transition"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
      </div>

      {/* Contact Info Section */}
      <div
        ref={scrollRef}
        className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center px-6 py-20 text-slate-900 text-center"
      >
        <h2 className="text-4xl font-bold mb-6">Our Contact Info</h2>
        <div className="space-y-4 max-w-xl">
          <p className="flex items-center justify-center gap-3 text-lg">
            <MapPin className="w-5 h-5 text-yellow-500" />
            Nairobi, Kenya
          </p>
          <p className="flex items-center justify-center gap-3 text-lg">
            <Mail className="w-5 h-5 text-yellow-500" />
            support@luxhotel.com
          </p>
          <p className="flex items-center justify-center gap-3 text-lg">
            <Phone className="w-5 h-5 text-yellow-500" />
            +254 712 345 678
          </p>
        </div>
      </div>
      <Footer/>
    </>
  );
};
