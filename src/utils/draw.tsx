//prop for either room id or new room created

export default async function draw(deck_id: string) {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/"${deck_id}"/draw/?count=1`);
    //const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
    
    //const response = await fetch("https://deckofcardsapi.com/api/deck/9g9llm29g6g3/draw/?count=1");
    const deck = await response.json();
    return deck.cards[0].code;
}