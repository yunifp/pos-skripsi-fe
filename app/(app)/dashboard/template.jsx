"use client";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

export default function template({ children }) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}
