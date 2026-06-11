'use client';

import { useMemo, useRef, useState } from 'react';
import PromptComposer, { OptimizeIcon, PromptChip, RandomIcon } from './PromptComposer';
import { createVideoTask, pollVideoTask } from '../_lib/api/client';
import { optimizeVideoPrompt } from '../_lib/optimizePrompt';
import { useWorks } from '../_context/WorksContext';
import { createWorkId, WORK_STATUS } from '../_lib/store/works';
import {
  FPS_OPTIONS,
  getFrameOptionsForFps,
  getVideoDuration,
  validateVideoParams,
} from '../_lib/utils/videoParams';
import type { Model } from '../_lib/models';

const RESOLUTIONS = [
  { width: 1152, height: 768, label: '1152 × 768' },
  { width: 768, height: 1152, label: '768 × 1152' },
  { width: 1024, height: 576, label: '1024 × 576' },
];

const STATUS_LABEL: Record<string, string> = {
  queued: '排队中',
  in_progress: '生成中',
  processing: '处理中',
  completed: '已完成',
  failed: '失败',
};

const RANDOM_VIDEO_PROMPTS = [
  '国漫风格，电影感慢镜头，25岁御姐站在落地窗边，黑色大波浪长发随空调微风轻轻飘动，她缓缓转身面向镜头，眼神从疏离到微微撩人，城市夜景霓虹在玻璃上流动反光，深V黑色吊带裙，侧光勾勒肩线与锁骨，镜头从中景缓慢推近至面部特写，现代中国审美，色调冷蓝与暖金交织',
  '国漫恋爱番风格，20岁少女站在校园公寓阳台，齐肩黑直发与空气刘海被晚风拂起，她低头害羞后又抬眼望向镜头，白色针织短上衣，背景是渐变的橙紫晚霞，镜头固定机位浅景深，花瓣或光斑偶尔飘过画面前景，清新治愈，动作轻柔连贯',
  '现代国风国漫，御姐穿改良旗袍在中式酒吧中缓缓穿行，高开衩随步伐若隐若现，盘发配金簪，她停步侧身回眸，眼尾微挑，暖色顶光与冷色霓虹交替扫过面庞，镜头侧面跟拍后环绕至正面，丝绸质感在光下流动，性感有品位',
  '国漫男主禁欲系，28岁男性靠坐书房皮沙发，解开两颗扣的白衬衫，窗外雨丝滑落玻璃，他缓慢抬眼望向镜头，黑色碎发微动，小臂线条在冷色台灯光下清晰，镜头从全景推至中景，侧脸轮廓光，国产都市剧男主动漫化，雨夜氛围',
  '国漫痞帅男主，黄昏公路边，微卷中分男生倚靠复古摩托，他拿起头盔转头对镜头坏笑，皮夹克被晚风吹动，金色逆光勾勒下颌线，远处公路延伸消失于地平线，镜头低角度缓慢环绕半圈，公路电影调色，动感自然',
  '新中式国漫男主，竹林晨雾中持折扇缓步前行，改良汉服衣摆随步伐轻摆，长发半束，他停步展开折扇遮半面，桃花眼透过扇缘看镜头，水墨晕染背景中雾气流动，镜头平稳向前推进，清冷贵气，天官赐福类画风',
  '超写实摄影风格，25岁中国都市女性在咖啡馆落地窗前，她端起咖啡杯轻抿一口后放下，抬眼对镜头浅笑，黑色长发滑落肩侧，米色针织开衫，午后柔光透过玻璃，浅景深，85mm 质感，镜头极缓推近，现代中国审美，高级松弛感',
  '电影级写实，御姐气质中国女生穿红色缎面晚礼服，在上海外滩夜景中缓步向前，盘发露出颈肩线条，霓虹 bokeh 在身后流动，她走到栏杆边停下回望镜头，伦勃朗光，镜头跟拍后轻微环绕，像国产都市电影女主角片段',
  '写实时尚街拍，22岁中国女生在武康路梧桐街道自然行走，牛仔外套与阔腿裤随步伐摆动，她转头看向镜头，清透裸妆，阳光穿过树叶形成斑驳光点，镜头手持轻微跟拍，胶片色调，Vogue 中文版街拍视频感',
  '写实商业风，30岁中国男性在玻璃幕墙办公室整理领带后走向落地窗，深灰定制西装，城市天际线在背后延伸，他停步侧脸望向窗外再转向镜头，冷调精英感，镜头从背后跟拍绕至侧面中景，国产都市剧男主宣传质感',
  '三亚泳池写实，中国年轻女性从水中缓缓起身，湿发贴颈，白色连体泳衣外搭亚麻衬衫，水珠沿锁骨滑落，金色日落逆光，她抬手撩发望向海平线，镜头低角度缓慢上升，运动画报风格，活力健康性感',
  '电影感慢镜头，清晨薄雾中的江南水乡，乌篷船从石桥下缓缓驶过，船娘摇橹划开涟漪，两岸垂柳轻摆，白鹭低掠水面，粉墙黛瓦在暖色晨光中逐渐清晰，镜头平稳向前推进，青绿与暖金色调，宁静诗意',
  '黄昏海滨栈道，穿白色长裙的中国女孩背对镜头缓步前行，海风拂动发丝与裙摆，脚下木栈道延伸向海平线，海浪有节奏拍打礁石，天空由橙金渐变为紫红，镜头缓慢跟随，温暖浪漫，电影质感',
  '雨夜赛博朋克都市，中国年轻女性撑透明伞穿行霓虹街道，地面如镜倒映蓝紫粉招牌，湿润路面反射车灯，她停步抬头看全息广告，发丝与伞沿水珠滑落，镜头从高处缓降跟拍，光影层次丰富，现代中国夜生活审美',
  '秋日金色麦田，柴犬在麦浪中欢快奔跑，耳朵随步伐弹动，侧后方阳光形成轮廓光，远处红色风车缓慢转动，镜头低角度跟拍，色调饱和温暖，治愈自由，乡村田园气息',
  '深夜赛博朋克小巷，机械猫从阴影走出，幽蓝眼睛闪烁，墙面发光涂鸦与全息广告流动，地面潮湿反光薄雾弥漫，镜头缓慢推进，蓝紫霓虹对比强烈，悬疑科幻氛围',
  '雪山黎明湖泊，湖面如镜倒映雪峰与朝霞，天鹅优雅滑过留下水痕，岸边薄霜松林，第一缕阳光染金山尖，镜头从湖面低位缓慢抬升，写实圣洁，纪录片风格',
  '复古蒸汽火车穿越深秋山林，白色蒸汽喷涌，枫叶被气流卷起飞旋，丁达尔光束穿过林间，镜头侧面跟拍，怀旧胶片质感，韵律感强',
  '繁忙咖啡馆午后，拿铁热气缓缓升腾，奶泡拉花细微颤动，窗外行人模糊走过，雨滴轻敲玻璃，镜头极缓推近杯面，暖黄灯光，慵懒惬意',
  '春日樱花公园，花瓣随风密集飘落，母女牵手漫步，女孩伸手接花瓣，阳光透过花枝洒下光点，镜头手持轻微晃动，粉白与嫩绿，温馨治愈',
];

