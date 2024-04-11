import { CloseCircleTwoTone } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Radio, message } from "antd";
import { useEffect, useState } from "react";
import ImagePreview from "./ImagePreview";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

interface HelperProps {
  backgroundValue?: string;
  isThemeLight?: boolean;
}
const Container = styled.div<HelperProps>`
  padding: 8px 10px;
  height: 100%;
  transition: all 0.3s;
  background-color: ${({ isThemeLight, backgroundValue }) =>
    isThemeLight || backgroundValue == "light" ? "var(--white)" : "#202124"};
  color: ${({ isThemeLight }) => (isThemeLight ? "#202124" : "var(--white)")};
`;
const TopNotch = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const RadioGroup = styled(Radio.Group)`
  width: 100% !important;
  display: flex !important;
  flex-direction: row;
  justify-content: center;
  margin-top: 200px;
`;
const styleObj = {
  width: "100%",
};
interface Props {
  experimentalSetup?: boolean;
  setExperimentalSetup: (value: boolean) => void;
  backgroundImageDetail?: any;
  setBackgroundDetail?: any;
  user: any;
  setIsThemeLight: (value: boolean) => void;
  isThemeLight?: boolean;
}

const SideMenu = (props: Props) => {
  const {
    experimentalSetup,
    setExperimentalSetup,
    backgroundImageDetail,
    setBackgroundDetail,
    user,
    setIsThemeLight,
    isThemeLight,
  } = props;
  const [backgroundValue, setBackgroundValue] = useState<string>("dark");

  const deleteAllThemeEntities = async () => {
    const themeRef = collection(db, `users/${user.uid}/theme`);
    const themeSnapshot = await getDocs(themeRef);
    themeSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  };
  const handleRadioChange = async (e: any) => {
    setBackgroundValue(e.target.value);
    setIsThemeLight(e.target.value === "light" ? true : false);
    await deleteAllThemeEntities();
    await addDoc(
      collection(db, `users/${user.uid}/theme`),
      e.target.value === "light" ? { theme: "light" } : { theme: "dark" }
    );
  };
  const changebackgroundImage = async (imgDetail: any, index: number) => {
    const output = backgroundImageDetail.map(async (item: any) => {
      if (item.id === imgDetail.id) {
        const q = query(collection(db, `users/${user.uid}/imagesDatabase`));
        const querySnapshot = await getDocs(q);
        const queryId = querySnapshot.docs[item.id].id;
        const userRef = collection(db, "users");
        const documentRef = doc(userRef, user.uid, "imagesDatabase", queryId);
        const payload = { ...item, isActive: true };
        updateDoc(documentRef, payload);
        return payload;
      } else {
        const q = query(collection(db, `users/${user.uid}/imagesDatabase`));
        const querySnapshot = await getDocs(q);
        const queryId = querySnapshot.docs[item.id].id;
        const userRef = collection(db, "users");
        const documentRef = doc(userRef, user.uid, "imagesDatabase", queryId);
        const payload = { ...item, isActive: false };
        updateDoc(documentRef, payload);
        return payload;
      }
    });
    setBackgroundDetail(output);
  };
  return (
    <>
      <Container backgroundValue={backgroundValue} isThemeLight={isThemeLight}>
        <TopNotch>
          <p>Customize in your own way</p>
          <CloseCircleTwoTone
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={() => setExperimentalSetup(!experimentalSetup)}
          />
        </TopNotch>
        <p>-------- Choose your theme --------</p>
        <RadioGroup
          onChange={(e) => handleRadioChange(e)}
          value={isThemeLight ? "light" : "dark"}
          buttonStyle="solid"
          size={"large"}
        >
          <Radio.Button style={styleObj} value="light">
            Light
          </Radio.Button>
          <Radio.Button style={styleObj} value="dark">
            Dark
          </Radio.Button>
        </RadioGroup>
        <p>Choose Background</p>
        <div>
          {backgroundImageDetail?.map((data: any, index: number) => (
            <ImagePreview
              imgDetail={data}
              index={index}
              changebackgroundImage={changebackgroundImage}
            />
          ))}
        </div>
      </Container>
    </>
  );
};
export default SideMenu;
