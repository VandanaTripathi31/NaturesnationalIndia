"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Leaf, Loader2, LockKeyhole, Mail } from "lucide-react";
import toast from "react-hot-toast";
import type { LoginCredentials } from "@/lib/auth";

// ─── Inline SVG: Botanical background ────────────────────────────────────────
function BotanicalBackground() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="48%" r="52%">
          <stop offset="0%" stopColor="#2F8D6E " stopOpacity="0.08" />
          <stop offset="100%" stopColor="#f7f4ee" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background fill */}
      <rect width="100%" height="100%" fill="#f7f4ee" />

      {/* Radial green glow behind card */}
      <rect width="100%" height="100%" fill="url(#glow)" />

      {/* Subtle leaf line illustrations — top-left cluster */}
      <g opacity="0.13" stroke="#2F8D6E " strokeWidth="1" fill="none">
        {/* Large leaf arc TL */}
        <path d="M-40,120 Q80,20 200,160" />
        <path d="M-30,140 Q90,40 210,180" />
        <path d="M10,80 Q120,-10 240,130" />
        {/* Veins */}
        <path d="M80,20 Q130,80 100,160" />
        <path d="M90,30 Q140,90 110,170" />
        {/* Small sprig bottom-left */}
        <path d="M0,600 Q60,520 140,580" />
        <path d="M10,620 Q70,540 150,600" />
        <path d="M60,520 Q80,560 60,600" />
        <path d="M70,530 Q92,570 72,610" />
      </g>

      {/* Subtle leaf lines — bottom-right cluster */}
      <g opacity="0.10" stroke="#5a7a3a" strokeWidth="1" fill="none">
        <path d="M1200,500 Q1100,380 960,480" />
        <path d="M1210,520 Q1110,400 970,500" />
        <path d="M1160,440 Q1060,320 920,420" />
        {/* Veins */}
        <path d="M1100,380 Q1060,440 1090,510" />
        <path d="M1090,370 Q1050,430 1080,500" />
        {/* Top-right sprig */}
        <path d="M1300,40 Q1220,100 1260,200" />
        <path d="M1310,30 Q1230,90 1270,190" />
        <path d="M1220,100 Q1250,140 1230,190" />
      </g>

      {/* Abstract wave lines across mid — very faint */}
      <g opacity="0.06" stroke="#c8922a" strokeWidth="1.5" fill="none">
        <path d="M0,340 Q320,280 640,340 T1280,340" />
        <path d="M0,360 Q320,300 640,360 T1280,360" />
        <path d="M0,380 Q320,320 640,380 T1280,380" />
      </g>

      {/* Scattered small dots — organic texture */}
      <g opacity="0.07" fill="#2F8D6E ">
        <circle cx="180" cy="320" r="2.5" />
        <circle cx="340" cy="180" r="1.8" />
        <circle cx="980" cy="260" r="2" />
        <circle cx="1100" cy="440" r="2.5" />
        <circle cx="460" cy="520" r="1.5" />
        <circle cx="820" cy="100" r="2" />
      </g>
    </svg>
  );
}

// ─── Logo mark ────────────────────────────────────────────────────────────────
function NaturesNaturalLogo() {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Icon mark */}
      <div
        className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.5rem] shadow-lg"
        style={{
          background: "linear-gradient(135deg, #2F8D6E  0%, #1d2b18 100%)",
          boxShadow: "0 8px 32px rgba(59,110,40,0.28), 0 2px 8px rgba(59,110,40,0.18)",
        }}
      >
        <Leaf className="h-9 w-9 text-white" strokeWidth={1.5} />
      </div>
      {/* Wordmark */}
      <div className="flex flex-col items-center">
        <span
          className="text-xl font-semibold tracking-widest uppercase"
          style={{ color: "#1d2b18", letterSpacing: "0.2em" }}
        >
          Natures Natural
        </span>
        <span
          className="text-[10px] font-medium tracking-[0.25em] uppercase mt-0.5"
          style={{ color: "#c8922a" }}
        >
          Admin Dashboard
        </span>
      </div>
    </div>
  );
}

