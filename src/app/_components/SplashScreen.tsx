'use client';

import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [displaySubText, setDisplaySubText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [subTextIndex, setSubTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  const fullText = '通过代码探索技术与创意的边界';
  const fullSubText = '廖声荣的技术博客 · AI · 前端开发 · 数字创新';

  useEffect(() => {
    // 同步启动进度条和打字机效果 - 使用单一状态管理
    const startTime = Date.now();
    
    // 统一的定时器处理函数
    const updateAnimation = () => {
      const elapsed = Date.now() - startTime;
      const progressPercentage = Math.min((elapsed / 6000) * 100, 100); // 6秒完成100%
      
      // 更新进度条
      setProgress(progressPercentage);
      
      // Update animation phase based on progress with enhanced timing
      if (progressPercentage < 25) {
        setAnimationPhase(0);
      } else if (progressPercentage < 50) {
        setAnimationPhase(1);
      } else if (progressPercentage < 75) {
        setAnimationPhase(2);
      } else {
        setAnimationPhase(3);
      }
      
      // 更新打字机效果 - 基于时间计算应该显示多少字符
      const totalChars = fullText.length + fullSubText.length;
      const charsPerMs = totalChars / 6000; // 6秒内显示所有字符
      const shouldShowChars = Math.floor(elapsed * charsPerMs);
      
      if (shouldShowChars <= fullText.length) {
        // 显示第一行
        setDisplayText(fullText.slice(0, shouldShowChars));
        setTextIndex(shouldShowChars);
      } else {
        // 第一行完成，显示第二行
        if (textIndex <= fullText.length) {
          setDisplayText(fullText);
          setTextIndex(fullText.length);
          setIsTyping(false);
        }
        
        const subTextChars = shouldShowChars - fullText.length;
        if (subTextChars <= fullSubText.length) {
          setDisplaySubText(fullSubText.slice(0, subTextChars));
          setSubTextIndex(subTextChars);
        }
      }
      
      // 检查是否完成
      if (progressPercentage >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 800);
        }, 300);
      }
    };

    // 启动统一的定时器 - 每50ms更新一次
    const interval = setInterval(updateAnimation, 50);

    return () => {
      clearInterval(interval);
    };
  }, [onComplete, fullText, fullSubText]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <style jsx>{`
        @keyframes spark {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.3); opacity: 0.2; }
        }
        @keyframes flow {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 1; }
        }
      `}</style>
      {/* 超级动态背景 - 协调的爆炸效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 overflow-hidden">
        {/* 协调的动态光晕效果 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/8 to-blue-600/8 rounded-full blur-3xl animate-ping" style={{animationDuration: '5s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-purple-500/8 to-pink-500/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s', animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-bl from-indigo-500/8 to-cyan-500/8 rounded-full blur-3xl animate-ping" style={{animationDelay: '0.8s', animationDuration: '3s'}}></div>
        
        {/* 协调的爆炸光点 */}
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-pink-500/15 to-yellow-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-gradient-to-r from-cyan-500/12 to-purple-500/12 rounded-full blur-2xl animate-ping" style={{animationDelay: '2s'}}></div>
        
        {/* 微妙星光效果 - 轻柔闪烁 */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.6 + 0.2,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* 柔和能量线条 - 静态渐变 */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent"></div>
      </div>
      
      {/* 网格和噪声纹理 */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      {/* 协调的动态涟漪效果 - 爆炸扩散 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* 主要涟漪环 - 协调的爆炸扩散 */}
        <div className="w-32 h-32 border-2 border-blue-400/40 rounded-full animate-ping" style={{animationDuration: '3s'}}></div>
        <div className="w-40 h-40 border-2 border-purple-400/30 rounded-full animate-pulse" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
        <div className="w-48 h-48 border border-cyan-400/25 rounded-full animate-ping" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
        
        {/* 协调的爆炸圆环 */}
        <div className="w-24 h-24 border-2 border-pink-400/30 rounded-full animate-pulse" style={{animationDelay: '0.5s', animationDuration: '2s'}}></div>
        <div className="w-56 h-56 border border-yellow-400/20 rounded-full animate-ping" style={{animationDelay: '3s', animationDuration: '6s'}}></div>
        
        {/* 新增协调的涟漪粒子 */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={`ripple-particle-${i}`}
              className={`absolute w-0.5 h-0.5 rounded-full ${i % 2 === 0 ? 'animate-pulse' : 'animate-ping'}`}
              style={{
                top: `${50 + Math.cos(i * 30 * Math.PI / 180) * 30}%`,
                left: `${50 + Math.sin(i * 30 * Math.PI / 180) * 30}%`,
                backgroundColor: i % 4 === 0 ? 'rgba(6, 182, 212, 0.6)' : i % 4 === 1 ? 'rgba(139, 92, 246, 0.6)' : i % 4 === 2 ? 'rgba(236, 72, 153, 0.6)' : 'rgba(245, 158, 11, 0.6)',
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* 主要内容容器 */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Logo动画区域 - 添加爆炸和抖动效果 */}
        <div className="mb-12 relative">
          {/* Logo背景光晕 - 添加脉冲效果 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-ping"></div>
            <div className="absolute w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          {/* 主Logo - 添加轻微抖动 */}
          <div className="relative inline-block animate-bounce" style={{animationDuration: '4s'}}>
            <div className="w-28 h-28 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center relative">
              <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                SR
              </div>
              {/* 内部爆炸光点 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
            
            {/* 多层轨道环 - 添加脉冲效果 */}
            <div className="absolute inset-0 w-28 h-28 border-2 border-cyan-400/20 rounded-3xl animate-pulse"></div>
            <div className="absolute inset-0 w-28 h-28 border-2 border-purple-400/20 rounded-3xl animate-ping" style={{animationDelay: '0.8s'}}></div>
            <div className="absolute inset-0 w-36 h-36 border-2 border-cyan-400/10 rounded-3xl animate-pulse" style={{animationDelay: '1.2s'}}></div>
            
            {/* 外部爆炸粒子 */}
            <div className="absolute -inset-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={`logo-burst-${i}`}
                  className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-ping"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* 标题文字 - 真实打字机流式输出效果 */}
        <div className="mb-8 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            数字空间
          </h1>
          <div className="text-lg md:text-xl text-slate-300/90 font-medium space-y-2">
            <p className="text-slate-300/90 h-8">
              {displayText}
              {isTyping && (
                <span className="inline-block w-0.5 h-5 bg-slate-300 ml-1 animate-pulse"></span>
              )}
            </p>
            <p className="text-sm text-slate-400/80 h-6">
              {displaySubText}
              {!isTyping && displaySubText.length > 0 && (
                <span className="inline-block w-0.5 h-4 bg-slate-400 ml-1 animate-pulse"></span>
              )}
            </p>
          </div>
        </div>
        
        {/* 动态粒子系统 - 抖动和爆炸效果 */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className={`absolute rounded-full ${i % 3 === 0 ? 'animate-pulse' : i % 3 === 1 ? 'animate-bounce' : 'animate-ping'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                backgroundColor: i % 4 === 0 ? '#06b6d4' : i % 4 === 1 ? '#8b5cf6' : i % 4 === 2 ? '#ec4899' : '#f59e0b',
                opacity: Math.random() * 0.6 + 0.3,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 1}s`
              }}
            />
          ))}
          
          {/* 爆炸粒子效果 */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`burst-${i}`}
              className="absolute animate-ping"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                width: '8px',
                height: '8px',
                backgroundColor: ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'][i % 4],
                opacity: 0.4,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
        
        {/* 超级动态进度条 - 增强粒子系统和抖动效果 */}
        <div className="mt-16 space-y-6">
          {/* 进度条容器添加轻微抖动 */}
          <div className="relative w-80 h-4 bg-slate-800/50 backdrop-blur-sm rounded-full overflow-hidden border border-white/20 shadow-2xl mx-auto animate-pulse" style={{animationDuration: '3s'}}>
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-100 ease-out relative overflow-visible"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-gradient-to-r from-white/20 to-transparent"></div>
              
              {/* 真实电流效果 - 流动和闪烁 */}
              <div className="absolute inset-0 overflow-hidden">
                {/* 电流核心流动 */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-cyan-200/20 to-blue-200/10 animate-pulse" style={{animationDuration: '0.2s'}}></div>
                
                {/* 电流流动线条 */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`current-flow-${i}`}
                    className="absolute h-full w-1 bg-gradient-to-b from-transparent via-white/60 to-transparent"
                    style={{
                      left: `${10 + i * 15}%`,
                      animation: `flow ${0.3 + Math.random() * 0.2}s linear infinite`,
                      animationDelay: `${i * 0.1}s`,
                      opacity: 0.8
                    }}
                  />
                ))}
                
                {/* 电流闪烁点 */}
                {[...Array(25)].map((_, i) => (
                  <div
                    key={`current-blink-${i}`}
                    className="absolute w-1 h-1 rounded-full bg-white"
                    style={{
                      left: `${Math.random() * 90}%`,
                      top: `${Math.random() * 80 + 10}%`,
                      animation: `blink ${0.1 + Math.random() * 0.15}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 0.3}s`
                    }}
                  />
                ))}
                
                {/* 电流火花 */}
                {[...Array(10)].map((_, i) => (
                  <div
                    key={`current-spark-${i}`}
                    className="absolute w-0.5 h-0.5 rounded-full"
                    style={{
                      left: `${Math.random() * 95}%`,
                      top: `${Math.random() * 70 + 15}%`,
                      backgroundColor: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#06b6d4' : '#3b82f6',
                      animation: `spark ${0.08 + Math.random() * 0.07}s ease-out infinite`,
                      animationDelay: `${Math.random() * 0.2}s`,
                      opacity: Math.random() * 0.9 + 0.1
                    }}
                  />
                ))}
                
                {/* 电流波纹 */}
                <div className="absolute inset-0 border border-white/20 rounded-full animate-ping" style={{animationDuration: '0.3s'}}></div>
                <div className="absolute inset-1 border border-cyan-300/15 rounded-full animate-ping" style={{animationDelay: '0.1s', animationDuration: '0.25s'}}></div>
              </div>
              
              {/* 进度条头部电流效果 */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                {/* 电流头部光晕 */}
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{animationDuration: '0.15s'}}></div>
                <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.05s', animationDuration: '0.2s'}}></div>
                <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.1s', animationDuration: '0.25s'}}></div>
                
                {/* 电流头部火花 */}
                <div className="absolute -inset-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={`head-current-${i}`}
                      className="absolute w-0.5 h-0.5 bg-white rounded-full"
                      style={{
                        top: `${50 + Math.random() * 30 - 15}%`,
                        left: `${50 + Math.random() * 30 - 15}%`,
                        animation: `spark ${0.06 + Math.random() * 0.04}s ease-out infinite`,
                        animationDelay: `${i * 0.03}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* 进度条外部超级粒子系统 */}
            <div className="absolute -inset-8">
              {/* 主要爆炸粒子 */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={`outer-burst-${i}`}
                  className={`absolute rounded-full ${i % 3 === 0 ? 'animate-ping' : i % 3 === 1 ? 'animate-pulse' : 'animate-bounce'}`}
                  style={{
                    top: `${Math.random() * 120 - 10}%`,
                    left: `${Math.random() * 120 - 10}%`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    backgroundColor: i % 5 === 0 ? '#06b6d4' : i % 5 === 1 ? '#8b5cf6' : i % 5 === 2 ? '#ec4899' : i % 5 === 3 ? '#f59e0b' : '#ffffff',
                    opacity: Math.random() * 0.7 + 0.3,
                    animationDelay: `${Math.random() * 4}s`,
                    animationDuration: `${Math.random() * 3 + 1}s`
                  }}
                />
              ))}
              
              {/* 特殊爆炸效果 */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={`special-burst-${i}`}
                  className="absolute animate-ping"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: '4px',
                    height: '4px',
                    background: `radial-gradient(circle, ${['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#ffffff', '#fbbf24'][i % 6]} 0%, transparent 70%)`,
                    opacity: 0.8,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '2.5s'
                  }}
                />
              ))}
            </div>
            
            {/* 进度条背景光晕粒子 */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`bg-particle-${i}`}
                  className="absolute w-1 h-1 bg-gradient-to-r from-blue-400/50 to-purple-400/50 rounded-full animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* 超级动态加载指示器 - 完全移除底部文字抖动 */}
          <div className="text-center space-y-3">
            <div>
              <p className="text-lg text-slate-300 font-bold">
                {animationPhase === 0 && '⚡ 正在初始化系统...'}
                {animationPhase === 1 && '🚀 正在加载量子资源...'}
                {animationPhase === 2 && '🔮 正在同步维度...'}
                {animationPhase === 3 && '✨ 准备就绪，即将启动...'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-slate-400 font-mono">{Math.round(progress)}%</p>
            </div>
            
            {/* 超级加载文字周围的爆炸效果 */}
            <div className="relative flex justify-center items-center space-x-3 mt-3">
              {/* 左侧粒子群 */}
              <div className="flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={`left-burst-${i}`}
                    className={`w-1 h-1 rounded-full ${i % 2 === 0 ? 'animate-ping' : 'animate-pulse'}`}
                    style={{
                      backgroundColor: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#8b5cf6' : '#ec4899',
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: `${1 + Math.random()}s`
                    }}
                  />
                ))}
              </div>
              
              {/* 中心特殊效果 */}
              <div className="relative w-3 h-3">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full animate-ping" style={{animationDuration: '1.5s'}}></div>
                <div className="absolute inset-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
              </div>
              
              {/* 右侧粒子群 */}
              <div className="flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={`right-burst-${i}`}
                    className={`w-1 h-1 rounded-full ${i % 2 === 0 ? 'animate-bounce' : 'animate-ping'}`}
                    style={{
                      backgroundColor: i % 3 === 0 ? '#f59e0b' : i % 3 === 1 ? '#06b6d4' : '#8b5cf6',
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: `${1.2 + Math.random() * 0.8}s`
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* 底部装饰粒子 */}
            <div className="flex justify-center space-x-2 mt-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={`bottom-burst-${i}`}
                  className="w-0.5 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${1.5 + Math.random()}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 简化的底部装饰 - 静态点 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
            style={{
              width: `${Math.random() * 4 + 3}px`,
              height: `${Math.random() * 4 + 3}px`,
              opacity: 0.7
            }}
          ></div>
        ))}
      </div>

      {/* 简化的版本信息 - 静态显示 */}
      <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-mono">
        v2.0.0 | Next.js 15
      </div>
      
      {/* 简化的角落装饰 - 静态点 */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-400/30 rounded-full"></div>
      <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-purple-400/30 rounded-full"></div>
      <div className="absolute bottom-16 left-8 w-2 h-2 bg-pink-400/30 rounded-full"></div>
      <div className="absolute bottom-16 right-8 w-1.5 h-1.5 bg-yellow-400/30 rounded-full"></div>
    </div>
  );
};

export default SplashScreen;