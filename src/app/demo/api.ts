//随机生成视频数据
export const getVideoData = async () => {
  const res = await fetch("https://v2.xxapi.cn/api/meinv", {
    redirect: "follow",
  });
  const json = await res.json();
  return json.data as string;
};

// https://v2.xxapi.cn/api/pcmeinvpic
// 随机生成壁纸
export const getWallpaper = async () => {
  const op = { redirect: "follow" };
  const urls = [];

  for (let i = 0; i < 5; i++) {
    urls.push("https://v2.xxapi.cn/api/pcmeinvpic?v=" + i);
  }

  const fetchs = urls.map((url) =>
    fetch(url, op as RequestInit)
      .then((res) => res.json())
      .then((json) => json.data)
  );

  const res = Promise.all(fetchs);
  return res;
};
