'use client';
import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';

type ExportPDFProps = {
  name: string;
};

const ExportPDF: React.FC<ExportPDFProps> = ({ name }) => {
  const [loading, setLoading] = useState(false);

  const fileName = useMemo(() => {
    const safeName = (name || 'resume').trim() || 'resume';
    return `${safeName}-简历-${dayjs().format('YYYYMMDD')}.pdf`;
  }, [name]);

  const getNetlifyFunctionUrl = () => {
    if (typeof window === 'undefined') {
      return '/.netlify/functions/export-pdf';
    }
    // 相对路径即可，本地使用 `netlify dev` 时也会代理到函数
    return '/.netlify/functions/export-pdf';
  };

  const handleExportPDF = async () => {
    const resumeContent = document.getElementById('ResumeCardContainer');
    if (!resumeContent || loading) return;

    try {
      setLoading(true);
      const query = `?name=${encodeURIComponent(name || 'resume')}`;
      let resp = await fetch(`${getNetlifyFunctionUrl()}${query}`, {
        method: 'GET',
      });

      // 兜底：如果在纯 next dev 环境下（没有 netlify dev 代理），尝试走本地 Next API
      if (!resp.ok && typeof window !== 'undefined') {
        const { hostname, port } = window.location;
        if (hostname === 'localhost' && port === '8200') {
          resp = await fetch(`/api/resume/export-pdf${query}`, {
            method: 'GET',
          });
        }
      }

      if (!resp.ok) throw new Error(`export pdf failed: ${resp.status}`);

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={[
        'text-sm bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer select-none',
        loading ? 'opacity-60 pointer-events-none' : '',
      ].join(' ')}
      onClick={handleExportPDF}
    >
      {loading ? '导出中...' : '导出为PDF'}
    </div>
  );
};

export default ExportPDF;