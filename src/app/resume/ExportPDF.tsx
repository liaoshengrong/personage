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

  const handleExportPDF = async () => {
    const resumeContent = document.getElementById('ResumeCardContainer');
    if (!resumeContent || loading) return;

    try {
      setLoading(true);
      const resp = await fetch(
        `/api/resume/export-pdf?name=${encodeURIComponent(name || 'resume')}`,
        { method: 'GET' }
      );
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