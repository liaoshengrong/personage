"use client";

import { useEffect } from "react";

interface StructuredDataProps {
  data: object | object[];
}

/**
 * 结构化数据组件
 * 用于在客户端注入 JSON-LD 结构化数据
 */
export default function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    const schemas = Array.isArray(data) ? data : [data];
    const scriptIds: string[] = [];
    
    schemas.forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      const scriptId = `structured-data-${Date.now()}-${Math.random()}`;
      script.id = scriptId;
      scriptIds.push(scriptId);
      document.head.appendChild(script);
    });

    // 清理函数：组件卸载时移除所有 script 标签
    return () => {
      scriptIds.forEach((id) => {
        const existingScript = document.getElementById(id);
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      });
    };
  }, [data]);

  return null;
}
