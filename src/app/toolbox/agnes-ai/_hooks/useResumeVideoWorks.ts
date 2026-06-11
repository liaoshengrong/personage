'use client';

import { useEffect, useRef } from 'react';
import { pollVideoTask } from '../_lib/api/client';
import { getGeneratingVideos, WORK_STATUS } from '../_lib/store/works';
import { useWorks } from '../_context/WorksContext';

/** 页面刷新后恢复未完成的视频轮询 */
export function useResumeVideoWorks() {
  const { updateWork } = useWorks();
  const running = useRef(new Set());

  useEffect(() => {
    const pending = getGeneratingVideos();

    pending.forEach((work) => {
      if (running.current.has(work.id)) return;
      running.current.add(work.id);

      pollVideoTask(work.videoId, {
        onProgress: ({ status, progress }) => {
          updateWork(work.id, { subStatus: status, progress });
        },
      })
        .then((final) => {
          updateWork(work.id, {
            status: WORK_STATUS.COMPLETED,
            url: final.videoUrl,
            progress: 100,
            subStatus: 'completed',
            completedAt: Date.now(),
            error: null,
          });
        })
        .catch((err) => {
          updateWork(work.id, {
            status: WORK_STATUS.FAILED,
            error: err.message,
            subStatus: 'failed',
            completedAt: Date.now(),
          });
        })
        .finally(() => {
          running.current.delete(work.id);
        });
    });
  }, [updateWork]);
}
