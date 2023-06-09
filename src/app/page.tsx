"use client";
import { type NextPage } from "next";
import Head from "next/head";
import Search from "./search";
import React, { useEffect } from "react";
import { SSRProvider } from "react-aria";
import ReactPlayer from "react-player";
const Home: NextPage = () => {
  const [search, setSearch] = React.useState("");
  const [videos, setVideos] = React.useState<{
    id: { [key: string]: string };
    title: { [key: string]: string };
    text: { [key: string]: string };
  }>({
    title: {},
    id: {},
    text: {},
  });
  const [items, setItems] = React.useState<
    { file: string; name: string; text: string }[]
  >([]);
  useEffect(() => {
    if (search === "") return;
    const getTiktoks = async (state: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const res = await fetch(`/api/tt/${state}`).then((res) => res.json());
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setVideos(res);
    };
    void getTiktoks(search);
  }, [search]);
  function isString(value: unknown): value is string {
    return typeof value === "string";
  }
  useEffect(() => {
    if (Object.keys(videos.id).length == 0) return;
    const lst = Object.keys(videos.id);
    const items: { file: string; name: string; text: string }[] = [];

    lst.forEach((element: string) => {
      if (element === "undefined") return;
      items.push({
        file: videos.id[element]?.replace(".json", ".mp4") as string,
        name: videos.title[element]?.replace(" on TikTok", "") as string,
        text:
          (videos.text[element]?.indexOf("#") as number) > -1
            ? (videos.text[element]?.slice(
                0,
                videos.text[element]?.indexOf("#")
              ) as string)
            : (videos.text[element] as string),
      });
    });
    setItems(items);
  }, [videos]);
  return (
    <SSRProvider>
      <Head>
        <title>TikTok Favorites</title>
        <meta
          name="description"
          content="Search through my tiktok favorties with AI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] md:items-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="grad text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Tik<span className="grad">Tok</span>{" "}
            <span className="grad2">Favorites</span>
          </h1>
          <div className="flex-col justify-center align-middle">
            <Search label="Search" onSubmit={(e) => setSearch(e)} />
            <div className="flex w-full">
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 md:gap-16">
                {items.length > 0
                  ? items.map((item) => (
                      <div
                        key={item.file}
                        className="flex min-h-[500px] max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                      >
                        <h3 className="text-2xl font-bold">{item.name}</h3>
                        <div className="player-wrapper">
                          <ReactPlayer
                            url={
                              "https://d1eiph32earw5w.cloudfront.net/videos/" +
                              item.file
                            }
                            className="react-player"
                            controls={true}
                            width="100%"
                            height="100%"
                          />
                        </div>
                        <div className="text-lg">{item.text}</div>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
      </main>
    </SSRProvider>
  );
};

export default Home;
