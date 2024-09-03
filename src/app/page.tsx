"use client";

// import Link from 'next/link'
import Rooms from "@/components/rooms";
import {Button} from '@nextui-org/react';
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const [roomInput, setRoomInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const router = useRouter();
  const directToRoom = () => {
    if(roomInput?.trim() && nameInput?.trim()){
      router.push(`/room/${roomInput}?name=${encodeURIComponent(nameInput)}`);
    } else {
      alert('Please enter both room number and player name.');
    }
    
  }

  const pressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      directToRoom();
    }
  }

  return (
    <>
      <div className="p-5 text-black flex flex-col w-vw items-center mx-auto h-screen justify-center">
        <h1 className="m-10 text-3xl text-center">Welcome to BlackJack50!!</h1>
          <input className="p-2 m-2"
          type="text"
          value={nameInput!}
          onChange={(e) => setNameInput(e.target.value)}
          placeholder="Enter Player Name"
          />
          <input className="p-2 m-2"
          type="text"
          value={roomInput!}
          onChange={(e) => setRoomInput(e.target.value)}
          onKeyDown={pressEnter}
          placeholder="Enter Room Code"
          />

        <Button className="m-5 p-5" onClick={directToRoom}>Join Room</Button>


        {/* <Rooms /> */}

      </div>
    </>
  );
  
}