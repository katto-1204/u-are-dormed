import { TenantApp } from "@/components/uad/TenantApp";
import { LandlordDashboard } from "@/components/uad/LandlordDashboard";
import { useAuth } from "@/components/uad/auth/AuthContext";
import { SplashScreen } from "@/components/uad/auth/SplashScreen";
import { OnboardingScreen } from "@/components/uad/auth/OnboardingScreen";
import { LoginScreen } from "@/components/uad/auth/LoginScreen";
import { RegisterScreen } from "@/components/uad/auth/RegisterScreen";
import { RoleSelectScreen } from "@/components/uad/auth/RoleSelectScreen";
import { LocationStep } from "@/components/uad/auth/LocationStep";

const Index = () => {
  const { stage, user } = useAuth();

  if (stage === "splash") return <SplashScreen />;
  if (stage === "onboarding") return <OnboardingScreen />;
  if (stage === "login") return <LoginScreen />;
  if (stage === "register") return <RegisterScreen />;
  if (stage === "location") return <LocationStep />;
  if (stage === "role" || !user) return <RoleSelectScreen />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {user.role === "tenant" ? <TenantApp /> : <LandlordDashboard />}
    </div>
  );
};

export default Index;
