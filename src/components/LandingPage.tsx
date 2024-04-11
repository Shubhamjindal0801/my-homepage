import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
} from "firebase/firestore";
import axios from "axios";
import Header from "./Header";
import {
  FloatButton,
  Input,
  Menu,
  Modal,
  Select,
  Tooltip,
  message,
} from "antd";
import styled from "@emotion/styled";
import {
  AudioMutedOutlined,
  AudioOutlined,
  ExperimentOutlined,
  LoadingOutlined,
  PlusCircleFilled,
  RobotOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AddBookmark from "./AddBookmark";
import BookmarkTile from "./BookmarkTile";
import SideMenu from "./SideMenu";
import { browserMenu } from "../common/browserMenu";
import AssetUrls from "../common/AssetUrls";
import ChatBot from "./ChatBot";
import { imgData } from "../common/ImgData";
import { ImgDetails } from "../common/Interface/ImgDetails";
import { LeftClickMenu } from "../common/Interface/LeftClickMenu";
import { SearchSuggestion } from "../common/Interface/SearchSuggestion";
import { Bookmark } from "../common/Interface/Bookmark";
const News = React.lazy(() => import("./News"));

interface HelperProps {
  experimentalSetup?: boolean;
  backgroundImage?: string;
  isThemeLight?: boolean;
  top?: number | 0;
  left?: number | 0;
  totalWidth?: number | 0;
  totalHeight?: number | 0;
  isChatBotOpen?: boolean;
}
const Container = styled.div<HelperProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  background: url(${({ backgroundImage }) => backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
`;
const UserContainer = styled.div<HelperProps>`
  position: absolute;
  top: 20px;
  right: ${({ experimentalSetup }) => (experimentalSetup ? "370px" : "20px")};
  transition: all 0.3s;
`;
const LogoutLogo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  color: var(--white);
`;
const UserImg = styled.img`
  width: 30px;
  border-radius: 50%;
  cursor: pointer;
`;
const LogoutText = styled.p`
  color: var(--white);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  opacity: 0.5;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;
const WelcomeMsg = styled.h1`
  position: absolute;
  top: 15px;
`;
const SearchBox = styled.div`
  position: relative;
  top: -20px;
  border: none;
`;
const LogoContainer = styled.div`
  position: relative;
  top: 30px;
  margin: 1rem 0;
`;
const InputBox = styled(Input)<HelperProps>`
  padding: 1rem 2rem 1rem 7rem !important;
  border-radius: 10px !important;
  font-size: 1.15rem !important;
  width: ${({ isChatBotOpen, experimentalSetup }) =>
    isChatBotOpen || experimentalSetup ? "800px" : "1000px"} !important;
  background-color: ${({ isThemeLight }) =>
    isThemeLight ? "#fff" : "#202124"} !important;
  color: ${({ isThemeLight }) => (isThemeLight ? "#000" : "#fff")} !important;
  border: none !important;
  &:focus {
    outline: none;
  }
`;
const BrowserSelect = styled(Select)<HelperProps>`
  position: absolute;
  left: 0px;
  top: 0px;
  height: 62px;
  z-index: 100;
  border-radius: 10px;
  .ant-select-selector {
    background-color: ${({ isThemeLight }) =>
      isThemeLight ? "#fff" : "#202124"} !important;
  }
  .ant-select-arrow {
    color: ${({ isThemeLight }) => (isThemeLight ? "#000" : "#fff")} !important;
  }
`;
const SearchresultShow = styled.div`
  position: absolute;
  top: 63px;
  left: 5.6rem;
  right: 0;
  background-color: white;
  z-index: 10;
  border-radius: 10px;
  color: black;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 0;
`;
const SearchedQueryOption = styled.div`
  position: relative;
  padding: 0.7rem 1.4rem;
  &:hover {
    background-color: #2f2d30;
    opacity: 0.8;
    color: white;
    cursor: pointer;
    span {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 12px;
      background-color: blue;
      border-top-right-radius: 50%;
      border-bottom-right-radius: 50%;
    }
  }
`;

const Faviroutes = styled.div`
  position: relative;
  top: -30px;
  display: flex;
  gap: 0.5rem;
  width: 35%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;
const SideMenuConatiner = styled.div`
  position: fixed;
  z-index: 50;
  top: 0;
  bottom: 0;
  right: 0;
  width: 350px;
  background-color: var(--white);
  border-radius: 10px 0 0 10px;
`;
const CustomDiv = styled.div<HelperProps>`
  z-index: 100;
  position: absolute;
  top: ${({ top, totalHeight }) =>
    totalHeight && top && totalHeight - top > 200 && `${top}px`};
  bottom: ${({ top, totalHeight }) =>
    totalHeight && top && totalHeight - top < 200 && `${totalHeight - top}px`};
  left: ${({ left, totalWidth }) =>
    totalWidth && left && totalWidth - left > 200 && `${left}px`};
  right: ${({ left, totalWidth }) =>
    totalWidth && left && totalWidth - left < 200 && `${totalWidth - left}px`};
`;
const MenuContainer = styled(Menu)`
  width: 200px;
  padding: 1rem 0.5rem;
  border-radius: 10px;
  transition: all 0.3s;
  background-color: #2f2d30;
`;
const MenuItem = styled(Menu.Item)`
  color: white !important;
  font-weight: bold !important;
  &:hover {
    opacity: 0.4;
    color: black !important;
  }
`;
const ExperimentalFloatButton = styled(FloatButton)<HelperProps>`
  transition: all 0.3s;
  z-index: 100 !important;
  right: ${({ experimentalSetup }) => (experimentalSetup ? "370px" : "20px")};
  &:hover {
    transform: scale(1.3);
  }
`;
const ProfileDropdown = styled(Modal)`
  position: absolute;
  top: 5rem;
  right: 1rem;
  background-color: var(--white);
  border-radius: 10px;
  z-index: 100;
`;
const ProfilePicContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.7rem;
  align-items: center;
  img {
    width: 50px;
    border-radius: 50%;
  }
  p {
    margin: 0;
    font-weight: bold;
  }
`;
const ShortcutContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;
const GmailIcon = styled.div`
  cursor: pointer;
  img {
    width: 100px;
    height: 100px;
  }
`;
const PhotosIcon = styled.div`
  cursor: pointer;
  img {
    width: 100px;
    height: 100px;
  }
`;
const YoutubeIcon = styled.div`
  cursor: pointer;
  img {
    width: 100px;
    height: 100px;
  }
`;
const AddMoreBookmark = styled.div`
  position: relative;
  top: -30px;
  border-radius: 50%;
  background-color: #2f2d30;
  color: white;
  padding: 12px 1rem;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.12);
  }
`;
const MenuItems = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: white;
  font-weight: bold;
  span {
    color: white;
    font-weight: normal;
    opacity: 0.5;
  }
`;
const ChatBotIcon = styled(FloatButton)<HelperProps>`
  transition: all 0.3s;
  z-index: 100 !important;
  bottom: 100px;
  right: ${({ experimentalSetup }) => (experimentalSetup ? "370px" : "20px")};
  &:hover {
    transform: scale(1.3);
  }
`;
const Div = styled.div`
  position: absolute;
  width: 450px;
  max-height: 700px;
  bottom: 158px;
  right: 10px;
  overflow-y: auto;
  border-radius: 1rem;
`;

const LandingPage = () => {
  const [search, setSearch] = useState<string>("");
  const [listening, setListening] = useState<boolean>(false);
  const [user, loading] = useAuthState(auth);
  const [bookmarks, setBookmarks] = useState<any>(null);
  const [searchHistory, setSearchHistory] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [onlineStatus, setOnlineStatus] = useState<boolean>(false);
  const [experimentalSetup, setExperimentalSetup] = useState<boolean>(false);
  const [backgroundImageDetail, setBackgroundImageDetail] = useState<any>([]);
  const [backgroundImage, setBackgroundImage] = useState<string>();
  const [isThemeLight, setIsThemeLight] = useState<boolean>(false);
  const [sideDropDown, setSideDropDown] = useState<boolean>(false);
  const [topMargin, setTopMargin] = useState<number>(0);
  const [leftMargin, setLeftMargin] = useState<number>(0);
  const [totalWidth, setTotalWidth] = useState<number>(0);
  const [totalHeight, setTotalHeight] = useState<number>(0);
  const [profileDropdown, setProfileDropdown] = useState<boolean>(false);
  const [newsArticles, setNewsArticles] = useState([]);
  const [searchEngineUrl, setSearchEngineUrl] = useState<string>("");
  const [searchEngineName, setSearchEngineName] = useState<string>("");
  const [isChatBotOpen, setIsChatBotOpen] = useState<boolean>(false);
  const [isMac, setIsMac] = useState<boolean>(false);
  const [showEditLoader, setEditShowLoader] = useState<boolean>(false);
  const [showChatLoader, setChatShowLoader] = useState<boolean>(false);
  const [searchEngineLogoImage, setSearchEngineLogoImage] =
    useState<string>("");
  const navigate = useNavigate();
  const [searchSuggestions, setSearchSuggestions] = useState<any>([]);

  useEffect(() => {
    if (!user) return;
    setBackgroundImageDetail([]);
    getUserName();
    fetchBookmarks();
    getAllImages();
    getTheme();
    getSearchEngine();
  }, [user]);
  useEffect(() => {
    getAllImages();
  }, [backgroundImageDetail]);
  useEffect(() => {
    if (user) {
      navigate("/landing");
    }
  }, [user, loading]);
  const fetchBookmarks = async () => {
    if (user) {
      const q = query(collection(db, `users/${user.uid}/bookmarks`));
      const querySnapshot = await getDocs(q);
      let bookmarksArray: any[] = [];
      querySnapshot.forEach((doc) => {
        bookmarksArray.push(doc.data());
      });
      setBookmarks(bookmarksArray);
    }
  };
  const getUserName = async () => {
    try {
      if (!user) return;
      const q = query(collection(db, `users/${user.uid}/userDetails`));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        console.log("shubham", doc.data());
      });
    } catch (error) {
      message.error("Error fetching user data:");
    }
  };

  const getAllImages = async () => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/imagesDatabase`));
    let querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length <= 0) {
      imgData.forEach(async (img) => {
        try {
          await addDoc(collection(db, `users/${user.uid}/imagesDatabase`), img);
        } catch (error) {
          message.error("Error adding document:");
        }
      });
    }
    querySnapshot = await getDocs(q);
    let imagesArray: any[] = [];
    querySnapshot.forEach((doc) => {
      imagesArray.push(doc.data());
      setBackgroundImageDetail(imagesArray);
    });
    if (imagesArray.length > 0) {
      getBakcgroundWallpaper();
    } else {
      setBackgroundImage(AssetUrls.DEFAULT_BACKGROUND);
    }
  };
  const getTheme = async () => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/theme`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().theme === "dark") {
        setIsThemeLight(false);
      } else {
        setIsThemeLight(true);
      }
    });
  };
  const getSearchEngine = async () => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/searchEngine`));
    let querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length <= 0) {
      await addDoc(collection(db, `users/${user.uid}/searchEngine`), {
        searchEngineName: AssetUrls.DEFAULT_SEARCH_ENGINE_NAME,
        searchEngineUrl: AssetUrls.DEFAULT_SEARCH_ENGINE_URL,
        searchEngineLogoImage: AssetUrls.DEFAULT_SEARCH_ENGINE_LOGO_IMAGE,
      });
    }
    querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setSearchEngineUrl(
        doc.data().searchEngineUrl ?? AssetUrls.DEFAULT_SEARCH_ENGINE_URL
      );
      setSearchEngineName(doc.data().searchEngineName ?? "Google");
      setSearchEngineLogoImage(
        doc.data().searchEngineLogoImage ??
          AssetUrls.DEFAULT_SEARCH_ENGINE_LOGO_IMAGE
      );
    });
  };
  const getBakcgroundWallpaper = () => {
    if (!user) return;
    const imgDetail = backgroundImageDetail.find(
      (img: ImgDetails) => img.isActive
    );
    if (imgDetail) {
      setBackgroundImage(imgDetail?.imgUrl);
    } else {
      setBackgroundImage(AssetUrls.DEFAULT_BACKGROUND);
    }
  };
  useEffect(() => {
    const isMacOS = navigator.platform.toUpperCase().includes("MAC");
    setIsMac(isMacOS);
    checkOnlineStatus();
  }, []);

  const logoutFun = () => {
    if (!user) return message.error("User not found");
    try {
      signOut(auth)
        .then(() => {
          message.success("User Logged Out");
          navigate("/");
        })
        .catch((error) => {
          message.error(error.message);
        });
    } catch (e: any) {
      message.error(e.message);
    }
  };
  const checkOnlineStatus = () => {
    const isOnline = navigator.onLine;
    setOnlineStatus(isOnline);
  };

  const searchOnGoogle = async (text: string) => {
    if (text.trim() === "") {
      message.error("Please enter a search query");
    } else {
      setSearchSuggestions([]);
      setSearch("");
      switch (searchEngineName) {
        case "Yandex":
          window.open(`${searchEngineUrl}search/?text=${text}`);
          break;
        case "Bing":
          window.open(`${searchEngineUrl}search?q=${text}`);
          break;
        case "DuckDuckGo":
          window.open(`${searchEngineUrl}?q=${text}&ia=web`);
          break;
        case "Google":
          window.open(`${searchEngineUrl}search?q=${text}`);
          break;
        case "Yahoo":
          window.open(`${searchEngineUrl}search?p=${text}`);
          break;
        case "Ask.com":
          window.open(`${searchEngineUrl}web?q=${text}&o=0`);
          break;
        default:
          window.open(`${searchEngineUrl}search?q=${text}`);
          break;
      }
      try {
        let newSearch = {
          searchTitle: text,
          time: new Date(),
        };
        await addDoc(
          collection(db, `users/${user && user.uid}/history`),
          newSearch
        );
        let newArray: { searchTitle: string; time: Date }[] = [
          ...searchHistory,
        ];
        newArray.unshift(newSearch);
        setSearchHistory(newArray);
      } catch (e: any) {
        message.error(e.message);
      }
    }
  };
  const addNewBookMark = async () => {
    if (bookmarks?.length === 10) {
      return message.success("You have reached the limit of 10 bookmarks");
    }
    setIsModalVisible(true);
  };

  const handleProfilePicClick = () => {
    setProfileDropdown(!profileDropdown);
  };
  const openGmail = () => {
    window.open(AssetUrls.OPEN_GMAIL);
  };
  const openGooglePhotos = () => {
    window.open(AssetUrls.OPEN_GOOGLE_PHOTOS);
  };
  const openYoutube = () => {
    window.open(AssetUrls.OPEN_YOUTUBE);
  };
  const handleSearchEngineChange = async (value: string, name: any) => {
    console.log("name 2", value);
    console.log("name", name);
    setSearchEngineUrl(value);
    setSearchEngineName(name.name);
    setSearchEngineLogoImage(name.imgUrl);
    const searchEngineRef = collection(
      db,
      `users/${user && user.uid}/searchEngine`
    );
    const themeSnapshot = await getDocs(searchEngineRef);
    themeSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    const data = {
      searchEngineUrl: value,
      searchEngineName: name.name,
      searchEngineLogoImage: name.imgUrl,
    };
    await addDoc(
      collection(db, `users/${user && user.uid}/searchEngine`),
      data
    );
  };
  const handleContainerClick = () => {
    setSideDropDown(false);
  };
  const handleSearchQueryClick = (text: string) => () => {
    setSearch(text);
    searchOnGoogle(text);
  };
  const handleExperimentalClick = () => {
    setEditShowLoader(true);
    setTimeout(() => {
      setEditShowLoader(false);
      setIsChatBotOpen(false);
      setExperimentalSetup(!experimentalSetup);
    }, 1000);
  };
  const handleChatBotClick = () => {
    setChatShowLoader(true);
    setTimeout(() => {
      setChatShowLoader(false);
      setIsChatBotOpen(!isChatBotOpen);
      setExperimentalSetup(false);
    }, 1500);
  };
  const handleContextClickOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setTopMargin(e.clientY);
    setLeftMargin(e.clientX);
    setTotalWidth(window.innerWidth);
    setTotalHeight(window.innerHeight);
    setSideDropDown(true);
  };
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchSuggestions([]);
    const query = e.target.value;
    setSearch(query);
    if (query.length > 2) {
      try {
        axios
          .get(`http://localhost:8080/search/get/search/${query}`)
          .then((res) => {
            const searchedData = res.data.data;
            searchedData.splice(7);
            setSearchSuggestions(searchedData);
          });
      } catch (e) {
        message.error("error");
      }
    }
  };

  const handleSaveAs = () => {
    const htmlContent = document.documentElement.outerHTML;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = document.title.replace(/ /g, "_") + ".html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handlePrintOption = () => {
    window.print();
  };
  const handleReloadPage = () => {
    window.location.reload();
  };
  const leftClickMenu = [
    {
      label: (
        <MenuItems onClick={handleReloadPage}>
          Reload <span>{isMac ? "⌘ + R" : "Ctrl + R"}</span>
        </MenuItems>
      ),
      key: "0",
    },
    {
      label: (
        <MenuItems onClick={handleSaveAs}>
          Save Page <span>{isMac ? "⌘ + S" : "Ctrl + S"}</span>
        </MenuItems>
      ),
      key: "1",
    },
    {
      label: (
        <MenuItems onClick={handlePrintOption}>
          Print <span>{isMac ? "⌘ + P" : "Ctrl + P"}</span>
        </MenuItems>
      ),
      key: "2",
    },
  ];

  return (
    <Container
      backgroundImage={backgroundImage}
      onContextMenu={(e) => handleContextClickOpen(e)}
      onClick={handleContainerClick}
    >
      {sideDropDown && (
        <CustomDiv
          top={topMargin}
          left={leftMargin}
          totalWidth={totalWidth}
          totalHeight={totalHeight}
        >
          <MenuContainer>
            {leftClickMenu.map((item: LeftClickMenu) => {
              return <MenuItem key={item.key}>{item?.label}</MenuItem>;
            })}
          </MenuContainer>
        </CustomDiv>
      )}
      <Header />
      <UserContainer experimentalSetup={experimentalSetup}>
        {user && (
          <LogoutLogo>
            {user.photoURL ? (
              <UserImg onClick={handleProfilePicClick} src={user.photoURL} />
            ) : (
              <UserImg
                onClick={handleProfilePicClick}
                src={AssetUrls.DEFAULT_PROFILE_IMAGE}
              />
            )}
            <LogoutText onClick={logoutFun}>
              <i>Logout</i>
            </LogoutText>
          </LogoutLogo>
        )}
      </UserContainer>
      <WelcomeMsg>
        Welcome {user && user.displayName ? user.displayName : ""}♥
      </WelcomeMsg>
      <LogoContainer>
        <img src={searchEngineLogoImage} width={250} height={150} />
      </LogoContainer>
      <SearchBox>
        <InputBox
          isChatBotOpen={isChatBotOpen}
          experimentalSetup={experimentalSetup}
          isThemeLight={isThemeLight}
          placeholder={`Type here to search on ${searchEngineName}...`}
          onChange={(e) => handleInputChange(e)}
          value={search}
          autoFocus
          suffix={
            listening ? (
              <>
                <Tooltip title="Stop listening" placement="bottom">
                  <AudioOutlined onClick={() => setListening(!listening)} />
                </Tooltip>
                <SearchOutlined
                  style={{ marginLeft: "10px" }}
                  onClick={() => searchOnGoogle(search)}
                />
              </>
            ) : (
              <>
                <Tooltip title="Try Voice Search" placement="bottom">
                  <AudioMutedOutlined
                    onClick={() => setListening(!listening)}
                  />
                </Tooltip>

                <SearchOutlined
                  style={{ marginLeft: "10px" }}
                  onClick={() => searchOnGoogle(search)}
                />
              </>
            )
          }
        />
        <SearchresultShow>
          {searchSuggestions &&
            searchSuggestions.length > 0 &&
            searchSuggestions.map((item: SearchSuggestion, index: number) => {
              return (
                <SearchedQueryOption
                  key={index}
                  onClick={handleSearchQueryClick(item.value)}
                >
                  {item.value}
                  <span></span>
                </SearchedQueryOption>
              );
            })}
        </SearchresultShow>
        <BrowserSelect
          value={searchEngineUrl}
          isThemeLight={isThemeLight}
          options={browserMenu}
          onChange={(value: any, name: any) =>
            handleSearchEngineChange(value, name)
          }
        />
      </SearchBox>
      <Faviroutes>
        {bookmarks &&
          bookmarks.length != 0 &&
          bookmarks.map((bookmark: Bookmark, index: number) => (
            <BookmarkTile
              data={bookmark}
              user={user}
              index={index}
              key={`bookmark-${index}`}
              fetchBookmarks={fetchBookmarks}
              onlineStatus={onlineStatus}
            />
          ))}
      </Faviroutes>
      <Tooltip
        title={
          bookmarks?.length > 0 ? "Add New Bookmark" : "Add your first Bookmark"
        }
        placement="bottom"
      >
        <AddMoreBookmark onClick={addNewBookMark}>
          <PlusCircleFilled />
        </AddMoreBookmark>
      </Tooltip>
      {isModalVisible && (
        <AddBookmark
          user={user}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          fetchBookmarks={fetchBookmarks}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
      )}
      <ExperimentalFloatButton
        tooltip="Customize your view"
        shape="circle"
        type="default"
        icon={showEditLoader ? <LoadingOutlined /> : <ExperimentOutlined />}
        onClick={handleExperimentalClick}
        experimentalSetup={experimentalSetup}
      />
      <News setNewsArticles={setNewsArticles} newsArticles={newsArticles} />
      {experimentalSetup && (
        <SideMenuConatiner>
          <SideMenu
            experimentalSetup={experimentalSetup}
            setExperimentalSetup={setExperimentalSetup}
            backgroundImageDetail={backgroundImageDetail}
            setBackgroundDetail={setBackgroundImageDetail}
            user={user}
            setIsThemeLight={setIsThemeLight}
            isThemeLight={isThemeLight}
          />
        </SideMenuConatiner>
      )}
      {profileDropdown && (
        <ProfileDropdown
          open={profileDropdown}
          onCancel={handleProfilePicClick}
          footer
          closable
        >
          <ProfilePicContainer>
            <ImageContainer>
              <img src={user?.photoURL ?? ""} alt="Profile pic" />
              <div>
                <p>{user?.displayName}</p>
                <p>{user?.email}</p>
              </div>
            </ImageContainer>
            <ShortcutContainer>
              <GmailIcon onClick={openGmail}>
                <img src={AssetUrls.GMAIL_ICON} />
              </GmailIcon>
              <PhotosIcon onClick={openGooglePhotos}>
                <img src={AssetUrls.PHOTOS_ICON} />
              </PhotosIcon>
              <YoutubeIcon onClick={openYoutube}>
                <img src={AssetUrls.YOUTUBE_ICON} />
              </YoutubeIcon>
            </ShortcutContainer>
          </ProfilePicContainer>
        </ProfileDropdown>
      )}
      <ChatBotIcon
        tooltip="Chat with our bot"
        shape="circle"
        type="default"
        icon={showChatLoader ? <LoadingOutlined /> : <RobotOutlined />}
        experimentalSetup={experimentalSetup}
        onClick={handleChatBotClick}
      />
      {isChatBotOpen && (
        <Div>
          <ChatBot isThemeLight={isThemeLight} />
        </Div>
      )}
    </Container>
  );
};

export default LandingPage;
