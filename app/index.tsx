import { useAuth } from "@/auth/AuthProvider";
import React from "react";

export default function index() {
  const { isLoggedIn } = useAuth();
  
}
