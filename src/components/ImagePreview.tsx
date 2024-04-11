import styled from "@emotion/styled";
import AssetUrls from "../common/AssetUrls";

interface Props {
  imgDetail: any;
  changebackgroundImage: any;
  index: number;
}
const ImageContainer = styled.div`
  margin: 20px 0;
  cursor: pointer;
  position: relative;
`;
const PreviewImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
`;
const OkIcon = styled.img`
  width: 60px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const ImagePreview = (props: Props) => {
  const { imgDetail, changebackgroundImage, index } = props;

  return (
    <ImageContainer>
      <PreviewImage
        src={imgDetail.imgUrl}
        onClick={() => changebackgroundImage(imgDetail, index)}
      />
      {imgDetail.isActive && <OkIcon src={AssetUrls.OK_ICON} />}
    </ImageContainer>
  );
};

export default ImagePreview;
