"use client";

import { addUser } from "../actions";
import Link from "next/link";
import { ArrowLeft, User, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useRef, useState } from "react";

const COUNTRY_CODES = [
  { code: "+62", country: "ID" },
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "AU" },
  { code: "+81", country: "JP" },
  { code: "+86", country: "CN" },
  { code: "+65", country: "SG" },
  { code: "+60", country: "MY" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
];

type AccountErrors = { name?: string; username?: string; email?: string; phone?: string; password?: string; general?: string };

export default function AddUserPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<AccountErrors>({});
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phoneCode: "+62",
    phoneNumber: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return null;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Za-z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score === 0) return { label: "Very Weak", color: "bg-red-500", text: "text-red-500", width: "w-1/4" };
    if (score === 1) return { label: "Weak", color: "bg-orange-500", text: "text-orange-500", width: "w-1/3" };
    if (score === 2) return { label: "Medium", color: "bg-yellow-500", text: "text-yellow-500", width: "w-2/3" };
    return { label: "Strong", color: "bg-green-500", text: "text-green-500", width: "w-full" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const clearErr = (field: keyof AccountErrors) =>
    setErrors((p) => ({ ...p, [field]: undefined }));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    const role = new FormData(formElement).get("role") as string;

    const newErrors: AccountErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    
    if (formData.email.trim() && !formData.email.includes("@")) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain both letters and numbers.";
    }

    const fullPhone = formData.phoneNumber.trim() ? `${formData.phoneCode}${formData.phoneNumber.trim()}` : "";
    if (fullPhone) {
      const phoneRegex = /^\+?[0-9]{8,15}$/;
      if (!phoneRegex.test(fullPhone.replace(/[\s-]/g, ''))) {
        newErrors.phone = "Invalid format. Please enter a valid number.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);
    setErrors({});
    
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("username", formData.username);
      payload.append("password", formData.password);
      payload.append("role", role);
      if (formData.email) payload.append("email", formData.email);
      if (fullPhone) payload.append("phone", fullPhone);

      await addUser(payload);
      setIsSuccess(true);
      
      setFormData({
        name: "",
        username: "",
        email: "",
        phoneCode: "+62",
        phoneNumber: "",
        password: "",
      });
      formRef.current?.reset();
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to create account." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = (field: keyof AccountErrors) =>
    `w-full bg-[#17181f] border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors ${
      errors[field] ? "border-red-500/60 focus:border-red-500" : "border-white/5 focus:border-purple-500/50"
    }`;

  const FieldError = ({ field }: { field: keyof AccountErrors }) =>
    errors[field] ? (
      <p className="text-red-400 text-[11px] font-mono mt-1 flex items-center gap-1">
        <span className="text-red-500">✕</span> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/accounts" className="p-2 bg-[#17181f] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-wider mb-0.5">ADD USER</h1>
          <p className="text-gray-500 font-mono text-xs">Register a new system account</p>
        </div>
      </div>

      <div className="bg-[#14151a] border border-white/5 rounded-xl p-6 shadow-xl">
        {isSuccess && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-bold font-mono tracking-wide">
            <CheckCircle2 size={18} className="shrink-0" />
            <p>Account created successfully!</p>
          </div>
        )}
        {errors.general && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono">
            {errors.general}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">
                FULL NAME <span className="text-red-500">*</span>
              </label>
              <input type="text" name="name" placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => { setFormData(prev => ({...prev, name: e.target.value})); clearErr("name"); }}
                className={inputClass("name")} />
              <FieldError field="name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">
                USERNAME <span className="text-red-500">*</span>
              </label>
              <input type="text" name="username" placeholder="e.g. johndoe"
                value={formData.username}
                onChange={(e) => { setFormData(prev => ({...prev, username: e.target.value})); clearErr("username"); }}
                className={inputClass("username")} />
              <FieldError field="username" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">EMAIL (OPTIONAL)</label>
              <input type="email" name="email" placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => { setFormData(prev => ({...prev, email: e.target.value})); clearErr("email"); }}
                className={inputClass("email")} />
              <FieldError field="email" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">PHONE NUMBER (OPTIONAL)</label>
              <div className="flex gap-2">
                <select
                  value={formData.phoneCode}
                  onChange={(e) => { setFormData(prev => ({...prev, phoneCode: e.target.value})); clearErr("phone"); }}
                  className={`w-[100px] bg-[#17181f] border rounded-lg px-2 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors appearance-none ${errors.phone ? 'border-red-500/60' : 'border-white/5 focus:border-purple-500/50'}`}
                >
                  {COUNTRY_CODES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} {country.country}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder="8123456789"
                  value={formData.phoneNumber}
                  onChange={(e) => { setFormData(prev => ({...prev, phoneNumber: e.target.value.replace(/\D/g, '')})); clearErr("phone"); }}
                  className={`flex-1 bg-[#17181f] border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none transition-colors ${errors.phone ? 'border-red-500/60' : 'border-white/5 focus:border-purple-500/50'}`}
                />
              </div>
              <FieldError field="phone" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">
                PASSWORD <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 chars (letters + numbers)"
                  value={formData.password}
                  onChange={(e) => { setFormData(prev => ({...prev, password: e.target.value})); clearErr("password"); }}
                  className={inputClass("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && passwordStrength && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className={`${passwordStrength.text} font-bold tracking-wider`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
              
              <FieldError field="password" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 tracking-wider">ROLE <span className="text-red-500">*</span></label>
              <select name="role" className="w-full bg-[#17181f] border border-white/5 focus:border-purple-500/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none transition-colors appearance-none">
                <option value="Admin">Admin</option>
                <option value="Fleet Superintendent">Fleet Superintendent</option>
                <option value="Customer">Pelanggan</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/accounts" className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-widest text-gray-400 hover:text-white bg-[#17181f] hover:bg-[#1f2029] transition-colors">
              BACK TO LIST
            </Link>
            <button type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#a155f7] disabled:opacity-50 hover:bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]">
              <User size={16} />
              {isSubmitting ? "SAVING..." : "SAVE USER"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
