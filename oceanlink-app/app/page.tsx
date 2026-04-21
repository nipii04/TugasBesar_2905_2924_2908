"use client";

import React, { useState, useEffect } from 'react';
import { Waves, Anchor, Globe, Users, Award, MapPin, Mail, Phone, LogIn, Home, Package, Calculator, UserPlus, FileText } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-mono selection:bg-purple-500/30 overflow-x-hidden pt-20 sm:pt-24">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-zinc-800/50 transition-all duration-300">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 cursor-pointer">
            <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold tracking-wider text-white">OCEANLINK</h1>
              <p className="text-[8px] sm:text-[10px] text-zinc-500 tracking-widest uppercase font-semibold">Primelog Fleet</p>
            </div>
          </Link>

          {/* Center Menu - Sekarang menggunakan Link agar bisa diklik */}
          <div className="hidden lg:flex items-center gap-2 text-[10px] font-semibold tracking-widest text-zinc-400">
            {/* Tombol Home sedang aktif di halaman ini */}
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-md border border-purple-500/20">
              <Home className="w-3 h-3" />
              HOME
            </button>
            <Link href="/track" className="flex items-center gap-2 px-4 py-2 hover:text-white transition-colors">
              <Package className="w-3 h-3" />
              TRACK SHIPMENT
            </Link>
            <Link href="/calculator" className="flex items-center gap-2 px-4 py-2 hover:text-white transition-colors">
              <Calculator className="w-3 h-3" />
              PRICE CALCULATOR
            </Link>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {userRole ? (
               <div className="flex items-center gap-2 sm:gap-4">
                 <Link href={userRole === "Pelanggan" ? "/track" : "/dashboard"} className="hidden sm:flex items-center gap-2 px-4 py-2 border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-all text-xs font-semibold rounded-md">
                   <FileText className="w-3 h-3" />
                   DASHBOARD
                 </Link>
                 <button onClick={() => { localStorage.removeItem('userRole'); setUserRole(''); window.location.reload(); }} className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs font-semibold rounded-md">
                   SIGN OUT
                 </button>
               </div>
            ) : (
              <>
                <Link href="/register" className="hidden sm:flex items-center gap-2 px-4 py-2 border border-purple-500/30 hover:bg-purple-500/10 transition-all text-white text-xs sm:text-sm font-semibold rounded-md">
                  <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                  SIGN UP
                </Link>
                <Link href="/login" className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-purple-500 hover:bg-purple-400 transition-all text-white text-xs sm:text-sm font-semibold rounded-md shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]">
                  <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">SIGN IN</span>
                  <span className="sm:hidden">LOGIN</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center pt-8 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="p-3 sm:p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 mb-6 sm:mb-8 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
          <Waves className="w-8 h-8 sm:w-12 sm:h-12 text-purple-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 tracking-wider leading-tight">
          OCEANLINK LOGISTICS
        </h1>
        <p className="text-sm sm:text-base text-purple-400 font-semibold tracking-widest mb-6">
          GLOBAL MARITIME SOLUTIONS
        </p>
        <p className="max-w-2xl text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed mb-8 sm:mb-10 px-2">
          Pioneering the future of maritime logistics with advanced fleet management, real-time tracking, and intelligent route optimization across global waters.
        </p>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: Anchor, value: "150+", label: "ACTIVE VESSELS" },
            { icon: Globe, value: "80+", label: "COUNTRIES SERVED" },
            { icon: Users, value: "2,500+", label: "CREW MEMBERS" },
            { icon: Award, value: "25+", label: "YEARS EXPERIENCE" }
          ].map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-6 sm:p-8 bg-[#111114] border border-zinc-800/50 rounded-xl hover:border-purple-500/30 transition-colors">
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mb-3 sm:mb-4" />
              <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{stat.value}</h3>
              <p className="text-[10px] sm:text-xs text-zinc-500 tracking-widest text-center">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About & Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">About Us</h2>
          <div className="space-y-4 text-zinc-400 text-xs sm:text-sm leading-relaxed">
            <p>OceanLink Logistics is a leading maritime logistics company specializing in ocean freight, vessel management, and supply chain solutions. Since 2001, we have been connecting continents through efficient and reliable shipping services.</p>
            <p>Our state-of-the-art fleet monitoring system enables real-time tracking, predictive maintenance, and optimized routing, ensuring cargo arrives safely and on schedule across all major trade routes.</p>
            <p>With a commitment to sustainability and innovation, we leverage cutting-edge technology to minimize environmental impact while maximizing operational efficiency.</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Our Mission</h2>
          <div className="p-6 sm:p-8 bg-[#111114] border border-purple-500/20 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.05)] h-full">
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
              To provide world-class maritime logistics solutions through innovation, reliability, and operational excellence, connecting global markets with precision and care.
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-300">
              {[
                "SAFETY FIRST",
                "ENVIRONMENTAL RESPONSIBILITY",
                "OPERATIONAL EXCELLENCE",
                "CUSTOMER SATISFACTION"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.8)] shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            { title: "Ocean Freight", desc: "Full container load (FCL) and less than container load (LCL) services worldwide" },
            { title: "Fleet Management", desc: "Real-time monitoring, maintenance scheduling, and performance optimization" },
            { title: "Route Planning", desc: "AI-powered route optimization for fuel efficiency and timely deliveries" }
          ].map((service, index) => (
            <div key={index} className="p-6 sm:p-8 bg-[#111114] border border-zinc-800/50 rounded-xl hover:border-purple-500/30 transition-colors">
              <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">{service.title}</h3>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 mb-8 sm:mb-12">
        <div className="p-6 sm:p-10 bg-[#111114] border border-zinc-800/50 rounded-xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-xl sm:text-2xl font-bold mb-8 sm:mb-10 text-center relative z-10">Contact Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            <div className="flex gap-3 sm:gap-4">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">Headquarters</h4>
                <p className="text-[10px] sm:text-xs text-zinc-500 leading-relaxed">Port Maritime Complex<br />Jakarta, Indonesia 14450</p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">Email</h4>
                <p className="text-[10px] sm:text-xs text-zinc-500 leading-relaxed break-all">info@oceanlink-logistics.com<br />support@oceanlink-logistics.com</p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">Phone</h4>
                <p className="text-[10px] sm:text-xs text-zinc-500 leading-relaxed">+62 21 5555 1234<br />24/7 Emergency Hotline</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}