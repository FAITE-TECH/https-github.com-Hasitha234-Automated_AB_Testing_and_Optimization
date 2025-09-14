import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAssignment } from './api/experimentApi';

const ExperimentContext = createContext();

export const ExperimentProvider = ({ children }) => {
  const [assignments, setAssignments] = useState({});

  const fetchAssignment = async ({ experiment_id, user_id, variants }) => {
    // if already assigned in memory, return
    const key = `${experiment_id}|${user_id}`;
    if (assignments[key]) return assignments[key];

    // try localStorage cache to persist across reloads
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      setAssignments(prev => ({ ...prev, [key]: parsed }));
      return parsed;
    }

    const payload = { experiment_id, user_id, variants };
    const res = await getAssignment(payload);
    localStorage.setItem(key, JSON.stringify(res));
    setAssignments(prev => ({ ...prev, [key]: res }));
    return res;
  };

  return (
    <ExperimentContext.Provider value={{ fetchAssignment, assignments }}>
      {children}
    </ExperimentContext.Provider>
  );
};

export const useExperimentContext = () => useContext(ExperimentContext);
