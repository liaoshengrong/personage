'use client';

import { useState, useMemo, useEffect } from 'react';
import { createVideoTask, pollVideoTask } from '../_lib/api/client';
import { useWorks } from '../_context/WorksContext';
import { createWorkId, WORK_STATUS } from '../_lib/store/works';
import {
  FPS_OPTIONS,
  getFrameOptionsForFps,
  getVideoDuration,
  validateVideoParams,
} from '../_lib/utils/videoParams';

const RESOLUTIONS = [
  { width: 1152, height: 768, label: '1152 × 768' },
  { width: 768, height: 1152, label: '768 × 1152' },
  { width: 1024, height: 576, label: '1024 × 576' },
];

const STATUS_LABEL = {
  queued: '排队中',
  in_progress: '生成中',
  processing: '处理中',
  completed: '已完成',
  failed: '失败',
};

const RANDOM_VIDEO_PROMPTS = [
  '电影感慢镜头，清晨薄雾笼罩的江南水乡，一行白鹭低掠水面，乌篷船从古朴石桥下缓缓驶过，船娘摇橹划开层层涟漪，两岸垂柳随风轻摆，远处粉墙黛瓦在暖色晨光中逐渐清晰，水面倒映天光云影，偶尔有炊烟从屋顶升起，整体氛围宁静诗意，色调偏青绿与暖金，镜头平稳向前推进，主体运动舒缓自然，细节层次丰富写实，适合用作文旅宣传短片开场。',
  '黄昏时分的海滨栈道，一位穿白色长裙的女孩背对镜头缓步前行，海风拂动发丝与裙摆，脚下老旧木栈道延伸至远方海平线，右侧深蓝海浪有节奏地拍打礁石溅起细碎浪花，天空由橙金渐变为紫红，远处灯塔亮起暖光，海鸥掠过画面，画面温暖浪漫富有电影质感，镜头跟随人物缓慢移动，光影过渡柔和细腻，情绪舒缓治愈。',
  '雨后的东京涩谷十字路口，地面如镜倒映霓虹招牌与车灯，行人撑透明雨伞匆匆穿行，红绿灯交替闪烁，蒸汽从路边小吃摊袅袅升起，湿润路面反射出蓝紫粉交织的赛博朋克色调，远处列车驶过高架桥带起轻微震动，城市节奏感强烈却带一丝雨夜静谧，镜头从高处缓缓下降俯拍，光影层次丰富，街景细节清晰。',
  '秋日午后金色麦田，一只柴犬欢快奔跑其间，耳朵随步伐上下弹动，麦浪在风中起伏如海，阳光从侧后方打来形成轮廓光，远处可见红色风车缓慢转动，偶尔有落叶与草籽飘入画面，空气里仿佛带着麦香，色调饱和温暖，镜头低角度跟拍宠物视角，运动轨迹连贯流畅，充满治愈、自由与乡村田园气息。',
  '深夜赛博朋克风格的城市小巷，两侧墙面布满发光涂鸦与全息广告，地面潮湿反光，薄雾在巷口弥漫，一只机械猫从阴影中走出，眼睛发出幽蓝光芒，远处传来隐约警笛与电流嗡鸣，偶有行人撑伞匆匆经过，蓝紫霓虹主导色调对比强烈，镜头缓慢推进营造悬疑科幻氛围，雨雾与灯光交织，适合科幻短片氛围铺垫。',
  '雪山脚下清澈湖泊的黎明，湖面平静如镜倒映巍峨雪峰与朝霞，一只天鹅优雅滑过水面留下长长水痕，岸边松林覆着薄霜，第一缕阳光照亮山尖染成金色，空气清冽通透可见呼吸白雾，远处山谷有薄云流动，镜头从湖面低位缓慢抬升展现壮阔全景，风格写实圣洁，画面通透富有层次，适合自然风光纪录片风格。',
  '复古蒸汽火车穿越深秋山林，车头喷出浓厚白色蒸汽，铁轨两旁枫叶火红与金黄交织，落叶被气流卷起在空中飞旋，阳光穿过林间形成丁达尔光束，车厢窗户映出暖色灯光与乘客剪影，伴随车轮与铁轨的节奏感与汽笛回响，镜头侧面跟拍，怀旧胶片质感浓郁，运动与光影富有韵律，充满公路旅行与时代变迁感。',
  '繁忙咖啡馆的午后窗边，一杯拿铁热气缓缓升腾，奶泡拉花细微颤动，窗外行人模糊走过带起光影流动，雨滴轻敲玻璃形成水珠滑落轨迹，室内暖黄灯光柔和，背景隐约可见咖啡机蒸汽与低语交谈，桌上摊开一本旧书与眼镜，浅景深特写，镜头极缓推近杯面，氛围慵懒惬意，蒸汽与光影细节动人，适合生活方式短片。',
  '广袤沙漠日落时分，驼队剪影在金色沙丘脊线上缓缓前行，风吹起细沙如薄雾流动，太阳接近地平线将天空染成橙红至靛蓝渐变，沙丘表面光影明暗交错纹理细腻，远处偶尔可见枯木与风蚀岩石，驼铃仿佛可闻，镜头航拍缓慢环绕，史诗感与孤独感并存，沙粒飞扬质感真实，适合冒险题材电影片头氛围。',
  '春日樱花盛开的公园小径，花瓣随风密集飘落如雪，一对母女牵手漫步其间，女孩伸手试图接住花瓣，阳光透过花枝洒下斑驳光点，草地新绿柔软，远处有野餐人群虚化，粉白与嫩绿主色调清新明亮，镜头手持轻微晃动增强真实感，人物动作轻柔自然，温馨治愈，适合家庭主题短片或日系文艺风格视频。',
  '水下珊瑚礁世界，阳光从海面穿透形成摇曳光柱，热带鱼群穿梭游动闪烁蓝黄条纹，海龟从容划水前进，珊瑚随水流轻微摇曳，气泡缓缓上升，海水清澈透亮带蓝绿渐变，远处隐约可见潜水员身影，镜头缓慢平移跟随鱼群，纪录片风格，色彩鲜艳生机勃勃，水体通透光影灵动，适合海洋科普或治愈系自然视频。',
  '冬夜北欧小镇街道，鹅毛大雪静静飘落，路灯投下暖黄光圈，烟囱冒出袅袅白烟，橱窗内陈列圣诞装饰闪烁微光，一串脚印深浅延伸向远处，积雪覆盖屋顶、长椅与红色邮筒，偶尔有孩童跑过留下笑声虚化，整体冷暖对比柔和，镜头从街角缓慢横移，雪花飘落轨迹清晰，童话般宁静祥和，适合节日氛围短片。',
];

