import { createContext, ReactNode, useContext, useState } from "react";

export type Role = "tenant" | "landlord";

export type User = {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: Role;
  initials: string;
};

export type AuthStage = "splash" | "onboarding" | "login" | "register" | "location" | "role" | "app";

interface AuthCtx {
  stage: AuthStage;
  user: User | null;
  setStage: (s: AuthStage) => void;
  signIn: (u: Omit<User, "role" | "initials"> & { role?: Role }) => void;
  registerUser: (u: Omit<User, "role" | "initials">) => void;
  updateLocation: (loc: string) => void;
  setRole: (r: Role) => void;
  signOut: () => void;
  switchRole: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [stage, setStage] = useState<AuthStage>("splash");
  const [user, setUser] = useState<User | null>(null);

  const signIn: AuthCtx["signIn"] = (u) => {
    if (!u.email || !u.email.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    const role = u.role ?? "tenant";
    setUser({
      name: u.name,
      email: u.email,
      phone: u.phone,
      location: u.location,
      role,
      initials: initials(u.name),
    });
    setStage("role");
  };

  const registerUser: AuthCtx["registerUser"] = (u) => {
    setUser({
      name: u.name,
      email: u.email,
      phone: u.phone,
      location: u.location,
      role: "tenant",
      initials: initials(u.name),
    });
    setStage("location");
  };

  const updateLocation = (loc: string) => {
    setUser((u) => (u ? { ...u, location: loc } : u));
    setStage("role");
  };

  const setRole = (r: Role) => {
    setUser((u) => (u ? { ...u, role: r } : u));
    setStage("app");
  };

  const signOut = () => {
    setUser(null);
    setStage("login");
  };

  const switchRole = () => {
    setUser((u) =>
      u ? { ...u, role: u.role === "tenant" ? "landlord" : "tenant" } : u,
    );
  };

  return (
    <Ctx.Provider value={{ stage, user, setStage, signIn, registerUser, updateLocation, setRole, signOut, switchRole }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
};