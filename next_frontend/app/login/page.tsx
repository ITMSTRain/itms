"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { createBrowserClient } from "@supabase/ssr";

// ShadCN components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 8;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prev) => ({
      ...prev,
      [name]:
        name === "email"
          ? validateEmail(value)
            ? ""
            : "Please enter a valid email address"
          : validatePassword(value)
          ? ""
          : "Password must be at least 8 characters",
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
  
    try {
      // Authenticate user with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
  
      if (error) {
        setErrors((prev) => ({ ...prev, general: error.message }));
        setIsLoading(false);
        return;
      }
  
      console.log("Login successful:", data);
  
      // Fetch MAC address with error handling
      const res = await fetch("/api/mac");
  
      if (!res.ok) {
        throw new Error(`Failed to fetch MAC address: ${res.status} ${res.statusText}`);
      }
  
      const macData = await res.json();
  
      if (!macData.macs || macData.macs.length === 0) {
        throw new Error("No valid MAC address found.");
      }
  
      const macAddress = macData.macs[0]; // Use the first valid MAC address
      console.log("MAC Address:", macAddress);
  
      // Insert login log into Supabase
      const { error: logError } = await supabase.from("userlogs").insert({
        Email: formData.email,
        TimeIn: new Date().toISOString(),
        mac_address: macAddress,
      });
  
      if (logError) {
        throw new Error(`Error logging user activity: ${logError.message}`);
      }
  
      console.log("User activity logged successfully");
      window.location.href = "/home"; // Redirect after login
    } catch (err: any) {
      console.error("Login error:", err);
      setErrors((prev) => ({ ...prev, general: err.message || "Something went wrong. Please try again." }));
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const isFormValid = validateEmail(formData.email) && validatePassword(formData.password);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 bg-[#343A40]"></header>

      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md bg-white rounded-xl shadow-2xl shadow-black/70 p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6">
            <img src="/img/Vision-Drive.png" alt="Vision Drive Logo" className="w-100 h-100 mb-2" />
          </div>

          <CardHeader>
            <CardTitle className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <p className="text-center text-gray-600">Sign in to your account</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-red-300" : "border-gray-300"}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? "border-red-300" : "border-gray-300"}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {errors.general && <p className="text-sm text-red-600 text-center">{errors.general}</p>}

              <div className="text-sm text-right">
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-2 px-4 rounded-md text-sm font-medium text-white transition ${
                  isFormValid ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-[#800000] text-white text-center py-4 text-sm">
        © 2025 Batangas State University. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
