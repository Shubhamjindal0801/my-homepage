import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Input, message } from "antd";
import AssetUrls from "../common/AssetUrls";
import { SendOutlined } from "@ant-design/icons";
import Loader from "./Loader";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Text from "antd/lib/typography/Text";

interface HelperProps {
  isSucess?: boolean;
  isThemeLight?: boolean;
}
const Container = styled.div<HelperProps>`
  position: relative;
  display: flex;
  min-height: 650px;
  flex-direction: column;
  height: 100%;
  border: 1px solid red;
  // justify-content: center;
  border-radius: 1rem;
  padding: 1rem 0.7rem;
  background-image: url(${AssetUrls.GEMINI_BACKGROUND_WALLPAPER});
  background-size: cover;
  repeat: no-repeat;
`;
const MessageBox = styled.div`
  position: absolute;
  width: 95%;
  bottom: 75px;
`;
const DefaultMsg = styled.p`
  position: absolute;
  top:50%;
  transform: translateY(-50%);
  text-align: center;
  font-size: 1.5rem;
  color: black;
  background-color: white;
  padding: 0.5rem;
  border-radius: 1rem;
  font-weight: bold;F
`;
const InputSearch = styled(Input)`
  position: absolute;
  bottom: 10px;
  width: 95%;
  padding: 0.6rem !important;
  border-radius: 1rem !important;
`;
const UserSendQuery = styled.div`
  // align-self: flex-end;
  float: right;
  background-color: #1890ff;
  width: fit-content;
  max-width: 65%;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 1rem;
  font-weight: bold;
`;

const LoaderContainer = styled.div`
  // align-self: flex-start;
  float: left;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
`;

const SystemSendResponse = styled.div<HelperProps>`
  // align-self: flex-start;
  float: left;
  background-color: ${(props) => (props.isSucess ? "lightgreen" : "#f44336")};
  width: fit-content;
  max-width: 65%;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 1rem;
  color: white;
  font-weight: bold;
`;
interface Props {
  isThemeLight: boolean;
}
const ChatBot = (props: Props) => {
  const { isThemeLight } = props;
  const [queryArray, setQueryArray] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<any>([]);
  const [showIntroText, setShowIntroText] = useState<string>("");

  useEffect(() => {
    const introText = "Start typing to chit chat with your personal assistant.";
    let counter = 0;
    const interval = setInterval(() => {
      if (counter <= introText.length) {
        setShowIntroText(introText.substring(0, counter));
        counter++;
      } else {
        clearInterval(interval);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const genAI = new GoogleGenerativeAI(
    "AIzaSyAmAG1YxiZCgl7cOmEq7XVqWLmf_FqJeUc"
  );

  const getResponse = async (q: string) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    model
      .generateContent(q)
      .then(async () => {
        setTimeout(() => {
          setShowLoader(true);
        }, 1500);
        const resultOutput = await model.generateContent(q);
        if (resultOutput?.response?.candidates) {
          const res = resultOutput?.response;
          const text = {
            result: res?.text(),
            isSuccess: true,
          };
          setShowLoader(false);
          setShowResult([...showResult, text]);
        }
        message.error("Safety check failed");
        setShowResult([
          ...showResult,
          { result: "Safety check failed", isSuccess: false },
        ]);
        setShowLoader(false);
      })
      .catch((error) => {
        message.error("Something went wrong");
        setShowResult([
          ...showResult,
          { result: "Something went wrong", isSuccess: false },
        ]);
        setShowLoader(false);
      });
  };

  const handleSubmitQuery = async () => {
    if (query) {
      setQueryArray([...queryArray, query]);
      setQuery("");
      await getResponse(query);
    }
  };

  return (
    <Container isThemeLight={isThemeLight}>
      <DefaultMsg>{showIntroText}</DefaultMsg>
      <MessageBox>
        {queryArray.map((query, index) => (
          <>
            <UserSendQuery key={index}>
              <Text copyable>{query}</Text>
            </UserSendQuery>
            {showResult[index] && (
              <SystemSendResponse
                isSucess={showResult[index].isSuccess}
                key={index}
              >
                <Text copyable={true}>{showResult[index].result}</Text>
              </SystemSendResponse>
            )}
          </>
        ))}
        {showLoader && (
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        )}
      </MessageBox>
      <InputSearch
        placeholder="Type your message here"
        autoFocus
        size="large"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        suffix={
          <SendOutlined
            style={{ cursor: "pointer" }}
            onClick={handleSubmitQuery}
          />
        }
        onPressEnter={handleSubmitQuery}
      />
    </Container>
  );
};

export default ChatBot;
