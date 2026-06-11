const STORAGE_KEY = 'agnes_works';
const MAX_WORKS = 100;

export const WORK_STATUS = {
  GENERATING: 'generating',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export function createWorkId() {
  return `work_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function notify() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('agnes-works-update'));
  }
}

export function loadWorks() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(works: unknown[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(works.slice(0, MAX_WORKS)));
  notify();
}

export function addWork(work) {
  const works = loadWorks();
  persist([work, ...works]);
  return work;
}

export function updateWork(id, patch) {
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
