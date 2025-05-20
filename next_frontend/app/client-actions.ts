"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export const useAuthActions = () => {
  const router = useRouter();
  const supabase = createClient();

  const signUp = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const origin = window.location.origin;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return { message: "Check your email for verification link" };
  };

  const signIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    router.push("/protected");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const resetPassword = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const origin = window.location.origin;

    if (!email) throw new Error("Email is required");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    });

    if (error) throw error;
    return { message: "Check your email for password reset link" };
  };

  const updatePassword = async (formData: FormData) => {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
      throw new Error("Password and confirm password are required");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;
    return { message: "Password updated successfully" };
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };
};

export const useVideoActions = () => {
  const supabase = createClient();

  const fetchVideoNames = async () => {
    const { data, error } = await supabase
      .from("video_data")
      .select("video_name");

    if (error) throw error;
    return data;
  };

  return {
    fetchVideoNames,
  };
};
