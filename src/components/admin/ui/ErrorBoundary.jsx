import React, { Component } from 'react';
import { Button, Card } from './index';
import '../../../styles/components/ui/ErrorBoundary.scss';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      eventId: Date.now().toString()
    });

    // Here you could send the error to an error reporting service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // Integration with error reporting services like Sentry, LogRocket, etc.
    if (window.console && window.console.group) {
      console.group('🚨 Error Boundary Caught An Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  copyErrorToClipboard = async () => {
    const errorText = `
Error: ${this.state.error?.message || 'Unknown error'}
Event ID: ${this.state.eventId}
Stack: ${this.state.error?.stack || 'No stack trace'}
Component Stack: ${this.state.errorInfo?.componentStack || 'No component stack'}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorText);
      // You could show a toast notification here
      console.log('Error details copied to clipboard');
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, showDetails = false } = this.props;
      
      // Use custom fallback if provided
      if (Fallback) {
        return (
          <Fallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            eventId={this.state.eventId}
            onRetry={this.handleRetry}
            onReload={this.handleReload}
          />
        );
      }

      // Default error UI
      return (
        <div className="admin-error-boundary">
          <Card className="admin-error-boundary__card">
            <div className="admin-error-boundary__content">
              <div className="admin-error-boundary__icon">
                💥
              </div>
              
              <div className="admin-error-boundary__text">
                <h2 className="admin-error-boundary__title">
                  Oops! Something went wrong
                </h2>
                
                <p className="admin-error-boundary__message">
                  We're sorry, but something unexpected happened. The error has been logged 
                  and we're working on a fix.
                </p>
                
                {this.state.eventId && (
                  <p className="admin-error-boundary__event-id">
                    <strong>Error ID:</strong> {this.state.eventId}
                  </p>
                )}
              </div>
            </div>

            <div className="admin-error-boundary__actions">
              <Button
                variant="primary"
                onClick={this.handleRetry}
                leftIcon="🔄"
              >
                Try Again
              </Button>
              
              <Button
                variant="outline"
                onClick={this.handleReload}
                leftIcon="⟳"
              >
                Reload Page
              </Button>
              
              {showDetails && (
                <Button
                  variant="ghost"
                  size="small"
                  onClick={this.copyErrorToClipboard}
                  leftIcon="📋"
                >
                  Copy Error Details
                </Button>
              )}
            </div>

            {showDetails && this.state.error && (
              <details className="admin-error-boundary__details">
                <summary className="admin-error-boundary__details-summary">
                  Technical Details
                </summary>
                <div className="admin-error-boundary__error-details">
                  <div className="admin-error-boundary__error-section">
                    <h4>Error Message:</h4>
                    <pre>{this.state.error.message}</pre>
                  </div>
                  
                  {this.state.error.stack && (
                    <div className="admin-error-boundary__error-section">
                      <h4>Stack Trace:</h4>
                      <pre>{this.state.error.stack}</pre>
                    </div>
                  )}
                  
                  {this.state.errorInfo?.componentStack && (
                    <div className="admin-error-boundary__error-section">
                      <h4>Component Stack:</h4>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export const useErrorHandler = () => {
  return (error, errorInfo = {}) => {
    console.error('Error handled by useErrorHandler:', error);
    
    // Here you could integrate with error reporting services
    if (window.console && window.console.group) {
      console.group('🚨 Error Handler');
      console.error('Error:', error);
      console.error('Additional Info:', errorInfo);
      console.groupEnd();
    }
  };
};

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = (WrappedComponent, errorBoundaryProps = {}) => {
  return function WithErrorBoundaryComponent(props) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
};

export default ErrorBoundary;