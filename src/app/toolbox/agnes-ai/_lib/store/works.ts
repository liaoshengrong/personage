const STORAGE_KEY = 'agnes_works';
const MAX_WORKS = 100;

export const WORK_STATUS = {
  GENERATING: 'generating',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type WorkStatus = (typeof WORK_STATUS)[keyof typeof WORK_STATUS];

export type Work = {
  id: string;
  type: 'image' | 'video';
  modelId: string;
  modelName: string;
  prompt: string;
  status: WorkStatus;
  url: string | null;
  error: string | null;
  videoId: string | null;
  progress: number;
  subStatus: string | null;
  createdAt: number;
  completedAt: number | null;
  meta?: Record<string, unknown>;
};

export function createWorkId() {
  return `work_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function notify() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('agnes-works-update'));
  }
}

export function loadWorks(): Work[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Work[]) : [];
  } catch {
    return [];
  }
}

function persist(works: Work[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(works.slice(0, MAX_WORKS)));
  notify();
}

export function addWork(work: Work) {
  const works = loadWorks();
  persist([work, ...works]);
  return work;
}

export function updateWork(id: string, patch: Partial<Work>) {
  const works = loadWorks();
  const next = works.map((w) => (w.id === id ? { ...w, ...patch } : w));
  persist(next);
}

export function getGeneratingVideos() {
  return loadWorks().filter(
    (w) => w.type === 'video' && w.status === WORK_STATUS.GENERATING && w.videoId,
  );
}

export const STATUS_LABELS = {
  generating: '生成中',
  completed: '已完成',
  failed: '失败',
};
