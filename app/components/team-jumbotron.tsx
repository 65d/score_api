"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { AnimatedNumber } from "@/app/components/animated-number";

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
    return (
      <div className="flex h-screen w-full items-center justify-center text-white">
        Initializing...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full text-white">
      {/* Red Team */}
      <div className="flex flex-1 flex-col items-center justify-center text-red-600">
        <h2 className="text-[4rem] font-bold">{redTeam.name}</h2>
        <div className="m-0 p-0 text-[14rem] font-bold leading-none">
          <AnimatedNumber value={redTeam.score} />
        </div>
      </div>

      {/* Center Divider */}
      <div className="w-[5px] bg-black"></div>

      {/* Blue Team */}
      <div className="flex flex-1 flex-col items-center justify-center text-blue-600">
        <h2 className="text-[4rem] font-bold">{blueTeam.name}</h2>
        <div className="m-0 p-0 text-[14rem] font-bold leading-none">
          <AnimatedNumber value={blueTeam.score} />
        </div>
      </div>
    </div>
  );
};

export default TeamJumbotron;
