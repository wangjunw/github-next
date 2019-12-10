import React from "react";
import Head from "next/head";
import styled from "styled-components";
import Link from "next/link";
import { Button } from "antd";

const MyTitle = styled.h1`
  color: blue;
`;
const Home = props => (
  <div>
    <Head>
      <title>每个页面不一样</title>
    </Head>
    <MyTitle>哈啊哈{props.time}</MyTitle>
    <Link href="/comp">
      <Button>{props.test}</Button>
    </Link>
    <Link href="/b">
      <Button>hock优化</Button>
    </Link>
    <style jsx>{`
      p {
        color: blue;
      }
    `}</style>
  </div>
);
Home.getInitialProps = async ctx => {
  // 异步加载模块
  const moment = await import("moment");
  return {
    test: "000",
    time: moment.default(Date.now() - 60 * 1000 * 60).fromNow()
  };
};

export default Home;
