'use client';

import React, { useState, useEffect } from "react";
import List from "./_components/List";
import Navbar from "./_components/Navbar";
import PageContainer from "./_components/PageContainer";
import FloatingToc from "./_components/FloatingToc";
import SplashScreen from "./_components/SplashScreen";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查是否已经显示过开屏页
    // const hasShownSplash = sessionStorage.getItem('hasShownSplash');
    const hasShownSplash = false;
    
    if (hasShownSplash) {
      setShowSplash(false);
      setIsLoading(false);
    } else {
      // 模拟初始加载
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasShownSplash', 'true');
    setShowSplash(false);
  };

  // 加载状态显示简单加载器
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-300">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <PageContainer>
        <Navbar />
        <List />
        <FloatingToc />
      </PageContainer>
    </>
  );
};

export default Index;
