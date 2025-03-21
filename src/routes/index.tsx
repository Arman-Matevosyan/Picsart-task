import { ErrorBoundary } from "@shared/components/ErrorBoundary";
import AppLayout from "@shared/layout/AppLayout";
import { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";

const Gallery = lazy(() =>
  import("@features/gallery").then((module) => ({
    default: module.GalleryPage,
  }))
);

const PhotoDetails = lazy(() =>
  import("@features/photo-details").then((module) => ({
    default: module.PhotoDetailsPage,
  }))
);

const SearchResults = lazy(() =>
  import("@features/search").then((module) => ({ default: module.Search }))
);

const SuspenseFallback = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
    <p>Loading...</p>
  </div>
);

const PageWrapper = ({
  Component,
  layoutProps = {},
}: {
  Component: React.LazyExoticComponent<React.ComponentType<any>>;
  layoutProps?: {
    title?: string;
    showSearchBar?: boolean;
    showBackButton?: boolean;
  };
}) => (
  <ErrorBoundary>
    <Suspense fallback={<SuspenseFallback />}>
      <AppLayout {...layoutProps}>
        <Component />
      </AppLayout>
    </Suspense>
  </ErrorBoundary>
);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <PageWrapper Component={Gallery} />,
  },
  {
    path: "/photo/:source/:id",
    element: (
      <PageWrapper
        Component={PhotoDetails}
        layoutProps={{
          showSearchBar: false,
          showBackButton: true,
          title: "Photo Details",
        }}
      />
    ),
  },
  {
    path: "/search",
    element: (
      <PageWrapper
        Component={SearchResults}
        layoutProps={{
          title: "Search Results",
        }}
      />
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export default routes;
