import React from 'react';
import { ExperimentProvider } from './experimentProvider';
import { useExperiment } from './hooks/useExperiment';
import { logger } from './utils/logger';

// mock hashed user id (in production the backend or auth layer should provide this)
const hashedUser = 'sha256_hashed_user_abc123';

const variants = [
  { name: 'control', allocation: 50 },
  { name: 'treatment', allocation: 50 }
];

const AdCreative = ({ assignment }) => {
  // render different creative based on assignment.variant
  const adHtml = assignment.variant === 'control'
    ? (<div><h3>Control Ad</h3><p>Original creative.</p></div>)
    : (<div><h3>Treatment Ad</h3><p>New creative with CTA.</p></div>);

  // log impression on mount
  React.useEffect(() => {
    (async () => {
      try {
        await logger.logImpression({
          user_id_hashed: hashedUser,
          assignment_id: assignment.assignment_id,
          ad_id: 'ad-001',
          campaign_id: 'campaign-x',
          page_url: window.location.href,
          device_type: /Mobi/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          geo_country: 'LK',
          session_id: 'session-123'
        });
      } catch (e) {
        console.error('impression log failed', e);
      }
    })();
  }, [assignment]);

  return (
    <div className="ad-creative">
      {adHtml}
      <button onClick={async () => {
        await logger.logClick({
          user_id_hashed: hashedUser,
          assignment_id: assignment.assignment_id,
          impression_id: 'impression-fallback'
        });
        // navigate to landing page or open modal
      }}>
        Click CTA
      </button>
    </div>
  );
};

const Page = () => {
  const assignment = useExperiment({ experiment_id: 'AdCreative_V1_vs_Control_2025-09-15', user_id: 'user-123', variants });
  if (!assignment) return <div>Loading experiment...</div>;
  return <AdCreative assignment={assignment} />;
};

export default function App() {
  return (
    <ExperimentProvider>
      <Page />
    </ExperimentProvider>
  );
}
