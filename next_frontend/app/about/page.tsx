"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AboutSection from "@/components/aboutsection";
import { Facebook, Twitter, Mail, Linkedin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBackToHome = () => {
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Back to Home */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          onClick={handleBackToHome}
          className="bg-[#343A40] border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-800 transition-colors duration-300 text-lg"
        >
          Back to Home
        </Button>
      </div>

      {/* Hero Section */}
      <div
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/img/BSU2.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div
          className={`relative text-center text-white transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            About RoadGuard
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
            Building safer roads through AI-powered solutions
          </p>
        </div>
      </div>

      {/* About & Mission Section */}
      <AboutSection />

      {/* Footer */}
      <footer className="bg-[#343A40] text-white pt-8 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start w-full">
          {/* Logos */}
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <img
              src="/img/BSU_LOGO.png"
              alt="BSU Logo"
              className="h-24 w-auto"
            />
            <img
              src="/img/logo.png"
              alt="RoadGuard Logo"
              className="h-24 w-auto"
            />
          </div>

          {/* Copyright (inline) */}
          <p className="text-lg text-center md:text-center md:mx-auto mt-12">
            © 2025 Batangas State University. All rights reserved.
          </p>

          {/* Contact Us */}
          <div className="text-right">
            <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
            <Separator className="mb-4" />
            <div className="flex gap-4 justify-end">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-6 w-6 hover:text-blue-500 cursor-pointer" />
              </a>
              <a href="mailto:example@gmail.com">
                <Mail className="h-6 w-6 hover:text-red-500 cursor-pointer" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-6 w-6 hover:text-blue-400 cursor-pointer" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-6 w-6 hover:text-blue-600 cursor-pointer" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
