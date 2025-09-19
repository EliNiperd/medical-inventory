// app/lib/auth-actions.js
"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function signOutAction() {
  try {
    await signOut();
    redirect("/login");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}