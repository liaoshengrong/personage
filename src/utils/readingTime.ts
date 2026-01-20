/**
 * 计算阅读时间
 * @param content 文章内容（markdown文本）
 * @param wordsPerMinute 每分钟阅读字数，默认300字（中文）
 * @returns 阅读时间（分钟）
 */
export const calculateReadingTime = (
  content: string,
  wordsPerMinute: number = 300
): number => {
  if (!content) return 0;

  // 移除markdown语法标记
  const text = content
    .replace(/```[\s\S]*?```/g, "") // 移除代码块
    .replace(/`[^`]+`/g, "") // 移除行内代码
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // 移除链接，保留文本
    .replace(/[#*\-_=~`>]/g, "") // 移除markdown标记符号
    .replace(/\n+/g, " ") // 将换行符替换为空格
    .trim();

  // 计算中文字符数（包括中文标点）
  const chineseCharCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  
  // 计算英文单词数（按空格分割）
  const englishWords = text
    .replace(/[\u4e00-\u9fa5]/g, " ") // 将中文替换为空格
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // 总字数：中文字符数 + 英文单词数（英文单词按平均5个字符计算）
  const totalWords = chineseCharCount + englishWords;

  // 计算阅读时间（向上取整，至少1分钟）
  const readingTime = Math.max(1, Math.ceil(totalWords / wordsPerMinute));

  return readingTime;
};

/**
 * 格式化阅读时间显示
 * @param minutes 分钟数
 * @returns 格式化后的字符串，如 "5 分钟"
 */
export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) return "1 分钟";
  return `${minutes} 分钟`;
};
