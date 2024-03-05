"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import changedate from "@/utils/ConvertDate";
import { IoIosAdd } from "react-icons/io";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Video from "@/components/Video";
import { ClipLoader } from "react-spinners";
import { useUserContext } from "@/app/context/UserContext";
import { Button } from "@/components/ui/button";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FaUserEdit } from "react-icons/fa";

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
                    height={60}
                    width={60}
                    alt="image"
                  />
                </div>
                <div className="text-white font-medium text-2xl">
                  {users.username}{" "}
                  <span className="text-gray-400 text-base">{users.email}</span>
                </div>
              </div>
              <div className="bg-[#222222] w-full h-[10px] mt-1 rounded-t-3xl"></div>
              <div className="pl-2 font-medium  bg-[#222222]">
                <div className="text-white text-xl">About</div>
                <div className="text-sm text-gray-300">
                  Created on{" "}
                  <span className="text-gray-400 ">
                    {changedate(users.createdAt)}
                  </span>
                </div>

                {user ? (
                  <div className="w-full flex justify-center">
                    <div className="flex justify-around gap-1">
                      <span className="bg-white clear-start flex flex-row gap-1 pb-1 pt-1 pl-1 rounded-md">
                        <Link href="/upload">
                          <Button className="bg-red-600 text-white">
                            Video
                          </Button>
                        </Link>
                        <Link href="/shorts/upload">
                          {" "}
                          <Button className="bg-red-600 text-white">
                            Short
                          </Button>
                        </Link>
                        <span className="text-red-600 text-4xl">
                          {" "}
                          <IoIosAdd />
                        </span>
                      </span>
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
                  <div className="bg-[#333333]">
                    {shorts ? (
                      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                        <div className="flex w-max space-x-4 p-4">
                          {shorts.map((short) => {
                            return (
                              <div className="w-[200px]  flex flex-col bg-[#111111] p-1 rounded-lg">
                                <a href={short.url}>
                                  <div className="w-full flex justify-center">
                                    {" "}
                                    <video src={short.url} />
                                  </div>
                                  <div className="text-white pl-1 pt-1">
                                    {short.title}
                                  </div>
                                </a>
                              </div>
                            );
                          })}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    ) : (
                      <div></div>
                    )}
                  </div>
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
