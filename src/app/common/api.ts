const base = "https://shengrong.netlify.app";
export const getDetail = async (tag: string, title: string) => {
  const res = await fetch(`${base}/files/${tag}/${title}.md`);
  const data = await res.text();

  return data;
};
