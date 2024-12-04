'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Team = {
  id: string
  name: string
  score: number
  color: 'red' | 'blue'
  is_started: boolean
}

const TeamJumbotron: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    fetchTeams()
    const subscription = supabase
      .channel('public:teams')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, fetchTeams)
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('color')

    if (error) {
      console.error('Error fetching teams:', error)
    } else {
      setTeams(data as Team[])
    }
  }

  const redTeam = teams.find(team => team.color === 'red')
  const blueTeam = teams.find(team => team.color === 'blue')

  if (!redTeam || !blueTeam) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen w-full text-white">
      {/* Red Team */}
      <div className="flex flex-1 flex-col items-center justify-center bg-red-600 p-8">
        <h2 className="mb-4 text-4xl font-bold md:text-6xl lg:text-8xl">{redTeam.name}</h2>
        <p className="mb-8 text-6xl font-bold md:text-8xl lg:text-[450px]">{redTeam.score}</p>
      </div>

      {/* Center Divider with Clock */}
      {/* <div className="flex w-1/6 flex-col items-center justify-center bg-gray-800">
        <div className="mb-4 text-2xl font-bold md:text-4xl lg:text-6xl">{currentTime}</div>
        <div className="h-1/2 w-1 bg-white"></div>
      </div> */}
      <div className='w-[5px] bg-black'></div>

      {/* Blue Team */}
      <div className="flex flex-1 flex-col items-center justify-center bg-blue-600 p-8">
        <h2 className="mb-4 text-4xl font-bold md:text-6xl lg:text-8xl">{blueTeam.name}</h2>
        <p className="mb-8 text-6xl font-bold md:text-8xl lg:text-[450px]">{blueTeam.score}</p>
      </div>
    </div>
  )
}

export default TeamJumbotron

