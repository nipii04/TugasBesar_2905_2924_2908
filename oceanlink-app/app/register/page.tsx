"use client";

import Link from "next/link";
import { ArrowLeft, Waves, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: ""
  });
  
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic Validation
    if (!formData.name || !formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields marked with *.");
      return;
    }
    
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Simulate API registration success
    setIsSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };
  return (
    <div className="min-h-screen bg-[#09090c] text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden font-mono sm:font-sans">
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>BACK</span>
        </Link>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-[600px] z-10 flex flex-col items-center mt-12 mb-12">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8 relative">
          <div className="absolute inset-0 bg-[#a155f7] rounded-full blur-[60px] opacity-20 w-32 h-32 mx-auto"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-[#14121a] border border-[#a155f7]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(161,85,247,0.3)]">
            <Waves className="text-[#b16ff9]" size={32} />
          </div>
          
          <h1 className="text-3xl font-bold tracking-widest text-[#f0f0f0] mb-2 font-mono">
            CREATE ACCOUNT
          </h1>
          <p className="text-[#6c6d75] tracking-[0.2em] text-xs font-semibold">
            JOIN OCEANLINK LOGISTICS
          </p>
        </div>

        {/* Form Container with Glow Behind */}
        <div className="relative w-full">
          {/* Subtle large glow behind the form */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-[#a155f7]/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative bg-[#111115]/80 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl z-10 w-full">
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-mono">
                  <AlertCircle size={16} className="shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Success Message */}
              {isSuccess && (
                <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-bold font-mono tracking-wide">
                  <CheckCircle2 size={18} className="shrink-0" />
                  <p>Akun berhasil dibuat! Mengalihkan ke login...</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe" 
                    className="w-full bg-[#1b1c23] border border-transparent focus:border-[#a155f7]/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                  />
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com" 
                    className="w-full bg-[#1b1c23] border border-transparent focus:border-[#a155f7]/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                  />
                </div>
                
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="johndoe" 
                    className="w-full bg-[#1b1c23] border border-transparent focus:border-[#a155f7]/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                  />
                </div>
                
                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+62 812 3456 7890" 
                    className="w-full bg-[#1b1c23] border border-transparent focus:border-[#a155f7]/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                  Company Name
                </label>
                <input 
                  type="text" 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="Your Company Ltd." 
                  className="w-full bg-[#1b1c23] border border-transparent focus:border-[#a155f7]/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Min. 6 characters" 
                    className="w-full bg-[#1b1c23] border border-transparent focus:border-[#a155f7]/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                  />
                </div>
                
                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Re-enter password" 
                    className="w-full bg-[#1b1c23] border border-transparent focus:border-[#a155f7]/50 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSuccess}
                  className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#ab5ff7] to-[#923af0] hover:from-[#b975fb] hover:to-[#a14df7] text-white font-bold tracking-widest text-sm py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(161,85,247,0.4)] hover:shadow-[0_0_30px_rgba(161,85,247,0.6)]"
                >
                  CREATE ACCOUNT
                </button>
              </div>

              <div className="text-center pt-4 border-t border-white/5 mt-6 pb-2">
                <p className="text-xs text-gray-500 font-medium">
                  Already have an account? <Link href="/login" className="text-[#b16ff9] hover:text-white transition-colors ml-1 font-semibold">Sign In</Link>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
