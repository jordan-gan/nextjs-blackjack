'use client';

import React, { Component } from 'react';
import Card from "./card";

interface Props {
    playerindex: number;
    players: player[];
}

type player = {
    id: string
    cards: string[]
    money: number
    bet: number
    total: number
};

//component to render cards in play
export default function Player ( props: Props ) {

    const cards = ["", "", "", "", ""];
    props.players[props.playerindex].cards.map((card, index) => {
        cards[index] = card;
    })

    return (
        <>
        <div className="player-container">
            <div className="text-center flex justify-center">
                <div className="text-center p-1 m-1">
                    {props.players[props.playerindex].id}
                </div>
                <div className="text-center text-black rounded-full bg-white p-1 w-8 m-1 aspect-square">
                    {props.players[props.playerindex].total === 0 ? "?" : props.players[props.playerindex].total}
                </div>
            </div>
            <div className="cards-container">
                {cards.map((card, index) => {
                    const key = props.players[props.playerindex].id+index;
                    return(<Card key={key} card={card}/>)
                })}
            </div>
        </div>
    </>
    )

}