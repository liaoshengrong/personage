//随机生成视频数据
export const getVideoData = async () => {
  try {
    // 创建超时控制器
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
    
    const res = await fetch("https://v2.xxapi.cn/api/meinv", {
      redirect: "follow",
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = await res.json();
    return json.data as string;
  } catch (error) {
    console.error("Failed to fetch video data:", error);
    // 返回默认值，避免页面崩溃
    return "";
  }
};

// https://v2.xxapi.cn/api/pcmeinvpic
// 随机生成壁纸
export const getWallpaper = async () => {
  try {
    const op = { redirect: "follow" };
    const urls = [];

    for (let i = 0; i < 5; i++) {
      urls.push("https://v2.xxapi.cn/api/pcmeinvpic?v=" + i);
    }

    const fetchs = urls.map((url) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
      
      return fetch(url, {
        ...op,
        signal: controller.signal,
      } as RequestInit)
        .then((res) => {
          clearTimeout(timeoutId);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((json) => json.data)
        .catch((error) => {
          clearTimeout(timeoutId);
          console.error(`Failed to fetch wallpaper from ${url}:`, error);
          return null; // 返回 null 而不是抛出错误
        });
    });

    const res = await Promise.all(fetchs);
    // 过滤掉 null 值
    return res.filter((item): item is string => item !== null);
  } catch (error) {
    console.error("Failed to fetch wallpaper data:", error);
    // 返回空数组，避免页面崩溃
    return [];
  }
};
