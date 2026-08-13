import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// @ts-ignore
export class ErrorBoundary extends Component<Props, State> {
  // @ts-ignore
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in UI:", error, errorInfo);
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>Nimadur xato ketdi (Something went wrong)</h2>
          {/* @ts-ignore */}
          <p style={{ color: '#666' }}>{this.state.error?.message || 'Kutilmagan xatolik yuz berdi.'}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer' }}
          >
            Sahifani yangilash (Reload)
          </button>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}
