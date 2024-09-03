'use client';

import React, { Component } from 'react';

interface Props {
    increase: (playerindex: number, etype: string) => void;
    decrease: (playerindex: number, etype: string) => void;
    deal: (playerindex: number) => void;
    hit: (playerindex: number) => void;
    total_sum: (playerindex: number) => void;
    stand: (playerindex: number) => void;
    playerindex: number;
    players: player[];
    gameRef: string;
}

type player = {
    id: string
    cards: string[]
    money: number
    bet: number
    total: number
}

//component that provides player controls and UI
export default function Controls ( props: Props ) {

    return (
        <>
            <div className="controls-container">
                <h1 className="text-center p-1 h-1/10 m-0 text-lg">Cash: $ {props.players[props.playerindex].money}</h1>
                
                {
                props.gameRef === "start" &&
                <div className="button-container">
                    <button className="round-button" onClick={() => props.decrease(props.playerindex, "click")}
                        onMouseUp={() => props.decrease(props.playerindex, "up")}
                        onMouseLeave={() => props.decrease(props.playerindex, "leave")}
                        onMouseDown={() => props.decrease(props.playerindex, "down")}>-</button>
                    <span className="text-center px-2">$ {props.players[props.playerindex].bet}</span>
                    <button className="round-button" onClick={() => props.increase(props.playerindex, "click")}
                        onMouseUp={() => props.increase(props.playerindex, "up")}
                        onMouseLeave={() => props.increase(props.playerindex, "leave")}
                        onMouseDown={() => props.increase(props.playerindex, "down")}
                        >+</button>
                    <button className="button" onClick={() => props.deal(props.playerindex)}>Deal</button>
                </div>
                }
                {
                props.gameRef === "progress" &&
                <div className="button-container">
                    <h1 className="px-1 text-lg">{props.gameRef==="progress" && `Bet: $ ${props.players[props.playerindex].bet}`}</h1>
                    <button className="button" onClick={() => props.stand(props.playerindex)}>Stand</button>
                    <button className="button" onClick={() => props.hit(props.playerindex)}>Hit</button>
                    {/* <button className="button" onClick={props.test}>Test</button> */}
                </div>
                }
            </div>
    </>
    )
}