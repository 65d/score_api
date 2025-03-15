"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Team = {
  id: string;
  name: string;
  score: number;
  color: "red" | "blue";
  is_started: boolean;
};

const TeamJumbotron: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetchTeams();
    const subscription = supabase
      .channel("public:teams")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        fetchTeams
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("color");

    if (error) {
      console.error("Error fetching teams:", error);
    } else {
      setTeams(data as Team[]);
    }
  };

  const redTeam = teams.find((team) => team.color === "red");
  const blueTeam = teams.find((team) => team.color === "blue");

  if (!redTeam || !blueTeam) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen w-full text-white">
      {/* Red Team */}
      <div className="flex flex-1 flex-col items-center justify-center text-red-600">
        <h2 className="text-[4rem] font-bold ">
          {redTeam.name}
        </h2>
        <p className="m-0 p-0 text-[14rem] font-bold leading-none ">
          {redTeam.score}
        </p>
      </div>

      {/* Center Divider with Clock */}
      {/* <div className="flex w-1/6 flex-col items-center justify-center bg-gray-800">
        <div className="mb-4 text-2xl font-bold md:text-4xl lg:text-6xl">{currentTime}</div>
        <div className="h-1/2 w-1 bg-white"></div>
      </div> */}
      <div className="w-[5px] bg-black"></div>

      {/* Blue Team */}
      <div className="flex flex-1 flex-col items-center justify-center text-blue-600 ">
        <h2 className=" text-[4rem] font-bold ">
          {blueTeam.name}
        </h2>
        <p className="m-0 p-0 text-[14rem] font-bold leading-none">
          {blueTeam.score}
        </p>
      </div>
    </div>
  );
};

export default TeamJumbotron;
