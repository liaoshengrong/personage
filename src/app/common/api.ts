// 根据环境动态切换 API 地址
const getBaseUrl = () => {
  // 开发环境
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8200';
  }
  // 生产环境
  return 'https://shengrong.netlify.app';
};

const base = getBaseUrl();
export const getDetail = async (tag: string, title: string) => {
  const res = await fetch(`${base}/files/${tag}/${title}.md`);
  const data = await res.text();

  return data;
};