function pickRandomPrompt() {
  return RANDOM_VIDEO_PROMPTS[Math.floor(Math.random() * RANDOM_VIDEO_PROMPTS.length)];
}

export default function VideoPanel({ model }) {
  const { addWork, updateWork } = useWorks();
  const [prompt, setPrompt] = useState('');
  const [frameRate, setFrameRate] = useState(24);
  const [numFrames, setNumFrames] = useState(121);
  const [resolution, setResolution] = useState(RESOLUTIONS[0]);
  const [referenceImage, setReferenceImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const frameOptions = useMemo(() => getFrameOptionsForFps(frameRate), [frameRate]);

  useEffect(() => {
    if (!frameOptions.some((f) => f.value === numFrames)) {
      setNumFrames(frameOptions[frameOptions.length - 1]?.value ?? 121);
    }
  }, [frameOptions, numFrames]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setReferenceImage(reader.result);
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
      setError(err.message);
      updateWork(workId, {
        status: WORK_STATUS.FAILED,
        error: err.message,
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
          <label htmlFor="vid-prompt">视频描述 Prompt</label>
          <textarea
            id="vid-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述视频场景与运动，例如：一只猫在海滩日落时分漫步，柔和海浪，温暖金色光线…"
            rows={4}
          />
          <div className="prompt-actions">
            <button
              type="button"
              className="btn-ghost btn-random"
              onClick={() => setPrompt(pickRandomPrompt())}
              disabled={loading}
            >
              随机
            </button>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="vid-fps">帧率</label>
              <select
                id="vid-fps"
                value={frameRate}
                onChange={(e) => setFrameRate(Number(e.target.value))}
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
            disabled={loading || !prompt.trim()}
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
