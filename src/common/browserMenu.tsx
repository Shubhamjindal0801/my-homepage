import styled from "@emotion/styled";

const BrowserLogo = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  padding-top: 10px;
`;
export const browserMenu = [
  {
    value: "https://www.yahoo.com/",
    label: (
      <BrowserLogo src="https://cdn-icons-png.flaticon.com/512/4096/4096478.png" />
    ),
    name: "Yahoo",
    imgUrl:
      "https://freelogopng.com/images/all_img/1681905373yahoo-logo-png.png",
  },
  {
    value: "https://www.google.com/",
    label: (
      <BrowserLogo src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png" />
    ),
    name: "Google",
    imgUrl: "https://img36.ropose.com/normal/google1710088764417.png",
  },
  {
    value: "https://www.bing.com/",
    label: (
      <BrowserLogo src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Bing_Fluent_Logo.svg" />
    ),
    name: "Bing",
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Bing_logo.svg/2560px-Bing_logo.svg.png",
  },
  {
    value: "https://duckduckgo.com/",
    label: (
      <BrowserLogo src="https://upload.wikimedia.org/wikipedia/en/9/90/The_DuckDuckGo_Duck.png" />
    ),
    name: "DuckDuckGo",
    imgUrl: "https://logodix.com/logo/48333.png",
  },
  {
    value: "https://yandex.com/",
    label: (
      <BrowserLogo src="https://companieslogo.com/img/orig/YNDX.ME-8acd53c0.png?t=1648284928" />
    ),
    name: "Yandex",
    imgUrl: "https://img36.ropose.com/normal/yandex-21710088899673.svg",
  },
  {
    value: "https://ask.com/",
    label: (
      <BrowserLogo src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Ask.com_Logo.svg/1200px-Ask.com_Logo.svg.png" />
    ),
    name: "Ask.com",
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Ask.com_Logo.svg/2560px-Ask.com_Logo.svg.png",
  },
];
