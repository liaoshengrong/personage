export const UNIVERSAL_MODEL = {
  id: 'universal',
  name: '通用对话',
  type: 'universal',
  description: '自动识别意图，至文本、图像或视频模型',
};

export const ROUTER_MODEL_ID = 'agnes-2.0-flash';

export const DEFAULT_ROUTE_MODELS = {
  text: 'agnes-2.0-flash',
  image: 'agnes-image-2.1-flash',
  video: 'agnes-video-v2.0',
};

export const MODEL_CATEGORIES = [
  {
    id: 'text',
    label: '文本',
    models: [
      {
        id: 'agnes-1.5-flash',
        name: 'Agnes 1.5 Flash',
        type: 'text',
        description: '轻量快速文本模型，适合日常对话与轻量任务',
      },
      {
        id: 'agnes-2.0-flash',
        name: 'Agnes 2.0 Flash',
        type: 'text',
        description: '旗舰文本模型，支持 Agent、工具调用与复杂推理',
      },
    ],
  },
  {
    id: 'image',
    label: '图像',
    models: [
      {
        id: 'agnes-image-2.0-flash',
        name: 'Agnes Image 2.0 Flash',
        type: 'image',
        description: '高质量图像生成，擅长图文排版与视觉创作',
      },
      {
        id: 'agnes-image-2.1-flash',
        name: 'Agnes Image 2.1 Flash',
        type: 'image',
        description: '新一代图像模型，生成速度更快、细节更丰富',
      },
    ],
  },
  {
    id: 'video',
    label: '视频',
    models: [
      {
        id: 'agnes-video-v2.0',
        name: 'Agnes Video V2.0',
        type: 'video',
        description: '电影级视频生成，支持文生视频与图生视频',
      },
    ],
  },
];

export const ALL_MODELS = MODEL_CATEGORIES.flatMap((c) => c.models);

export const DEFAULT_MODEL = UNIVERSAL_MODEL;
