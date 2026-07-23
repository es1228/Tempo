export const getMoveColor = (classification: string) => {
    if (classification.includes("blunder"))
        return "text-red-500"
    else if (classification.includes("miss"))
        return "text-red-300"
    else if (classification.includes("mistake"))
        return "text-orange-400"
    else if (classification.includes("inaccuracy"))
        return "text-yellow-300"
    else if (classification.includes("good"))
        return "text-lime-200"
    else if (classification.includes("excellent"))
        return "text-lime-300"
    else if (classification.includes("best"))
        return "text-green-500"
    else if (classification.includes("great"))
        return "text-blue-800"
    else if (classification.includes("brilliant"))
        return "text-blue-300"
    else if (classification.includes("theory"))
        return "text-amber-800"
}