"use client";

import Player from "@/components/player";
import Controls from "@/components/player-controls";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
    username: string;
}

export default function Room(
    { params }: { params: { roomId: string } }
) {
    type player = {
        id: string
        cards: string[]
        money: number
        bet: number
        total: number
    };
    const router = useRouter();
    const searchParams = useSearchParams();
    const playerName = searchParams.get('name') as string;
    const gameRef = useRef("");
    const [game, setGame] = useState("start");
    const turnRef = useRef(1);
    //const [turn, setTurn] = useState(1); turn doesn't have to be rendered therefore not state

    const playersRef = useRef(
        [
            {
                id: "Dealer",
                cards: ["",""],
                money: 0,
                bet: 0,
                total: 0
            },
            {
                id: playerName,
                cards: ["",""],
                money: 1000,
                bet: 100,
                total: 0
            }
        ]
    );

    const [players, setPlayers] = useState([
            {
                id: "Dealer",
                cards: ["",""],
                money: 0,
                bet: 0,
                total: 0
            },
            {
                id: playerName,
                cards: ["",""],
                money: 1000,
                bet: 100,
                total: 0
            }
        ]);

    //define all game rules and functions------------------------------------------------------
    
    //fetch new deck with deck id
    const new_deck = async() => {
        const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
        const data = await response.json();
        return data.deck_id;
    }
    
    const deckId = useRef<any | null>(null);
    const [deck_id, setDeck_id] = useState<any | null>(null);

    //only fetch new deck once at mount, change gameRef to start to expose player controls
    useEffect(() => {
        new_deck().then((deck_id) => {
            deckId.current = deck_id;
            setDeck_id(deckId.current);
        })
        gameRef.current = "start";
    }, [])

    const intervalRef = useRef<any | null>(null);

    //increase bet by clicking, or by holding down
    const increase = (playerindex: number, etype: string) => {
        console.log("increase clicked");

        if(etype == "click"){
            const bet = playersRef.current[playerindex].bet + 10;
            const money = playersRef.current[playerindex].money;
            if(bet <= money){
                const bet = playersRef.current[playerindex].bet += 10;
                const money = playersRef.current[playerindex].money;
                playersRef.current[playerindex].bet = bet;
                const updatedPlayers = [...players];
                updatedPlayers[playerindex].bet = bet;
                setPlayers(updatedPlayers);
            }
        }

        if(etype == "down"){
            intervalRef.current = setInterval(() => {
                const bet = playersRef.current[playerindex].bet + 10;
                const money = playersRef.current[playerindex].money;
                if(bet <= money){
                    const bet = playersRef.current[playerindex].bet += 10;
                    const money = playersRef.current[playerindex].money;
                    playersRef.current[playerindex].bet = bet;
                    const updatedPlayers = [...players];
                    updatedPlayers[playerindex].bet = bet;
                    setPlayers(updatedPlayers);
                }
            }, 100);
        }
        
        if(etype == "up" || etype == "leave") {
            clearInterval(intervalRef.current);
        }
    }
    
    //decrease bet by clicking, or by holding down
    const decrease = (playerindex: number, etype: string) => {
        console.log("decrease clicked");

        if(etype == "click"){
            const bet = playersRef.current[playerindex].bet - 10;
            if(bet > 0){
                playersRef.current[playerindex].bet = bet;
                const updatedPlayers = [...players];
                updatedPlayers[playerindex].bet = bet;
                setPlayers(updatedPlayers);
            }
        }

        if(etype == "down"){
            intervalRef.current = setInterval(() => {
                const bet = playersRef.current[playerindex].bet - 10;
                if(bet > 0){
                    playersRef.current[playerindex].bet = bet;
                    const updatedPlayers = [...players];
                    updatedPlayers[playerindex].bet = bet;
                    setPlayers(updatedPlayers);
                }
            }, 100);
        }
        
        if(etype == "up" || etype == "leave") {
            clearInterval(intervalRef.current);
        }
    }

    //function that returns a cards object, with each array item represented a card object, and .code property showing a card
    const draw_card = async(number_cards: number) => {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId.current}/draw/?count=${number_cards}`);
        const data = await response.json();
        return data.cards;
    }

    //shuffle deck of current room
    const shuffle = async() => {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId.current}/shuffle/`);
    }

    //captures bet chosen, deals 1 card faced up and 1 card faced down to dealer, deals 2 cards faced up to player
    const deal = async(playerindex: number) => {
        console.log("deal clicked");
        gameRef.current = "progress";
        await draw_card(1).then((card) => {
            playersRef.current[0].cards = [card[0].code, "BR"];
        })

        await draw_card(2).then((cards) => {
            playersRef.current[playerindex].cards = [cards[0].code, cards[1].code];
        })

        total_sum(playerindex);
        
        const updatedPlayers = [...playersRef.current];
        setPlayers(updatedPlayers);
        evaluate(playerindex);
    }

    //sum function that calculates sum of current hand, and renders back to page by setting state.
    const total_sum = (playerindex: number) => {
        const cards_A = playersRef.current[playerindex].cards.filter(card =>  card.startsWith("A"));
        const cards_not_A = playersRef.current[playerindex].cards.filter(card =>  !card.startsWith("A"));
        const cards_array = cards_not_A.concat(cards_A);
        
        let total = 0;
        console.log("test new: "+cards_array);
        cards_array.map((card: string) => {
            const first_char = Array.from(card)[0];
            if(first_char=="A") {
                (total+11) <= 21 ? total=total+11 : total=total+1
            } else if(first_char=="J" || first_char=="Q" || first_char=="K" || first_char=="0") {
                total = total+10;
            } else if(card != "" && card != "BR") {
                total = total+Number(first_char);
            }
            console.log("card: "+card+", total: "+total)
        })
        playersRef.current[playerindex].total = total
        console.log(`testtotal: ${total}`);
    }

    //draws 1 card and evaluates game state
    const hit = async(playerindex: number) => {
        console.log("hit clicked");
        await draw_card(1).then((card) => {
            let cards = [...playersRef.current[playerindex].cards];
            cards.push(card[0].code);
            playersRef.current[playerindex].cards = cards;
        })
        total_sum(playerindex);
        const updatedPlayers = [...playersRef.current];
        setPlayers(updatedPlayers);
        evaluate(playerindex);
    }

    //finish player turn and set turn to dealer. Then evaluates game state.
    const stand = async(playerindex: number) => {
        console.log("stand clicked");
        turnRef.current = 0;
        await evaluate(playerindex);
    }

    //runs dealers turn automatically
    const evaluate_dealer = async() => {
        const total = playersRef.current[0].total;
        const cards_length = playersRef.current[0].cards.length;

        if(total === 21 && cards_length === 2){
            gameRef.current = "Dealer Blackjack";
        } else {
            while(playersRef.current[0].total < 17){
                await draw_card(1).then((card) => {
                    let cards = [...playersRef.current[0].cards];
                    cards[cards.length-1] !== "BR" ? cards.push(card[0].code): cards[cards.length-1] = card[0].code;
                    playersRef.current[0].cards = cards;
                })
                total_sum(0);
                const updatedPlayers = [...playersRef.current];
                setPlayers(updatedPlayers);
            }

            if(playersRef.current[0].total > 21){
                gameRef.current = "Dealer Bust"
            } else {
                gameRef.current = "check winner";
            }
        }
    }

    //evaluates game state, also runs evaluate_dealer function if player turn has ended.
    const evaluate = async(playerindex: number) => {
        console.log("evaluating");
        const total = playersRef.current[playerindex].total;
        const cards_length = playersRef.current[playerindex].cards.length;
        const players_length = playersRef.current.length-1;

        //evaluate player
        if(total === 21 && cards_length === 2){
            playersRef.current[playerindex].money += (playersRef.current[playerindex].bet * 1.5);
            turnRef.current = 0;
            gameRef.current = "Blackjack!";
        } else if(total > 21) {
            playersRef.current[playerindex].money -= playersRef.current[playerindex].bet;
            gameRef.current = "Bust";
        } else if(cards_length == 5) {
            playersRef.current[playerindex].money += playersRef.current[playerindex].bet;
            turnRef.current = 0;
            gameRef.current = "You Win!";            
        } else if(total === 21 || turnRef.current === 0){
            turnRef.current = 0;
            await evaluate_dealer();
            const dealer_total = playersRef.current[0].total;
            console.log("aa "+ gameRef.current);
            if(gameRef.current === "check winner"){
                console.log("aaa "+ gameRef.current);
                if(total > dealer_total){
                    playersRef.current[playerindex].money += playersRef.current[playerindex].bet;
                    gameRef.current = "You Win!";
                } else if(dealer_total === total) {
                    gameRef.current = "Draw";
                } else {
                    playersRef.current[playerindex].money -= playersRef.current[playerindex].bet;
                    gameRef.current = "You Lose!";
                }
                console.log("bbb "+ gameRef.current);
            }
        }
        
        //resolve gameState
        switch(gameRef.current) {
            case "Dealer Bust":
                playersRef.current[playerindex].money += playersRef.current[playerindex].bet;
                break;
            case "Dealer Blackjack":
                playersRef.current[playerindex].money -= playersRef.current[playerindex].bet;
                break;
            default:
        }

        if(playersRef.current[playerindex].bet > playersRef.current[playerindex].money){
            playersRef.current[playerindex].bet = playersRef.current[playerindex].money;
        }

        switch(gameRef.current) {
            case "Dealer Bust":
            case "Dealer Blackjack":
            case "Bust":
            case "You Win!":
            case "You Lose!":
            case "Draw":
            case "Blackjack!":
                setTimeout(() => {
                    setGame(gameRef.current);
                }, 500);
                
                //resets game after few seconds
                setTimeout(() => {
                    shuffle();
                    gameRef.current = "start";
                    turnRef.current = 1;
                    playersRef.current[0].cards = ["",""];
                    playersRef.current[1].cards = ["",""];
                    playersRef.current[0].total = 0;
                    playersRef.current[1].total = 0;
                    setGame("start");
                }, 2500);
                break;
            default:
        }

        const updatedPlayers = [...playersRef.current];
        setPlayers(updatedPlayers);
    }

    const test = () => {
        console.log(gameRef.current);
    };

    return(
        <>
            <div className="nav">
                <h1>Room {params.roomId}
                     {/* / Deck {deck_id} */}
                </h1>
            </div>
            
            <div className="game-container">
                    
                <Player
                key="Dealer"
                playerindex={0}
                players={players}
                >
                </Player>
            
                {(game!="start" && game!="check winner") && <div className="announcement">
                    {game}
                    <br></br>
                    <span className="text-sm text-black">
                        Player {players[1].total} : Dealer {players[0].total}
                    </span>
                </div>}
            
                <Player
                key={players[1].id}
                playerindex={1}
                players={players}
                >
                </Player>

                <Controls 
                key={players[1].id + " controls"}
                playerindex={1}
                players={players}
                gameRef={gameRef.current}
                decrease={decrease}
                increase={increase}
                deal={deal}
                hit={hit}
                total_sum={total_sum}
                stand={stand}
                >
                </Controls> 
            </div>  
        </>
    );
}