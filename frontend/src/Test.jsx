import React from 'react';

export default function Test() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      border: '2px solid red',
      fontSize: '24px',
      textAlign: 'center'
    }}>
      <h1>🎯 TEST PAGE - React is Working!</h1>
      <p>If you can see this, React is loading properly.</p>
      <button onClick={() => alert('Button works!')}>
        Click Me to Test
      </button>
    </div>
  );
}
