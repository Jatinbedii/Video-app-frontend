"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import changedate from "@/utils/ConvertDate";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Video from "@/components/Video";
import { ClipLoader } from "react-spinners";
import { useUserContext } from "@/app/context/UserContext";
import { Button } from "@/components/ui/button";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function page({ params }) {
  const { user } = useUserContext();
  const [allvideos, setallvideos] = useState();
  const [shorts, setshorts] = useState();
  const [users, setusers] = useState(null);
  async function getVideos() {
    const res = await axios(`${process.env.NEXT_PUBLIC_BACKEND}/api/videos`);
    res.data.map;
  }
  async function getVideos() {
    try {
      let arr = [];
      const res = await axios(`${process.env.NEXT_PUBLIC_BACKEND}/api/videos`);
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].createdBy == params.id) {
          arr.push(res.data[i]);
        }
      }
      setallvideos(arr);
    } catch (error) {
      console.log(error);
    }
  }
  async function getShorts() {
    try {
      let arr = [];
      const res = await axios(`${process.env.NEXT_PUBLIC_BACKEND}/api/shorts`);
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].createdBy == params.id) {
          arr.push(res.data[i]);
        }
      }
      setshorts(arr);
    } catch (error) {
      console.log(error);
    }
  }
  async function getUsers() {
    try {
      const res = await axios(`${process.env.NEXT_PUBLIC_BACKEND}/api/users`);
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i]._id == params.id) {
          setusers(res.data[i]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getUsers();
    getVideos();
    getShorts();
  }, []);
  return (
    <div>
      {
        <div>
          {users ? (
            <div className="w-full pt-4">
              <div className=" pl-2 flex  flex-col md:pl-0 md:flex-row md:justify-around">
                <div>
                  <Image
                    className="rounded-full"
                    src={users.profile}
                    height={80}
                    width={80}
                    alt="image"
                  />
                </div>
                <div className="text-white font-medium text-2xl">
                  {users.username}{" "}
                  <span className="text-gray-400 text-base">{users.email}</span>
                </div>
              </div>
              <div className="bg-[#222222] w-full h-[15px] mt-1 rounded-t-2xl"></div>
              <div className="pl-2 font-medium pt-2 bg-[#222222]">
                <div className="text-white text-xl">About</div>
                <div className="text-sm text-gray-300">
                  Created on{" "}
                  <span className="text-gray-400 ">
                    {changedate(users.createdAt)}
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  Videos Posted <span className="text-gray-400 "></span>
                </div>
                <div className="text-sm text-gray-300">
                  Shorts Posted <span className="text-gray-400 "></span>
                </div>
                {user ? (
                  <div className="w-full flex justify-center">
                    <div className="flex justify-around gap-3">
                      <Button>Edit Profile</Button>
                      <Button>Video</Button>
                      <Button>Short</Button>
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>

              <Tabs defaultValue="videos" className="full bg-[#333333]">
                <TabsList className="grid w-full grid-cols-2 bg-black fixed">
                  <TabsTrigger value="videos" className="bg-black">
                    Videos
                  </TabsTrigger>
                  <TabsTrigger value="reels" className="bg-black">
                    Shorts
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="videos" className="pt-10">
                  <div className="bg-[#333333]">
                    {allvideos ? (
                      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                        <div className="flex w-max space-x-4 p-4">
                          {allvideos.map((data) => {
                            return (
                              <div key={data._id}>
                                <Video data={data} />
                              </div>
                            );
                          })}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    ) : (
                      <div className="w-full text-center">
                        <ClipLoader
                          color={"#ffffff"}
                          loading={true}
                          className="mt-10"
                          size={50}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="reels" className="pt-10">
                  {shorts ? (
                    <div className="  grid gap-3 md:grid-cols-2 lg:grid-cols-3 w-fit mx-auto lg:gap-10">
                      {shorts.map((short) => {
                        return <div>{short.title}</div>;
                      })}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="w-full text-center">
              <ClipLoader
                color={"#ffffff"}
                loading={true}
                className="mt-10"
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          )}
        </div>
      }
    </div>
  );
}
