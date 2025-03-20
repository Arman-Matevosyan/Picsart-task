import { Component, ErrorInfo, ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  min-height: 200px;
  background-color: #fff5f5;
  border-radius: 8px;
  margin: 2rem 0;
`;

const ErrorHeading = styled.h2`
  color: #e53e3e;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  margin-bottom: 1rem;
  color: #4a5568;
`;

const ErrorStack = styled.pre`
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 4px;
  overflow: auto;
  font-size: 0.875rem;
  margin-top: 1rem;
  max-width: 100%;
  text-align: left;
`;

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorHeading>Something went wrong</ErrorHeading>
          <ErrorMessage>
            An error occurred while rendering this component.
          </ErrorMessage>
          {this.state.error && (
            <>
              <ErrorMessage>{this.state.error.message}</ErrorMessage>
              <ErrorStack>{this.state.error.stack}</ErrorStack>
            </>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
