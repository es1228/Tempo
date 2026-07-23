export const formatResult = (result: string) => {
    if (result === "win") 
        return "W";
    else if (result === "agreed" || result === "repetition" || result === "stalemate" || result === "50move" || result === "timevsinsufficient") 
        return "D"
    else return "L";
}