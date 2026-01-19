interface StructuredDataProps {
  data: object | object[];
}

/**
 * 服务端结构化数据组件
 * 用于在服务端注入 JSON-LD 结构化数据，提升 SEO
 * 注意：此组件必须在服务端组件中使用
 */
export default function StructuredDataServer({ data }: StructuredDataProps) {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
