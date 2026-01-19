/**
 * 图片加载优化工具函数
 */

// 生成模糊占位符的 base64 数据 URL
export const generateBlurDataURL = (width: number = 10, height: number = 10): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#e5e7eb'; // 灰色背景
    ctx.fillRect(0, 0, width, height);
  }
  return canvas.toDataURL();
};

// 默认占位符（1x1 像素的灰色图片）
export const DEFAULT_BLUR_DATA_URL = 
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=';

// 图片加载错误处理
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  // 可以设置一个默认的错误图片
  // target.src = '/images/error-placeholder.png';
  target.style.display = 'none';
};

// 计算响应式图片尺寸
export const getResponsiveImageSizes = (maxWidth: number = 1200): string => {
  return `(max-width: 768px) 100vw, (max-width: 1200px) ${maxWidth}px, ${maxWidth}px`;
};

// 获取图片质量（根据用途）
export const getImageQuality = (type: 'thumbnail' | 'normal' | 'high' = 'normal'): number => {
  const qualityMap = {
    thumbnail: 60,
    normal: 75,
    high: 90,
  };
  return qualityMap[type];
};
