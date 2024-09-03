//prop for either room id or new room created

export default async function new_deck() {
    const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
    const deck = await response.json();
    return deck.deck_id;
}