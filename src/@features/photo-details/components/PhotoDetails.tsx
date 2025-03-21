import { Skeleton } from "@design-system/components/Skeleton";
import { FC } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
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
  display: flex;
  flex-direction: column;
`;

const TitleSkeleton = styled(Skeleton)`
  height: 40px;
  width: 80%;
  margin-bottom: 24px;
`;

const InfoItem = styled.div`
  margin-bottom: 20px;
`;

const LabelSkeleton = styled(Skeleton)`
  height: 20px;
  width: 30%;
  margin-bottom: 8px;
`;

const ValueSkeleton = styled(Skeleton)`
  height: 24px;
  width: 100%;
`;

const PhotoDetailsSkeleton: FC = () => {
  return (
    <Container>
      <ImageContainer>
        <Skeleton height={0} style={{ paddingBottom: "66.67%" }} />
      </ImageContainer>

      <InfoContainer>
        <TitleSkeleton />

        <InfoItem>
          <LabelSkeleton />
          <ValueSkeleton />
          <ValueSkeleton style={{ marginTop: 8, width: "80%" }} />
        </InfoItem>

        <InfoItem>
          <LabelSkeleton />
          <ValueSkeleton style={{ width: "60%" }} />
        </InfoItem>

        <InfoItem>
          <LabelSkeleton />
          <ValueSkeleton style={{ width: "40%" }} />
        </InfoItem>

        <InfoItem>
          <LabelSkeleton />
          <ValueSkeleton style={{ width: "30%" }} />
        </InfoItem>

        <InfoItem>
          <LabelSkeleton />
          <ValueSkeleton style={{ width: "50%" }} />
        </InfoItem>
      </InfoContainer>
    </Container>
  );
};

export default PhotoDetailsSkeleton;
