import { useEffect, useState } from 'react';
import { useExperimentContext } from '../experimentProvider';

// helper hook to get assignment for a user+experiment
export const useExperiment = ({ experiment_id, user_id, variants }) => {
  const { fetchAssignment } = useExperimentContext();
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const a = await fetchAssignment({ experiment_id, user_id, variants });
      if (mounted) setAssignment(a);
    })();
    return () => { mounted = false; };
  }, [experiment_id, user_id, JSON.stringify(variants)]); // variants stable

  return assignment;
};
