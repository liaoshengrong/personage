'use client';

import { useState } from 'react';
import { generateImage } from '../_lib/api/client';
import { useWorks } from '../_context/WorksContext';
import { createWorkId, WORK_STATUS } from '../_lib/store/works';
import type { Model } from '../_lib/models';

const SIZES = ['1024x1024', '1024x768', '768x1024', '1152x768'];

export default function ImagePanel({ model }: { model: Model }) {
  const { addWork, updateWork } = useWorks();
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [referenceImage, setReferenceImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; revisedPrompt?: string } | null>(null);
  const [error, setError] = useState('');

  const generate = async () => {
    const text = prompt.trim();
    if (!text || loading) return;

    const workId = createWorkId();
    addWork({
      id: workId,
      type: 'image',
      modelId: model.id,
      modelName: model.name,
      prompt: text,
      status: WORK_STATUS.GENERATING,
      url: null,
      error: null,
      videoId: null,
      progress: 0,
      subStatus: null,
      createdAt: Date.now(),
      completedAt: null,
      meta: { size },
    });

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await generateImage({
        model: model.id,
        prompt: text,
        size,
        image: referenceImage || imageUrl.trim() || undefined,
      });
      const item = data.data?.[0];
      const url = item?.url || (item?.b64_json ? `data:image/png;base64,${item.b64_json}` : null);
      if (!url) throw new Error('未返回图像数据');
      setResult({ url, revisedPrompt: item.revised_prompt });
      updateWork(workId, {
        status: WORK_STATUS.COMPLETED,
        url,
        completedAt: Date.now(),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误';
      setError(message);
      updateWork(workId, {
        status: WORK_STATUS.FAILED,
        error: message,
        completedAt: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel image-panel">
      <header className="panel-header">
        <div>
          <h2>{model.name}</h2>
          <p>{model.description}</p>
        </div>
      </header>

      <div className="panel-body">
        <div className="form-section">
          <label htmlFor="img-prompt">描述 Prompt</label>
          <textarea
            id="img-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想生成的图像，例如：未来城市日落天际线，赛博朋克风格…"
            rows={4}
          />

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="img-size">尺寸</label>
              <select id="img-size" value={size} onChange={(e) => setSize(e.target.value)}>
                {SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="img-url">参考图 URL（可选，图生图）</label>
            <input
              id="img-url"
              type="url"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                if (e.target.value) setReferenceImage('');
              }}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-field">
            <label htmlFor="img-file">或上传本地图片（base64）</label>
            <input
              id="img-file"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImageUrl('');
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === 'string') setReferenceImage(reader.result);
                };
                reader.readAsDataURL(file);
              }}
            />
            {referenceImage && (
              <div className="ref-preview">
                <img src={referenceImage} alt="参考图" />
                <button type="button" className="btn-ghost" onClick={() => setReferenceImage('')}>
                  移除
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={generate}
            disabled={loading || !prompt.trim()}
          >
            {loading ? '生成中…' : '生成图像'}
          </button>

          {error && <div className="error-banner">{error}</div>}
        </div>

        <div className="result-section">
          {loading && (
            <div className="result-placeholder loading-state">
              <div className="spinner" />
              <p>正在绘制图像…</p>
            </div>
          )}
          {!loading && result && (
            <div className="image-result">
              <img src={result.url} alt={prompt} />
              {result.revisedPrompt && (
                <p className="revised-prompt">优化 Prompt：{result.revisedPrompt}</p>
              )}
              <a href={result.url} target="_blank" rel="noreferrer" className="btn-link">
                在新标签页打开
              </a>
            </div>
          )}
          {!loading && !result && !error && (
            <div className="result-placeholder">
              <div className="placeholder-icon">🖼</div>
              <p>生成的图像将显示在这里</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
