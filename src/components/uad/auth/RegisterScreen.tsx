import { useState } from "react";
import { useAuth } from "./AuthContext";
import { AuthShell, Field } from "./AuthShell";

export const RegisterScreen = () => {
  const { registerUser, setStage } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser({
      name: form.name || "New Tenant",
      email: form.email || "tenant@example.com",
      phone: form.phone || "+63 900 000 0000",
      location: form.location || "",
    });
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="A few quick details and you're in."
      footer={
        <span className="text-white/60">
          Already registered?{" "}
          <button
            onClick={() => setStage("login")}
            className="font-semibold text-brand-glow underline-offset-4 hover:underline"
          >
            Sign in
          </button>
        </span>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name" placeholder="Maria Santos" value={form.name} onChange={set("name")} required />
        <Field label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone" placeholder="+63 9XX" value={form.phone} onChange={set("phone")} required />
          <Field label="Location" placeholder="City, Country" value={form.location} onChange={set("location")} required />
        </div>
        <Field label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={set("password")} required />
        <p className="text-[11px] leading-relaxed text-white/50">
          By creating an account you agree to our{" "}
          <span className="text-brand-glow underline">Terms</span> and{" "}
          <span className="text-brand-glow underline">Privacy Policy</span>.
        </p>
        <button
          type="submit"
          className="mt-2 h-12 w-full rounded-full bg-white text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          Continue
        </button>
      </form>
    </AuthShell>
  );
};