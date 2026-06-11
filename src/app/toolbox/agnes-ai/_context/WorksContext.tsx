'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadWorks, addWork as addWorkToStore, updateWork as updateWorkToStore } from '../_lib/store/works';

const WorksContext = createContext(null);

export function WorksProvider({ children }) {
  const [works, setWorks] = useState(loadWorks);
  const [selectedWorkId, setSelectedWorkId] = useState(null);

  useEffect(() => {
    const sync = () => setWorks(loadWorks());
    window.addEventListener('agnes-works-update', sync);
    return () => window.removeEventListener('agnes-works-update', sync);
  }, []);

  const addWork = useCallback((work) => {
    addWorkToStore(work);
    setWorks(loadWorks());
    return work;
  }, []);

  const updateWork = useCallback((id, patch) => {
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