function pickRandomPrompt() {
  return RANDOM_VIDEO_PROMPTS[Math.floor(Math.random() * RANDOM_VIDEO_PROMPTS.length)];
}

export default function VideoPanel({ model }: { model: Model }) {
  const { addWork, updateWork } = useWorks();
  const [prompt, setPrompt] = useState('');
  const [frameRate, setFrameRate] = useState(24);
  const [numFrames, setNumFrames] = useState(121);
  const [resolution, setResolution] = useState(RESOLUTIONS[0]);
  const [referenceImage, setReferenceImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [progress, setProgress] = useState<{ status: string; progress: number; videoId?: string } | null>(null);
  const [result, setResult] = useState<{ url: string; videoId: string } | null>(null);
  const [error, setError] = useState('');
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const frameOptions = useMemo(() => getFrameOptionsForFps(frameRate), [frameRate]);

  const scrollPromptToBottom = () => {
    const el = promptInputRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  const optimizePrompt = async () => {
    const text = prompt.trim();
    if (!text || optimizing || loading) return;

    setOptimizing(true);
    setError('');

    try {
      const optimized = await optimizeVideoPrompt(text, {
        onDelta: (content) => {
          setPrompt(content);
          requestAnimationFrame(scrollPromptToBottom);
        },
      });
      setPrompt(optimized);
      requestAnimationFrame(scrollPromptToBottom);
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误';
      setError(message);
      setPrompt(text);
    } finally {
      setOptimizing(false);
    }
  };

  const handleFrameRateChange = (nextFrameRate: number) => {
    const options = getFrameOptionsForFps(nextFrameRate);
    setFrameRate(nextFrameRate);
    if (!options.some((f) => f.value === numFrames)) {
      setNumFrames(options[options.length - 1]?.value ?? 121);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setReferenceImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const generate = async () => {
    const text = prompt.trim();
    if (!text || loading) return;

    const validationError = validateVideoParams({ numFrames, frameRate });
    if (validationError) {
      setError(validationError);
      return;
    }

    const workId = createWorkId();
    addWork({
      id: workId,
      type: 'video',
      modelId: model.id,
      modelName: model.name,
      prompt: text,
      status: WORK_STATUS.GENERATING,
      url: null,
      error: null,
      videoId: null,
      progress: 0,
      subStatus: 'queued',
      createdAt: Date.now(),
      completedAt: null,
      meta: {
        numFrames,
        frameRate,
        resolution: `${resolution.width}x${resolution.height}`,
      },
    });

    setLoading(true);
    setError('');
    setResult(null);
    setProgress({ status: 'queued', progress: 0 });

    try {
      const task = await createVideoTask({
        model: model.id,
        prompt: text,
        width: resolution.width,
        height: resolution.height,
        numFrames,
        frameRate,
        image: referenceImage || undefined,
      });

      const videoId = task.video_id;
      if (!videoId) throw new Error('未返回 video_id，无法查询视频结果');

      updateWork(workId, { videoId, subStatus: 'queued' });

      const final = await pollVideoTask(videoId, {
        onProgress: ({ status, progress: pct, videoId: vid }) => {
          setProgress({ status, progress: pct, videoId: vid });
          updateWork(workId, { subStatus: status, progress: pct, videoId: vid });
        },
      });

      setResult({ url: final.videoUrl, videoId });
      updateWork(workId, {
        status: WORK_STATUS.COMPLETED,
        url: final.videoUrl,
        progress: 100,
        subStatus: 'completed',
        completedAt: Date.now(),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误';
      setError(message);
      updateWork(workId, {
        status: WORK_STATUS.FAILED,
        error: message,
        subStatus: 'failed',
        completedAt: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const duration = getVideoDuration(numFrames, frameRate);

  return (
    <div className="panel video-panel">
      <header className="panel-header">
        <div>
          <h2>{model.name}</h2>
          <p>{model.description}</p>
        </div>
      </header>

      <div className="panel-body">
        <div className="form-section">
          <PromptComposer
            id="vid-prompt"
            label="视频描述 Prompt"
            tip="描述运动、镜头与时间变化 · 中英文均可"
            variant="video"
            badgeLabel="视频"
            value={prompt}
            onChange={setPrompt}
            placeholder="描述视频场景、主体动作与镜头运动，例如：女孩在樱花树下缓步前行，花瓣飘落，镜头缓慢跟随…"
            inputRef={promptInputRef}
            readOnly={optimizing}
            actions={
              <>
                <PromptChip
                  accent
                  disabled={loading || optimizing || !prompt.trim()}
                  onClick={optimizePrompt}
                >
                  <OptimizeIcon />
                  {optimizing ? '优化中…' : '优化'}
                </PromptChip>
                <PromptChip
                  disabled={loading || optimizing}
                  onClick={() => setPrompt(pickRandomPrompt())}
                >
                  <RandomIcon />
                  随机
                </PromptChip>
              </>
            }
          />

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="vid-fps">帧率</label>
              <select
                id="vid-fps"
                value={frameRate}
                onChange={(e) => handleFrameRateChange(Number(e.target.value))}
              >
                {FPS_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="vid-frames">帧数</label>
              <select
                id="vid-frames"
                value={numFrames}
                onChange={(e) => setNumFrames(Number(e.target.value))}
              >
                {frameOptions.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="form-hint">
            预计时长约 {duration.toFixed(1)}s · 使用 video_id 查询结果，轮询间隔 5s
          </p>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="vid-res">分辨率</label>
              <select
                id="vid-res"
                value={`${resolution.width}x${resolution.height}`}
                onChange={(e) => {
                  const found = RESOLUTIONS.find(
                    (r) => `${r.width}x${r.height}` === e.target.value,
                  );
                  if (found) setResolution(found);
                }}
              >
                {RESOLUTIONS.map((r) => (
                  <option key={r.label} value={`${r.width}x${r.height}`}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="vid-image">参考图（可选，图生视频）</label>
            <input id="vid-image" type="file" accept="image/*" onChange={handleImageUpload} />
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
            disabled={loading || optimizing || !prompt.trim()}
          >
            {loading ? '生成中…' : '生成视频'}
          </button>

          {progress && loading && (
            <div className="progress-bar-wrap">
              <div className="progress-meta">
                <span>{STATUS_LABEL[progress.status] || progress.status}</span>
                <span>{progress.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress.progress}%` }} />
              </div>
              {progress.videoId && (
                <p className="task-id">Video ID：{progress.videoId}</p>
              )}
            </div>
          )}

          {error && <div className="error-banner">{error}</div>}
        </div>

        <div className="result-section">
          {loading && !result && (
            <div className="result-placeholder loading-state">
              <div className="spinner" />
              <p>视频生成通常需要 1–5 分钟，排队时可能更久…</p>
            </div>
          )}
          {!loading && result?.url && (
            <div className="video-result">
              <video src={result.url} controls autoPlay loop />
              <a href={result.url} target="_blank" rel="noreferrer" className="btn-link">
                下载 / 在新标签页打开
              </a>
            </div>
          )}
          {!loading && !result && !error && (
            <div className="result-placeholder">
              <div className="placeholder-icon">🎬</div>
              <p>生成的视频将显示在这里</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
