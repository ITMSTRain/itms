"use client";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// ShadCN components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) =>
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    password.length >= 8;

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
          : "Password must be at least 8 characters and contain uppercase, lowercase, and numbers",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Form submitted:", formData);
    }, 2000);
  };

  const isFormValid =
    validateEmail(formData.email) && validatePassword(formData.password);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Blank Header */}
      <header className="h-16 bg-[#343A40]"></header>

      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md bg-white rounded-xl shadow-2xl shadow-black/70 p-8">
          <div className="flex flex-col items-center mb-6">
            <img
              src="/img/logo.png"
              alt="Road Guard Logo"
              className="h-20 w-20 object-contain mb-2"
            />
            <h1 className="text-3xl font-bold text-gray-800">ROAD GUARD</h1>
          </div>

          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <p className="text-center text-gray-600">Sign in to your account</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className={
                    errors.email ? "border-red-300" : "border-gray-300"
                  }
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
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
                    className={
                      errors.password ? "border-red-300" : "border-gray-300"
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400" />
                    ) : (
                      <FaEye className="text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="text-sm text-right">
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-2 px-4 rounded-md text-sm font-medium text-white ${
                  isFormValid
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-400"
                }`}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>

          <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Create new account
            </a>
          </div>
        </Card>
      </main>

      <footer className="bg-[#800000] text-white text-center py-4">
        © 2025 Batangas State University. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
