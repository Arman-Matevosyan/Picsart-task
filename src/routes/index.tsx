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
  import("@features/search").then((module) => ({
    default: module.SearchResultsPage,
  }))
);

const SuspenseFallback = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
    <p>Loading...</p>
  </div>
);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <Gallery />
      </Suspense>
    ),
  },
  {
    path: "/photo/:source/:id",
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <PhotoDetails />
      </Suspense>
    ),
  },
  {
    path: "/search",
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <SearchResults />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
