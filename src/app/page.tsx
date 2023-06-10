"use client";
import { type NextPage } from "next";
import Head from "next/head";
import Search from "./search";
import React, { useEffect } from "react";
import { SSRProvider } from "react-aria";
import ReactPlayer from "react-player";

type Video = {
  id: { [key: string]: string };
  title: { [key: string]: string };
  text: { [key: string]: string };
};
const Home: NextPage = () => {
  const [search, setSearch] = React.useState("");
  const [limit, setLimit] = React.useState(3);
  const [videos, setVideos] = React.useState<Video>({
    title: {},
    id: {},
    text: {},
  });
  const [items, setItems] = React.useState<
    { file: string; name: string; text: string }[]
  >([]);
  useEffect(() => {
    if (search === "") return;
    const getTiktoks = async (state: string, lim: number) => {
      const res: Video = (await fetch(`/api/tt/${state}/${lim}`).then((res) =>
        res.json()
      )) as Video;
      setVideos(res);
    };
    void getTiktoks(search, limit);
  }, [search, limit]);
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
          <h1 className="grad select-none text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Tik<span className="grad">Tok</span>{" "}
            <span className="grad2">Favorites</span>
          </h1>
          <div className="flex-col justify-center align-middle">
            <div className="flex justify-center gap-4">
              <Search label="Search" onSubmit={(e) => setSearch(e)} />
              <div className="float-left w-24">
                <Search
                  label="Limit"
                  onSubmit={(e) => setLimit(Number(e))}
                  defaultValue="3"
                />
              </div>
            </div>
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
                        <div className="text-lg">
                          <p className="w-full overflow-hidden">{item.text}</p>
                        </div>
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
