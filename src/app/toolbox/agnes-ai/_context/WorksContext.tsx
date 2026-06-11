'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  loadWorks,
  addWork as addWorkToStore,
  updateWork as updateWorkToStore,
  type Work,
} from '../_lib/store/works';

type WorksContextValue = {
  works: Work[];
  addWork: (work: Work) => Work;
  updateWork: (id: string, patch: Partial<Work>) => void;
  selectedWork: Work | null;
  openWork: (id: string) => void;
  closeWork: () => void;
};

const WorksContext = createContext<WorksContextValue | null>(null);

export function WorksProvider({ children }: { children: React.ReactNode }) {
  const [works, setWorks] = useState<Work[]>(loadWorks);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setWorks(loadWorks());
    window.addEventListener('agnes-works-update', sync);
    return () => window.removeEventListener('agnes-works-update', sync);
  }, []);

  const addWork = useCallback((work: Work) => {
    addWorkToStore(work);
    setWorks(loadWorks());
    return work;
  }, []);

  const updateWork = useCallback((id: string, patch: Partial<Work>) => {
    updateWorkToStore(id, patch);
    setWorks(loadWorks());
  }, []);

  const selectedWork = works.find((w) => w.id === selectedWorkId) ?? null;

  return (
    <WorksContext.Provider
      value={{
        works,
        addWork,
        updateWork,
        selectedWork,
        openWork: setSelectedWorkId,
        closeWork: () => setSelectedWorkId(null),
      }}
    >
      {children}
    </WorksContext.Provider>
  );
}

export function useWorks() {
  const ctx = useContext(WorksContext);
  if (!ctx) throw new Error('useWorks must be used within WorksProvider');
  return ctx;
}
