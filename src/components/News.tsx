import React, { useEffect } from "react";
import { Tooltip, message } from "antd";
import styled from "@emotion/styled";
import { categoryArr } from "../common/CategoryList";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20px;
  width: 1100px;
  gap: 1rem;
  height: 400px;
  overflow-y: auto;
  box-shadow: 0px 0px 10px black;
  border-radius: 20px;
`;

const NewsCard = styled.div`
  position: relative;
  width: 510px;
  height: 220px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  gap: 12px;
  background-color: #f0f0f0;
  cursor: pointer;
  padding: 8px 12px;
`;
const NewsImg = styled.img`
  position: absolute;
  width: 200px;
  height: 170px;
  border-radius: 40px;
  left: 10px;
`;
const DetailsCard = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 200px;
  right: 10px;
  bottom: 20px;
`;
interface Props {
  newsArticles: any;
  setNewsArticles: any;
}
const News = (props: Props) => {
  const { newsArticles, setNewsArticles } = props;
  const ApiKey = "c284ce028d2847fcbec5a768aa21fd63";

  useEffect(() => {
    const randomCategory = categoryArr[Math.floor(Math.random() * 7)];
    getNews(randomCategory, false);
  }, []);
  const getNewsCardTitle = (title: string) => {
    if (title.length > 20) {
      return title.substring(0, 20) + "...";
    }
    return title;
  };
  const getNewsCardDescription = (description: string) => {
    if (description.length > 100) {
      return description.substring(0, 100) + "...";
    }
    return description;
  };
  const handleNewsCardClick = (url: string) => {
    window.open(url, "_blank");
  };
  const handleScroll = (e: any) => {
    const element = e.target;
    if (Math.floor(element.scrollHeight - element.scrollTop) == 393) {
      const randomCategory = categoryArr[Math.floor(Math.random() * 7)];
      getNews(randomCategory, false);
    } else if (element.scrollTop === 0) {
      const randomCategory = categoryArr[Math.floor(Math.random() * 7)];
      getNews(randomCategory, true);
    }
  };
  const getNews = (query: string, isTop: boolean) => {
    fetch(
      `https://newsapi.org/v2/top-headlines?country=in&category=${query}&apiKey=${ApiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        const dataSplice = data.articles.splice(0, 11);
        setNewsArticles(
          isTop ? [...dataSplice] : [...newsArticles, ...dataSplice]
        );
      })
      .catch(() => {
        message.error("Error fetching latest news");
      });
  };
  return (
    <>
      {newsArticles && newsArticles.length > 0 && (
        <Container onScroll={(e) => handleScroll(e)}>
          {newsArticles.map((data: any) => {
            if (data?.urlToImage) {
              return (
                <Tooltip
                  placement="bottom"
                  title="Read more ..."
                  mouseEnterDelay={1.5}
                >
                  <NewsCard onClick={() => handleNewsCardClick(data?.url)}>
                    <NewsImg src={data?.urlToImage} />
                    <DetailsCard>
                      <h3>{data?.source?.name}</h3>
                      <h2>{getNewsCardTitle(data?.title)}</h2>
                      <p>{getNewsCardDescription(data.description)}</p>
                    </DetailsCard>
                  </NewsCard>
                </Tooltip>
              );
            }
          })}
        </Container>
      )}
    </>
  );
};

export default News;
