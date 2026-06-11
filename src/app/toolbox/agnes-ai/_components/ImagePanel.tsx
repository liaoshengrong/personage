'use client';

import { useRef, useState } from 'react';
import { generateImage } from '../_lib/api/client';
import { optimizeImagePrompt } from '../_lib/optimizePrompt';
import PromptComposer, { OptimizeIcon, PromptChip, RandomIcon } from './PromptComposer';
import { useWorks } from '../_context/WorksContext';
import { createWorkId, WORK_STATUS } from '../_lib/store/works';
import type { Model } from '../_lib/models';

const SIZES = ['1024x1024', '1024x768', '768x1024', '1152x768'];

const RANDOM_IMAGE_PROMPTS = [
  '国漫御姐，25岁，丹凤眼，柳叶眉，冷白皮，黑色大波浪长发，深V修身黑色吊带裙，锁骨与肩线清晰，慵懒倚靠落地窗，城市夜景霓虹反光，侧光勾勒轮廓，眼神疏离又撩人，现代中国审美，电影级光影',
  '现代国风御姐，改良旗袍高开衩，丝绸质感，盘发配金簪，眼尾微挑，红唇，侧身回眸，腰臀曲线自然，中式轻奢酒吧背景，暖色顶光与冷色环境光，性感有品位，现代中国审美',
  '20岁国漫少女，杏眼，自然卧蚕，齐肩黑直发，空气刘海，白色针织短上衣配高腰牛仔短裙，阳光透过窗帘，微微咬唇，害羞又好奇的眼神，校园公寓阳台，清新性感，国产恋爱番女主气质',
  '夏日泳池边动漫女生，丸子头，湿发贴颈，浅色比基尼外搭半透明防晒衬衫，水珠在锁骨，逆光剪影，皮肤通透，青春活力，现代中国审美下的健康性感',
  '国潮辣妹，挑染短发，金属耳环，crop top 露腰，低腰工装裤，涂鸦墙前单手插兜，闪光灯摄影感，自信张扬，像国内独立音乐MV女主，现代都市风',
  '夜店风动漫女生，亮片短外套，网纱内搭，烟熏妆，紫粉霓虹，动态pose，头发随动作飞扬，赛博都市背景，现代中国夜生活审美，电影级布光',
  '28岁国漫男主，剑眉星目，高鼻梁，薄唇，黑色碎发遮额，解开两颗扣的白衬衫，袖口挽起，小臂线条，靠坐真皮沙发，冷色调书房，窗外雨夜，侧脸轮廓光，禁欲克制，国产都市剧男主动漫化',
  '现代都市异能番男主，银灰短发，耳钉，黑色高领配长款风衣，站在天台边缘，风掀衣角，城市灯火在身后，眼神锋利，身材修长，低调性感，现代中国审美',
  '19岁阳光国漫男生，内双，小麦色健康肤色，运动短T，篮球馆，汗水在颈侧，灿烂笑容，肌肉线条自然，国产青春竞技番男主，动感光影',
  '痞帅动漫男生，微卷中分，皮夹克，黑色T恤，摩托车旁拿头盔，黄昏公路，逆光，下颌线清晰，坏笑，国内短视频常见的痞帅审美，电影级构图',
  '新中式动漫男主，改良汉服交领配现代长裤，长发半束，玉佩，桃花眼，持折扇，竹林晨雾，水墨晕染背景，清冷贵气，天官赐福类国漫精致画风，现代中国审美',
  '超写实人像摄影，25岁中国都市女性，自然东亚五官，精致淡妆，黑色长发，米色针织开衫配白色吊带，坐在咖啡馆落地窗前，午后柔光，浅景深，85mm镜头，杂志封面质感，现代中国审美，高级松弛感',
  '电影级写实人像，御姐气质中国女生，红色缎面吊带晚礼服，盘发露出颈肩线条，上海外滩夜景背景，霓虹 bokeh，伦勃朗光，像国产都市电影女主角剧照，性感优雅',
  '时尚街拍写实摄影，22岁中国女生，清透裸妆，牛仔外套配白色背心与高腰阔腿裤，上海武康路梧桐街道，自然 walking pose，胶片色调，Vogue 中文版街拍风格',
  '泳池写实摄影，中国年轻女性，健康小麦肤色，白色连体泳衣外搭亚麻衬衫，湿发，三亚海边日落，金色逆光，水珠在皮肤上的细节，运动画报风格，活力性感',
  '写实商业人像，30岁中国男性，剑眉深目，短寸头，深灰定制西装解开一颗扣，站在玻璃幕墙办公室，城市天际线倒影，冷调精英感，像国产都市剧男主宣传照',
  '电影剧照风写实，痞帅中国男生，28岁，微卷头发，黑色皮夹克，黄昏公路倚靠复古摩托，侧脸轮廓光，下颌线清晰，公路电影调色，国内审美下的成熟魅力',
  '新中式写实人像，中国男性，改良唐装立领配现代西裤，玉扳指，苏州园林月洞门背景，晨雾柔光，东方美学摄影，像文化杂志人物专访封面',
  '黑白写实人像摄影，中国女性，极简黑色高领，利落短发，纯色影棚背景，强侧光勾勒面部结构，情绪肖像，高级时尚感，像国内摄影师人像作品',
  '生活方式写实摄影，阳光少年感中国男生，白色T恤，校园操场看台，傍晚金色光线，抓拍自然笑容，清新干净，国产青春片海报质感',
  '轻奢酒店写实人像，中国女性，丝绸睡袍，慵懒坐在床沿，落地窗帘半开，清晨漫射光，私密又高级，商业广告摄影，现代中国都市审美',
];

function pickRandomPrompt() {
  return RANDOM_IMAGE_PROMPTS[Math.floor(Math.random() * RANDOM_IMAGE_PROMPTS.length)];
}

export default function ImagePanel({ model }: { model: Model }) {
  const { addWork, updateWork } = useWorks();
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [referenceImage, setReferenceImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [result, setResult] = useState<{ url: string; revisedPrompt?: string } | null>(null);
  const [error, setError] = useState('');
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

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
      const optimized = await optimizeImagePrompt(text, {
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
          <PromptComposer
            id="img-prompt"
            label="描述 Prompt"
            tip="中英文均可 · 越具体越好"
            variant="image"
            badgeLabel="图像"
            value={prompt}
            onChange={setPrompt}
            placeholder="描述你想生成的图像，例如：未来城市日落天际线，赛博朋克风格…"
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
            disabled={loading || optimizing || !prompt.trim()}
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
