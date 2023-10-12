"use client";
import React from "react";
import Image from "next/image";
import "./index.scss";
const Logo = () => {
  return (
    <div className="logo">
      <span>By</span>
      <Image src="/vercel.svg" alt="Logo" width={100} height={24} />
    </div>
  );
};

export default Logo;
