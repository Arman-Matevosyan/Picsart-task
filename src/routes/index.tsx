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
  <div 
    style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      flexDirection: "column", 
      padding: "2rem",
      minHeight: "80vh",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          height: "56px",
          marginBottom: "24px",
          background: "#f0f0f0",
          borderRadius: "8px",
        }}
      />
      
      <div 
        style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i}
            style={{ 
              paddingBottom: "66.67%",
              background: "#f0f0f0",
              borderRadius: "8px",
            }} 
          />
        ))}
      </div>
    </div>
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
