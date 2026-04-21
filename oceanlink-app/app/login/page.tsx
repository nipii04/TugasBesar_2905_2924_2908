"use client";

import Link from "next/link";
import { ArrowLeft, Waves } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error list
    const roleValue = username.toLowerCase();
    
    if (roleValue === "admin" && password === "admin123") {
      localStorage.setItem("userRole", "Admin");
      router.push("/dashboard");
    } else if ((roleValue === "fleet" || roleValue === "fleet superintendent") && password === "fleet123") {
      localStorage.setItem("userRole", "Fleet Superintendent");
      router.push("/dashboard");
    } else if ((roleValue === "pelanggan" || roleValue === "customer") && password === "pelanggan123") {
      localStorage.setItem("userRole", "Pelanggan");
      // Pelanggan diarahkan ke halaman track shipment
      router.push("/track");
    } else {
      // Tampilkan error jika kredensial tidak sesuai
      setError("Akun atau kata sandi tidak ditemukan");
    }
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
      <div className="w-full max-w-[480px] z-10 flex flex-col items-center">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8 relative">
          <div className="absolute inset-0 bg-[#a155f7] rounded-full blur-[60px] opacity-20 w-32 h-32 mx-auto"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-[#14121a] border border-[#a155f7]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(161,85,247,0.3)]">
            <Waves className="text-[#b16ff9]" size={32} />
          </div>
          
          <h1 className="text-3xl font-bold tracking-widest text-[#f0f0f0] mb-2 font-mono text-center">
            OCEANLINK LOGISTICS
          </h1>
          <p className="text-[#6c6d75] tracking-[0.2em] text-xs font-semibold text-center uppercase">
            Primelog Fleet Command
          </p>
        </div>

        {/* Form Container with Glow Behind */}
        <div className="relative w-full">
          {/* Subtle large glow behind the form */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-[#a155f7]/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative bg-[#111115]/80 backdrop-blur-xl border border-white/5 p-6 sm:p-8 rounded-2xl shadow-2xl z-10 w-full">
            
            <form className="space-y-6" onSubmit={handleLogin}>
              
              {/* Username */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-300 uppercase">
                  Username
                </label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username" 
                  className="w-full bg-[#1b1c23] border border-transparent focus:border-[#a155f7]/50 rounded-lg px-4 py-3.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-300 uppercase">
                  Password
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password" 
                  className="w-full bg-[#1b1c23] border border-transparent focus:border-[#a155f7]/50 rounded-lg px-4 py-3.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-2">
                {error && <p className="text-red-400 text-xs font-semibold mb-3 text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#ab5ff7] to-[#923af0] hover:from-[#b975fb] hover:to-[#a14df7] text-white font-bold tracking-widest text-sm py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(161,85,247,0.4)] hover:shadow-[0_0_30px_rgba(161,85,247,0.6)]"
                >
                  ACCESS SYSTEM
                </button>
              </div>

              {/* Secure Connection Text */}
              <div className="text-center pt-6 pb-2">
                <p className="text-[9px] sm:text-[10px] text-gray-500 font-mono tracking-widest uppercase flex flex-col gap-1">
                  <span>Secure connection established</span>
                  <span>Encryption: AES-256</span>
                </p>
              </div>

              {/* Account Hint Box */}
              <div className="mt-2 border border-white/5 rounded-xl p-4 bg-[#14151a]/50">
                <h3 className="text-[#a155f7] text-[10px] font-bold mb-3 tracking-wider uppercase">Daftar Akun:</h3>
                <div className="space-y-2 text-[11px] font-mono text-gray-500">
                  <div className="flex items-center">
                    <span className="w-32">Admin:</span>
                    <span className="text-gray-300">admin / admin123</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32">Fleet Sup:</span>
                    <span className="text-gray-300">fleet / fleet123</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32">Pelanggan:</span>
                    <span className="text-gray-300">pelanggan / pelanggan123</span>
                  </div>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
