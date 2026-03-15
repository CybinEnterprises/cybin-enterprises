console.log('🎯 App.tsx loading...');

function TestApp() {
  console.log('🎯 TestApp rendering...');
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: '#00d4b8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>🎯 Cybin Enterprises</h1>
        <p>Application is loading correctly!</p>
        <p>Mock mode: {import.meta.env.VITE_USE_MOCK}</p>
        <p>Dev mode: {import.meta.env.VITE_DEV_MODE}</p>
        <p>Build successful - no blank white page!</p>
      </div>
    </div>
  );
}

export default TestApp;
