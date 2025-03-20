import { ErrorBoundary } from "@shared/components";
import { Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";

const SuspenseFallback = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
    <p>Loading...</p>
  </div>
);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <Suspense fallback={<SuspenseFallback />}>{/* Home */}</Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/photo/:source/:id",
    element: (
      <ErrorBoundary>
        <Suspense fallback={<SuspenseFallback />}>{/* Details */}</Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "/search",
    element: (
      <ErrorBoundary>
        <Suspense fallback={<SuspenseFallback />}>{/* Search */}</Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export default routes;
