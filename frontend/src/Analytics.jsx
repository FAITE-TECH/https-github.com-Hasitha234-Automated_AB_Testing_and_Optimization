import React from 'react';

export default function Analytics() {
  // Track separate data for Variant A (control) and Variant B (treatment)
  const [analyticsData, setAnalyticsData] = React.useState(() => {
    // Load from localStorage if exists
    const saved = localStorage.getItem('simpleAnalytics');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      variantA: { views: 0, clicks: 0, conversions: 0 },
      variantB: { views: 0, clicks: 0, conversions: 0 }
    };
  });

  // Current variant being shown (randomly selected)
  const [currentVariant, setCurrentVariant] = React.useState(null);

  // Select a variant when component mounts
  React.useEffect(() => {
    const variant = Math.random() > 0.5 ? 'A' : 'B';
    setCurrentVariant(variant);
    
    // Track view for this variant
    const dataKey = variant === 'A' ? 'variantA' : 'variantB';
    setAnalyticsData(prev => {
      const newData = { ...prev };
      newData[dataKey].views += 1;
      localStorage.setItem('simpleAnalytics', JSON.stringify(newData));
      return newData;
    });
  }, []);

  // Handle button click
  const handleClick = () => {
    if (!currentVariant) return;
    
    const dataKey = currentVariant === 'A' ? 'variantA' : 'variantB';
    setAnalyticsData(prev => {
      const newData = { ...prev };
      newData[dataKey].clicks += 1;
      // For demo, every 3rd click is a conversion
      if (newData[dataKey].clicks % 3 === 0) {
        newData[dataKey].conversions += 1;
      }
      localStorage.setItem('simpleAnalytics', JSON.stringify(newData));
      return newData;
    });
  };

  // Clear all data
  const clearData = () => {
    const resetData = {
      variantA: { views: 0, clicks: 0, conversions: 0 },
      variantB: { views: 0, clicks: 0, conversions: 0 }
    };
    setAnalyticsData(resetData);
    localStorage.removeItem('simpleAnalytics');
    window.location.reload(); // Reload to get new variant
  };

  // Calculate conversion rates
  const calcRate = (conversions, views) => {
    if (views === 0) return 0;
    return ((conversions / views) * 100).toFixed(1);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* A/B Test Section */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '30px', 
        borderRadius: '8px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h2>A/B Test - Variant {currentVariant}</h2>
        {currentVariant === 'A' ? (
          <div>
            <h3>Standard Version</h3>
            <p>Original design with basic CTA</p>
            <button 
              onClick={handleClick}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Learn More
            </button>
          </div>
        ) : (
          <div>
            <h3>Enhanced Version</h3>
            <p>New design with improved CTA</p>
            <button 
              onClick={handleClick}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e91e63',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Get Started Now!
            </button>
          </div>
        )}
      </div>

      {/* Analytics Dashboard */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '30px', 
        borderRadius: '8px' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{ margin: 0 }}>Real-time Analytics</h1>
          <button 
            onClick={clearData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Data
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Variant A Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h2>Variant A</h2>
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span>Views:</span>
                <strong>{analyticsData.variantA.views}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span>Clicks:</span>
                <strong>{analyticsData.variantA.clicks}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span>Conversions:</span>
                <strong>{analyticsData.variantA.conversions}</strong>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px 0',
                borderTop: '1px solid #e0e0e0',
                marginTop: '10px'
              }}>
                <span>Conv. Rate:</span>
                <strong style={{ color: '#4285f4' }}>
                  {calcRate(analyticsData.variantA.conversions, analyticsData.variantA.views)}%
                </strong>
              </div>
            </div>
          </div>

          {/* Variant B Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h2>Variant B</h2>
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span>Views:</span>
                <strong>{analyticsData.variantB.views}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span>Clicks:</span>
                <strong>{analyticsData.variantB.clicks}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span>Conversions:</span>
                <strong>{analyticsData.variantB.conversions}</strong>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px 0',
                borderTop: '1px solid #e0e0e0',
                marginTop: '10px'
              }}>
                <span>Conv. Rate:</span>
                <strong style={{ color: '#4285f4' }}>
                  {calcRate(analyticsData.variantB.conversions, analyticsData.variantB.views)}%
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>Visual Comparison</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '200px' }}>
            {/* Variant A bars */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{
                  width: '40px',
                  height: `${Math.min(analyticsData.variantA.views * 2, 150)}px`,
                  backgroundColor: '#9db4c4'
                }}></div>
                <div style={{
                  width: '40px',
                  height: `${Math.min(analyticsData.variantA.clicks * 5, 150)}px`,
                  backgroundColor: '#4285f4'
                }}></div>
                <div style={{
                  width: '40px',
                  height: `${Math.min(analyticsData.variantA.conversions * 10, 150)}px`,
                  backgroundColor: '#34a853'
                }}></div>
              </div>
              <p style={{ marginTop: '10px' }}>Variant A</p>
            </div>
            
            {/* Variant B bars */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{
                  width: '40px',
                  height: `${Math.min(analyticsData.variantB.views * 2, 150)}px`,
                  backgroundColor: '#9db4c4'
                }}></div>
                <div style={{
                  width: '40px',
                  height: `${Math.min(analyticsData.variantB.clicks * 5, 150)}px`,
                  backgroundColor: '#4285f4'
                }}></div>
                <div style={{
                  width: '40px',
                  height: `${Math.min(analyticsData.variantB.conversions * 10, 150)}px`,
                  backgroundColor: '#34a853'
                }}></div>
              </div>
              <p style={{ marginTop: '10px' }}>Variant B</p>
            </div>
          </div>
          
          {/* Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#9db4c4' }}></div>
              <span>Views</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#4285f4' }}></div>
              <span>Clicks</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#34a853' }}></div>
              <span>Conversions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
