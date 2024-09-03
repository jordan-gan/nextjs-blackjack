import Image from "next/image";

//export default function Card({ card }: { card: string}) {
export default function Card({ card }: { card: string }) {
    const card_image = "/images/cards/".concat(card,".png");

    if  (card != "") {
        return(
            <div className="card-container">
                <Image className="card"
                fill={true}
                src={ card_image }
                alt={ card }
                priority
                sizes="(max-width: 150px) 100vw, 150px"
                />
            </div>
        )
    } else {
        return(
            <div className="card-container">
            </div>
        )
    }
}