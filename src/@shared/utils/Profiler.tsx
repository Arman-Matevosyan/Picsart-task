import { FC, Profiler, ProfilerOnRenderCallback, ReactNode } from "react";

interface PerformanceProfilerProps {
  id: string;
  children: ReactNode;
  onRenderThreshold?: number; // milliseconds
}

/**
 * Performance profiler component that logs render durations in development mode
 *
 * Reference: https://reactjs.org/docs/profiler.html
 */
export const PerformanceProfiler: FC<PerformanceProfilerProps> = ({
  id,
  children,
  onRenderThreshold = 16, // Default to 16ms (1 frame at 60fps)
}) => {
  if (import.meta.env.DEV) {
    const handleRender: ProfilerOnRenderCallback = (
      id,
      phase,
      actualDuration
    ) => {
      if (actualDuration > onRenderThreshold) {
        console.info(
          `[Profiler] ${id} took ${actualDuration.toFixed(
            2
          )}ms to render (${phase})`
        );

        if (actualDuration > 50) {
          console.warn(
            `[Profiler] ⚠️ ${id} render time exceeds 50ms - consider optimizing`
          );
        }
      }
    };

    return (
      <Profiler id={id} onRender={handleRender}>
        {children}
      </Profiler>
    );
  }

  // in prod, just render children with no overhead
  return <>{children}</>;
};
