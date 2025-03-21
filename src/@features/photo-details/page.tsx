import { Button, Image } from "@design-system/components";
import ThemeToggle from "@design-system/components/ThemeToggle";
import { ApiSources } from "@shared/constants";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import PhotoDetailsSkeleton from "./components/PhotoDetails";
import { usePhotoDetails } from "./hooks/usePhotoDetails";

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
  min-height: 100%;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textPrimary};
  transition: background-color 0.3s ease, color 0.3s ease;

  @media (max-width: 768px) {
    padding: 16px 8px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled(Button)`
  display: inline-flex;
  align-items: center;

  &::before {
    content: "←";
    margin-right: 8px;
  }
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 40px;
  }
`;

const ImageContainer = styled.div`
  flex: 2;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const InfoContainer = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: ${(props) => props.theme.colors.textPrimary};
  transition: color 0.3s ease;
`;

const InfoItem = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.h3`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: 4px;
  transition: color 0.3s ease;
`;

const Value = styled.p`
  font-size: 1.1rem;
  color: ${(props) => props.theme.colors.textPrimary};
  transition: color 0.3s ease;
`;

const ExternalLink = styled.a`
  color: ${(props) => props.theme.colors.primary};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primaryDark};
    text-decoration: underline;
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  background-color: ${(props) =>
    props.theme.mode === "dark" ? props.theme.colors.danger + "22" : "#fff5f5"};
  color: ${(props) => props.theme.colors.danger};
  border-radius: 8px;
  margin: 20px 0;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

export const PhotoDetailsPage: FC = () => {
  const { source, id } = useParams<{
    source: "pexels" | "unsplash";
    id: string;
  }>();
  const navigate = useNavigate();

  // define a default source to use if source is invalid
  const validSource =
    source && (source === ApiSources.Pexels || source === ApiSources.Unsplash)
      ? source
      : ApiSources.Pexels;

  const {
    data: photo,
    isLoading,
    error,
  } = usePhotoDetails(id || "", validSource as ApiSources);

  if (!source || !id) {
    navigate("/");
    return null;
  }

  // Get the best available image URL
  const getHighQualityImage = () => {
    if (!photo || !photo.src) return null;

    return photo.src.original || photo.src.large || photo.src.medium;
  };

  const highQualityImageUrl = getHighQualityImage();

  if (error) {
    return (
      <Container>
        <HeaderContainer>
          <BackButton variant="text" onClick={() => navigate(-1)}>
            Back to Gallery
          </BackButton>
          <ThemeToggle />
        </HeaderContainer>
        <ErrorContainer>
          <p>Error loading photo details. Please try again later.</p>
          {error && <p>{String(error)}</p>}
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderContainer>
        <BackButton variant="text" onClick={() => navigate(-1)}>
          Back to Gallery
        </BackButton>
        <ThemeToggle />
      </HeaderContainer>

      {isLoading ? (
        <PhotoDetailsSkeleton />
      ) : (
        photo && (
          <DetailsContainer>
            <ImageContainer>
              {highQualityImageUrl ? (
                <Image
                  src={highQualityImageUrl}
                  alt={photo.alt}
                  rounded
                  aspectRatio={photo.width / photo.height}
                  fit="contain"
                  style={{
                    width: "100%",
                    height: "auto",
                    position: "relative",
                  }}
                />
              ) : (
                <div
                  style={{
                    backgroundColor: photo.avgColor || "#f0f0f0",
                    width: "100%",
                    aspectRatio: photo.width / photo.height,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                  }}
                >
                  <p>Image not available</p>
                </div>
              )}
            </ImageContainer>

            <InfoContainer>
              <Title>{photo.alt}</Title>

              {photo.description && (
                <InfoItem>
                  <Label>Description</Label>
                  <Value>{photo.description}</Value>
                </InfoItem>
              )}

              <InfoItem>
                <Label>Photographer</Label>
                <Value>
                  {photo.photographerUrl ? (
                    <ExternalLink
                      href={photo.photographerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {photo.photographer}
                    </ExternalLink>
                  ) : (
                    photo.photographer
                  )}
                </Value>
              </InfoItem>

              {photo.dateAdded && (
                <InfoItem>
                  <Label>Date Added</Label>
                  <Value>
                    {new Date(photo.dateAdded).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Value>
                </InfoItem>
              )}

              <InfoItem>
                <Label>Source</Label>
                <Value>
                  {photo.source === "pexels" ? (
                    <ExternalLink
                      href="https://www.pexels.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pexels
                    </ExternalLink>
                  ) : (
                    <ExternalLink
                      href="https://unsplash.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Unsplash
                    </ExternalLink>
                  )}
                </Value>
              </InfoItem>

              <InfoItem>
                <Label>Dimensions</Label>
                <Value>
                  {photo.width} × {photo.height} pixels
                </Value>
              </InfoItem>
            </InfoContainer>
          </DetailsContainer>
        )
      )}
    </Container>
  );
};
