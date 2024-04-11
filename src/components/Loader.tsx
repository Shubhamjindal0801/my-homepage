import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import React from "react";

const anim = keyframes`
0% {
    top: 0;
  }
  50% {
    top: 6px;
  }
  100% {
    top: 0;
  }
`;
const LoaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
const LoaderDot = styled.span`
  width: 15px;
  height: 15px;
  display: block;
  background: #ff0000;
  border-radius: 50%;
  position: relative;
  margin: 0 5px;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  animation-name: ${anim};
  &:nth-of-type(1) {
    animation: ${anim} 1s linear 0s infinite;
    background: grey;
  }
  &:nth-of-type(2) {
    animation: ${anim} 1s linear 0.25s infinite;
    background: grey;
  }
  &:nth-of-type(3) {
    animation: ${anim} 1s linear 0.5s infinite;
    background: grey;
  }
`;

const Loader: React.FunctionComponent = () => {
  return (
    <>
      <LoaderContainer>
        <LoaderContainer>
          <LoaderDot></LoaderDot>
          <LoaderDot></LoaderDot>
          <LoaderDot></LoaderDot>
        </LoaderContainer>
      </LoaderContainer>
    </>
  );
};

export default Loader;
