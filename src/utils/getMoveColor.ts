export const getMoveColor = (classification: string) => {
    if (classification.includes("blunder"))
        return "oklch(63.7% 0.237 25.331)"
    else if (classification.includes("miss"))
        return "oklch(80.8% 0.114 19.571)"
    else if (classification.includes("mistake"))
        return "oklch(75% 0.183 55.934)"
    else if (classification.includes("inaccuracy"))
        return "oklch(90.5% 0.182 98.111)"
    else if (classification.includes("good") || classification.includes("forced"))
        return "oklch(93.8% 0.127 124.321)"
    else if (classification.includes("excellent"))
        return "oklch(89.7% 0.196 126.665)"
    else if (classification.includes("best"))
        return "oklch(72.3% 0.219 149.579)"
    else if (classification.includes("great"))
        return "oklch(70.7% 0.165 254.624)"
    else if (classification.includes("brilliant"))
        return "oklch(78.9% 0.154 211.53)"
    else if (classification.includes("theory"))
        return "oklch(47.3% 0.137 46.201)"
    else
        return "oklch(70.5% 0.015 286.067)"
}