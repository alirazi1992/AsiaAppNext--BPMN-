import React, { ErrorInfo } from 'react';  

interface ErrorBoundaryProps {  
  children: React.ReactNode;  
}  

interface ErrorBoundaryState {  
  hasError: boolean;  
}  

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {  
  constructor(props: ErrorBoundaryProps) {  
    super(props);  
    this.state = { hasError: false };  
  }  

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {  
    return { hasError: true };  
  }  

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {  
    console.error({ error, errorInfo });  
  }  

  render() {  
    if (this.state.hasError) {   
      return (  
        <div>  
          <h2>Oops, there is an error!</h2>  
          <button  
            type="button"  
            onClick={() => this.setState({ hasError: false })}  
          >  
            Try again?  
          </button>  
        </div>  
      );  
    }   
    return this.props.children;  
  }  
}  

export default ErrorBoundary;