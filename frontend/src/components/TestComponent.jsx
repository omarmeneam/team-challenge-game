import React from 'react';

function TestComponent() {
  console.log('TestComponent rendered');
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#e0f2fe',
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h2>Test Component</h2>
      <p>If you can see this, React is working correctly!</p>
    </div>
  );
}

export default TestComponent;