// ─── Decorative divider ───────────────────────────────────────────────────────
function Divider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, #d6cfc7)" }} />
      <Leaf className="h-3 w-3 opacity-30" style={{ color: "#5a7a3a" }} strokeWidth={1.5} />
      <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, #d6cfc7)" }} />
    </div>
  );
}

// ─── Input wrapper ────────────────────────────────────────────────────────────
interface InputFieldProps {
  label: string;
  id: string;
  error?: string;
  icon: React.ReactNode;
  suffix?: React.ReactNode;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

function InputField({ label, id, error, icon, suffix, inputProps }: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium" style={{ color: "#1d2b18" }}>
        {label}
      </label>
      <div className="relative group">
        {/* Left icon */}
        <span
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
          style={{ color: "#8aa67a" }}
        >
          {icon}
        </span>

        <input
          id={id}
          className="admin-input pl-10 pr-12 w-full rounded-2xl border bg-white/70 py-3 text-sm transition-all duration-200 outline-none"
          style={{
            borderColor: error ? "#dc2626" : "#ddd8d0",
            color: "#1d2b18",
          }}
          {...inputProps}
        />

        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials & { rememberMe?: boolean }>({
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginCredentials) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Invalid credentials");
      toast.success(`Welcome back, ${data.admin?.name ?? "Admin"}`);
      router.push(searchParams.get("from") ?? "/admin/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10"
      style={{ background: "#f7f4ee" }}
    >
      {/* ── Botanical background ── */}
      <BotanicalBackground />

      {/* ── Logo above card ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 mb-8"
      >
        <NaturesNaturalLogo />
      </motion.div>

      {/* ── Login card ── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[460px]"
      >
        <div
          className="rounded-[1.75rem] border bg-white/92 px-10 py-10 backdrop-blur-md"
          style={{
            borderColor: "#e3ddd6",
            boxShadow:
              "0 2px 4px rgba(59,110,40,0.04), 0 8px 24px rgba(59,110,40,0.08), 0 32px 64px rgba(29,43,24,0.10)",
          }}
        >
          {/* Card header */}
          <div className="mb-1 text-center">
            <h1
              className="text-2xl font-semibold tracking-tight"
              style={{ color: "#1d2b18" }}
            >
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "#6b7c61" }}>
              Sign in to access the Natures Natural Admin Dashboard.
            </p>
          </div>

          <Divider />

          {/* ── Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <InputField
              label="Email Address"
              id="email"
              error={errors.email?.message}
              icon={<Mail className="h-4 w-4" />}
              inputProps={{
                type: "email",
                autoComplete: "email",
                placeholder: "       admin@naturesnational.com",
                ...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                }),
              }}
            />

            {/* Password */}
            <InputField
              label="Password"
              id="password"
              error={errors.password?.message}
              icon={<LockKeyhole className="h-4 w-4" />}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-[#8aa67a] transition-colors hover:text-[#2F8D6E ]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              inputProps={{
                type: showPassword ? "text" : "password",
                autoComplete: "current-password",
                placeholder: "       Enter your password",
                ...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                }),
              }}
            />

            {/* Remember me + Forgot password row */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex cursor-pointer items-center gap-2 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border accent-[#2F8D6E ]"
                  style={{ accentColor: "#2F8D6E " }}
                  {...register("rememberMe")}
                />
                <span className="text-sm" style={{ color: "#6b7c61" }}>
                  Remember me
                </span>
              </label>
              <a
                href="/admin/forgot-password"
                className="text-sm font-medium transition-colors hover:underline"
                style={{ color: "#c8922a" }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { y: -2, boxShadow: "0 12px 32px rgba(59,110,40,0.28)" } : {}}
              whileTap={!isSubmitting ? { y: 0 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="admin-btn-primary mt-1 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                background: isSubmitting
                  ? "#5a7a3a"
                  : "linear-gradient(135deg, #2F8D6E  0%, #1d2b18 100%)",
                boxShadow: "0 4px 16px rgba(59,110,40,0.20)",
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* ── Footer ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 mt-8 text-xs"
        style={{ color: "#9e9488" }}
      >
        © 2026 Natures Natural. All rights reserved.
      </motion.p>
    </div>
  );
}
