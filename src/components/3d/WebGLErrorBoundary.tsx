import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary that catches WebGL/Canvas initialization failures
 * and renders a static gradient fallback matching the void aesthetic.
 */
export default class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={`absolute inset-0 ${this.props.className ?? ""}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(260,20%,3%)] via-black to-black" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(42 90% 55% / 0.06) 0%, transparent 70%)",
            }}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
