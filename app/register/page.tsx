"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";
    if (!form.email.match(/^\S+@\S+\.\S+$/))
      errs.email = "Please enter a valid email address";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-grid" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      {/* Glow orbs */}
      <div style={{ position: "fixed", top: "-20%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,106,247,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="animate-fade-up" style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #7c6af7, #a78bfa)", marginBottom: 16, fontSize: 24 }}>
            ✓
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.5px" }}>
            Create Account
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 15 }}>
            Start organizing your tasks today
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 32 }}>
          {serverError && (
            <div className="animate-slide-down" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#f87171", fontSize: 14 }}>
              ⚠ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Name */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Full Name
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={errors.name ? { borderColor: "var(--danger)" } : {}}
              />
              {errors.name && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 5 }}>⚡ {errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Email Address
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={errors.email ? { borderColor: "var(--danger)" } : {}}
              />
              {errors.email && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 5 }}>⚡ {errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Password
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={errors.password ? { borderColor: "var(--danger)" } : {}}
              />
              {errors.password && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 5 }}>⚡ {errors.password}</p>}
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", marginTop: 4, padding: "14px" }}>
              {loading ? <><div className="spinner" />Creating account...</> : "Create Account →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "var(--text-muted)", fontSize: 15 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--accent2)", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
