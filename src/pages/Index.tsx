import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import LoginPage from "@/components/LoginPage";
import Dashboard from "@/components/Dashboard";

type AppState = "splash" | "login" | "dashboard";

const Index = () => {
  const [state, setState] = useState<AppState>("splash");
  const [currentUser, setCurrentUser] = useState("");

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setState("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser("");
    setState("login");
  };

  if (state === "splash") {
    return <SplashScreen onComplete={() => setState("login")} />;
  }

  if (state === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard currentUser={currentUser} onLogout={handleLogout} />;
};

export default Index;
