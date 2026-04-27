// ─────────────────────────────────────────────────────────
// useResumeStorage.jsx — Shared resume state across tools
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'certifyroi_resume_data';

export function useResumeStorage() {
  const [resumeData, setResumeData] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load resume from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setResumeData(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse stored resume:', err);
      }
    }
  }, []);

  // Save resume to localStorage
  const saveResume = useCallback((data, file = null) => {
    try {
      const dataToStore = {
        content: data,
        timestamp: new Date().toISOString(),
        fileName: file?.name || 'resume',
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      setResumeData(dataToStore);
      if (file) setResumeFile(file);
      return true;
    } catch (err) {
      console.error('Failed to save resume:', err);
      return false;
    }
  }, []);

  // Clear resume data
  const clearResume = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setResumeData(null);
      setResumeFile(null);
      return true;
    } catch (err) {
      console.error('Failed to clear resume:', err);
      return false;
    }
  }, []);

  // Check if resume exists
  const hasResume = useCallback(() => {
    return !!resumeData;
  }, [resumeData]);

  // Get resume content
  const getResume = useCallback(() => {
    return resumeData?.content || null;
  }, [resumeData]);

  return {
    resumeData,
    resumeFile,
    isLoading,
    saveResume,
    clearResume,
    hasResume,
    getResume,
  };
}

export default useResumeStorage;
