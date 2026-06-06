"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/onboarding") || pathname.startsWith("/login")) return null;
  return <Navbar />;
}
