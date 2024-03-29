"use client";
import axios from "axios";

import React, { useEffect, useState } from "react";
import Short from "./Short";
import { ClipLoader } from "react-spinners";

function Shorts() {
  const [shorts, setShorts] = useState();
  const [usersdata, setUsersData] = useState();
  async function getshorts() {
    const res = await axios(`${process.env.NEXT_PUBLIC_BACKEND}/api/shorts`);
    setShorts(res.data);
    const data = await axios(`${process.env.NEXT_PUBLIC_BACKEND}/api/users`);
    setUsersData(data.data);
  }
  useEffect(() => {
    getshorts();
  }, []);
  return (
    <div
      className="w-full snap-y snap-mandatory overflow-auto"
      style={{ height: "calc(100vh - 93px)" }}
    >
      {shorts && usersdata ? (
        shorts.map((data) => {
          return <Short short={data} users={usersdata} />;
        })
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
  );
}

export default Shorts;
