"use client";
import { type NextPage } from "next";
import Head from "next/head";
import Search from "./search";
import React, { useEffect } from "react";
import { SSRProvider } from "react-aria";
import ReactPlayer from "react-player";
import getSkeletons from "./skeleton";
import "react-loading-skeleton/dist/skeleton.css";
type Video = {
  id: { [key: string]: string };
  title: { [key: string]: string };
  text: { [key: string]: string };
};
type err = {
  error: string;
};
let timer: NodeJS.Timeout;
const Home: NextPage = () => {
  const [search, setSearch] = React.useState("");
  const [limit, setLimit] = React.useState("3");
  const [submit, setSubmit] = React.useState(false);
  const [coldStart, setColdStart] = React.useState(false);
  const [error, setError] = React.useState(
    "Please wait a minute for the server to start up and resubmit your search"
  );
  const [videos, setVideos] = React.useState<Video>({
    title: {},
    id: {},
    text: {},
  });
  //startup the serverless functiono so it doesn't have to wait
  useEffect(() => {
    const cs = setTimeout(() => {
      console.log("cold start");
      setColdStart(true);
    }, 500);
    async function getTiktoks() {
      // warm up the serverless function

      const x = await fetch(`/api/coldStart/start`).then((res) => {
        console.log(res);

        return res;
      });
      return x;
    }
    void getTiktoks().then((_) => {
      setColdStart(false);
      clearTimeout(cs);
      console.log("warmed up");
    });
  }, []);
  const [items, setItems] = React.useState<
    { file: string; name: string; text: string }[]
  >([]);
  useEffect(() => {
    if (timer) clearTimeout(timer);
    if (coldStart || search === "" || !submit) return;
    timer = setTimeout(() => {
      // console.log("fetching");
      setVideos({ title: {}, id: {}, text: {} });
      const getTiktoks = async (state: string, lim: number) => {
        try {
          const res: Video | err = (await fetch(`/api/tt/${state}/${lim}`).then(
            (res) => res.json()
          )) as Video | err;

          setColdStart(false);
          if (!("error" in res)) setVideos(res);
          else {
            setColdStart(true);
            setError(res.error);
            setVideos({ title: {}, id: {}, text: {} });
          }
        } catch (e) {
          console.log(e);
          setColdStart(true);
          setVideos({ title: {}, id: {}, text: {} });
          setError(
            "Something went wrong, please refresh the page and try again"
          );
        }
      };
      void getTiktoks(search, Number(limit));
    }, 500);
    return () => clearTimeout(timer);
  }, [search, limit, submit, coldStart]);
  useEffect(() => {
    if (Object.keys(videos.id).length == 0) {
      return;
    }
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
            <div className="flex justify-center md:flex-row md:gap-4">
              <div className="mr-4 max-w-[45vw] flex-1 md:mr-0 md:flex-none">
                <Search
                  label="Search"
                  onSubmit={(e) => {
                    setSubmit((e) => true);
                    setSearch(e);
                  }}
                  state={search}
                  setState={setSearch}
                />
              </div>
              <div className="float-left max-w-[35vw] flex-1 md:w-24 md:flex-none">
                <Search
                  label="Limit"
                  onSubmit={(e) => {
                    setSubmit((e) => true);
                    setItems([{ file: "", name: "", text: "" }]);
                  }}
                  defaultValue="3"
                  state={limit.toString()}
                  setState={setLimit}
                />
              </div>
            </div>
            {coldStart && (
              <h2 className="mb-4 text-center text-xl font-bold text-white">
                {error}
              </h2>
            )}
            <div className="flex w-full">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-3 md:gap-16">
                {items.length > 0 && items[0] && items[0].file !== ""
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
                  : submit && items.length === 0
                  ? getSkeletons(Number(limit))
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
