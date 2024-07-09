"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <>
      <div className="container mx-auto">{children}</div>
    </>
  );
};

export default DashboardLayout;
