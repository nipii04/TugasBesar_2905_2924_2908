import React from 'react';
import { Waves, Anchor, Globe, Users, Award, MapPin, Mail, Phone, LogIn } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-mono selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <Waves className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider">OCEANLINK</h1>
            <p className="text-[10px] text-zinc-500 tracking-widest">LOGISTICS</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-purple-500 hover:bg-purple-400 transition-all text-white text-sm font-semibold rounded-md shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]">
          <LogIn className="w-4 h-4" />
          SIGN IN
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center pt-24 pb-16 px-4">
        <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 mb-8 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
          <Waves className="w-12 h-12 text-purple-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider">OCEANLINK LOGISTICS</h1>
        <p className="text-purple-400 font-semibold tracking-widest mb-6">GLOBAL MARITIME SOLUTIONS</p>
        <p className="max-w-2xl text-zinc-400 text-sm leading-relaxed mb-10">
          Pioneering the future of maritime logistics with advanced fleet management, real-time tracking, and intelligent route optimization across global waters.
        </p>
        <button className="px-8 py-3 bg-purple-500 hover:bg-purple-400 transition-all text-white font-semibold rounded-md shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)]">
          ACCESS FLEET COMMAND
        </button>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Anchor, value: "150+", label: "ACTIVE VESSELS" },
            { icon: Globe, value: "80+", label: "COUNTRIES SERVED" },
            { icon: Users, value: "2,500+", label: "CREW MEMBERS" },
            { icon: Award, value: "25+", label: "YEARS EXPERIENCE" }
          ].map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-8 bg-[#111114] border border-zinc-800/50 rounded-xl hover:border-purple-500/30 transition-colors">
              <stat.icon className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-xs text-zinc-500 tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About & Mission Section */}
      <section className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* About Us */}
        <div>
          <h2 className="text-2xl font-bold mb-6">About Us</h2>
          <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
            <p>OceanLink Logistics is a leading maritime logistics company specializing in ocean freight, vessel management, and supply chain solutions. Since 2001, we have been connecting continents through efficient and reliable shipping services.</p>
            <p>Our state-of-the-art fleet monitoring system enables real-time tracking, predictive maintenance, and optimized routing, ensuring cargo arrives safely and on schedule across all major trade routes.</p>
            <p>With a commitment to sustainability and innovation, we leverage cutting-edge technology to minimize environmental impact while maximizing operational efficiency.</p>
          </div>
        </div>

        {/* Our Mission */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
          <div className="p-8 bg-[#111114] border border-purple-500/20 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.05)] h-full">
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              To provide world-class maritime logistics solutions through innovation, reliability, and operational excellence, connecting global markets with precision and care.
            </p>
            <ul className="space-y-3 text-sm text-zinc-300">
              {[
                "SAFETY FIRST",
                "ENVIRONMENTAL RESPONSIBILITY",
                "OPERATIONAL EXCELLENCE",
                "CUSTOMER SATISFACTION"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.8)]"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Ocean Freight", desc: "Full container load (FCL) and less than container load (LCL) services worldwide" },
            { title: "Fleet Management", desc: "Real-time monitoring, maintenance scheduling, and performance optimization" },
            { title: "Route Planning", desc: "AI-powered route optimization for fuel efficiency and timely deliveries" }
          ].map((service, index) => (
            <div key={index} className="p-8 bg-[#111114] border border-zinc-800/50 rounded-xl hover:border-purple-500/30 transition-colors">
              <h3 className="font-bold text-lg mb-3">{service.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-8 py-16 mb-12">
        <div className="p-10 bg-[#111114] border border-zinc-800/50 rounded-xl">
          <h2 className="text-2xl font-bold mb-10 text-center">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <MapPin className="w-6 h-6 text-purple-400 shrink-0" />
              <div>
                <h4 className="font-bold mb-2">Headquarters</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Port Maritime Complex<br />Jakarta, Indonesia 14450</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="w-6 h-6 text-purple-400 shrink-0" />
              <div>
                <h4 className="font-bold mb-2">Email</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">info@oceanlink-logistics.com<br />support@oceanlink-logistics.com</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="w-6 h-6 text-purple-400 shrink-0" />
              <div>
                <h4 className="font-bold mb-2">Phone</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">+62 21 5555 1234<br />24/7 Emergency Hotline</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}