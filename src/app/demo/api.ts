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
  const result: string[] = [];
  // for (let i = 0; i < 5; i++) {
  //   const res = await fetch("https://v2.xxapi.cn/api/pcmeinvpic?v=" + i, {
  //     redirect: "follow",
  //   });
  //   const json = await res.json();
  //   result.push(json.data);
  // }

  const res = await fetch("https://v2.xxapi.cn/api/pcmeinvpic?v=1", {
    redirect: "follow",
  });
  const json = await res.json();
  result.push(json.data);
  return result;
};
