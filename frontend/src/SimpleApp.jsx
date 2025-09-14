import React from 'react';
import Analytics from './Analytics.jsx';

// Mock hashed user id (in production the backend or auth layer should provide this)
const hashedUser = 'sha256_hashed_user_abc123';

const AdCreative = ({ assignment, onInteraction }) => {
  // Track impression when component mounts (only once)
  React.useEffect(() => {
    onInteraction('impression', assignment.variant);
  }, [assignment.variant]); // Removed onInteraction from dependencies to prevent re-runs

  // render different creative based on assignment.variant
  const adHtml = assignment.variant === 'control'
    ? (<div><h3>Control Ad</h3><p>Original creative - Standard message.</p></div>)
    : (<div><h3>Treatment Ad</h3><p>New creative with enhanced CTA and better copy!</p></div>);

  const handleClick = () => {
    // Track click event
    onInteraction('click', assignment.variant);
    console.log('Button clicked!', assignment.variant);
    alert(`${assignment.variant} ad clicked! Check the dashboard below to see updated results! 📊`);
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #4CAF50', 
      borderRadius: '8px', 
      margin: '10px 0',
      backgroundColor: assignment.variant === 'control' ? '#e3f2fd' : '#fce4ec'
    }}>
      <div style={{ marginBottom: '15px' }}>
        <small style={{ color: '#666', fontSize: '12px' }}>
          Variant: <strong>{assignment.variant}</strong> | 
          Assignment ID: {assignment.assignment_id}
        </small>
      </div>
      {adHtml}
      <button 
        onClick={handleClick}
        style={{
          padding: '10px 20px',
          backgroundColor: assignment.variant === 'control' ? '#2196F3' : '#e91e63',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px',
          fontSize: '14px'
        }}
      >
        {assignment.variant === 'control' ? 'Learn More' : 'Get Started Now!'}
      </button>
    </div>
  );
};

const Page = ({ onInteraction }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [assignment, setAssignment] = React.useState(null);

  React.useEffect(() => {
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const mockAssignment = {
        experiment_id: 'AdCreative_V1_vs_Control_2025-09-15',
        user_id: 'user-123',
        variant: Math.random() > 0.5 ? 'treatment' : 'control',
        assignment_id: `AdCreative_V1_vs_Control_2025-09-15|${Math.random() > 0.5 ? 'treatment' : 'control'}`,
        bucket: Math.floor(Math.random() * 10000)
      };
      setAssignment(mockAssignment);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div style={{ 
        padding: '20px', 
        border: '2px solid #ff9800', 
        borderRadius: '8px', 
        margin: '10px 0',
        backgroundColor: '#fff3e0',
        textAlign: 'center'
      }}>
        <h3>⏳ Loading experiment...</h3>
        <p>Fetching A/B test assignment...</p>
        <div style={{ fontSize: '24px' }}>🔄</div>
      </div>
    );
  }
  
  return <AdCreative assignment={assignment} onInteraction={onInteraction} />;
};

export default function SimpleApp() {
  return (
    <div>
      <Analytics />
    </div>
  );
}
