import { useState } from "react";
import { toast } from "sonner";
import { ErrorModal } from "../shared/ErrorModal";
import { useAuth } from "./AuthContext";
import { AuthShell, Field } from "./AuthShell";

export const LoginScreen = () => {
  const { signIn, setStage } = useAuth();
  const [email, setEmail] = useState("jose@uaredormed.com");
  const [password, setPassword] = useState("••••••••");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("That email doesn't look right. Please check and try again.");
      return;
    }
    if (password.length < 4) {
      toast.error("Password is too short.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      try {
        signIn({
          name: "Jose Dela Cruz",
          email,
          phone: "+63 917 555 0142",
          location: "Quezon City, PH",
        });
        toast.success("Welcome back!");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign-in failed.");
      }
    }, 500);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue managing your dorm experience."
      footer={
        <span className="text-white/60">
          New here?{" "}
          <button
            onClick={() => setStage("register")}
            className="font-semibold text-brand-glow underline-offset-4 hover:underline"
          >
            Create an account
          </button>
        </span>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-white/60">
            <input type="checkbox" className="h-3.5 w-3.5 accent-brand" defaultChecked />
            Remember me
          </label>
          <button type="button" className="text-brand-glow hover:underline">
            Forgot password?
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-12 w-full rounded-full bg-white text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <div className="relative my-2 text-center text-[10px] uppercase tracking-wider text-white/40">
          <span className="absolute left-0 top-1/2 h-px w-[40%] bg-white/10" />
          <span>or</span>
          <span className="absolute right-0 top-1/2 h-px w-[40%] bg-white/10" />
        </div>
        <button
          type="button"
          onClick={submit}
          className="h-12 w-full rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Continue with Google
        </button>
      </form>
      <ErrorModal
        open={!!error}
        message={error ?? ""}
        onClose={() => setError(null)}
        onRetry={() => setError(null)}
      />
    </AuthShell>
  );
};