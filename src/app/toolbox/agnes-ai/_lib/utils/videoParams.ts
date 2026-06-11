/** Agnes 视频 API 允许的帧数（须满足 8n+1） */
export const ALLOWED_FRAME_COUNTS = [81, 121, 161, 241, 441];

/** 各帧率对应的最大视频时长（秒） */
export const FPS_MAX_DURATION = {
  24: 15,
  30: 10,
  60: 5,
};

export const FPS_OPTIONS = [
  { value: 24, label: '24 FPS（最长 15s）' },
  { value: 30, label: '30 FPS（最长 10s）' },
  { value: 60, label: '60 FPS（最长 5s）' },
];

export function getVideoDuration(numFrames: number, frameRate: number) {
  return numFrames / frameRate;
}

export function getMaxDuration(frameRate: number) {
  return FPS_MAX_DURATION[frameRate as keyof typeof FPS_MAX_DURATION] ?? 15;
}

/** 根据帧率过滤合法帧数选项 */
export function getFrameOptionsForFps(frameRate: number) {
  const maxDuration = getMaxDuration(frameRate);
  return ALLOWED_FRAME_COUNTS.filter((frames) => getVideoDuration(frames, frameRate) <= maxDuration)
    .map((frames) => {
      const seconds = getVideoDuration(frames, frameRate);
      return {
        value: frames,
        label: `${frames} 帧（约 ${seconds.toFixed(1)}s）`,
      };
    });
}

export function validateVideoParams({
  numFrames,
  frameRate,
}: {
  numFrames: number;
  frameRate: number;
}) {
  if (!ALLOWED_FRAME_COUNTS.includes(numFrames)) {
    return `帧数必须为 ${ALLOWED_FRAME_COUNTS.join('、')} 之一`;
  }
  const maxDuration = getMaxDuration(frameRate);
  const duration = getVideoDuration(numFrames, frameRate);
  if (duration > maxDuration) {
    return `${frameRate} FPS 下视频时长不能超过 ${maxDuration}s（当前约 ${duration.toFixed(1)}s）`;
  }
  return null;
}
