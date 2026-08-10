import { useCallback, useRef } from "react";

const useEvalCache = () => {
    const cacheRef = useRef<Map<string, string>>(new Map());

    const getCachedEval = useCallback((fen: string) => {
        const cleanFen = fen.split(" ").splice(0, 4).join(" ");
        return cacheRef.current.get(cleanFen);
    }, [])

    const setCachedEval = useCallback((fen: string, evaluation: string) => {
        const cleanFen = fen.split(" ").splice(0, 4).join(" ");
        cacheRef.current.set(cleanFen, evaluation);
    }, [])

    return {getCachedEval, setCachedEval}
}
export default useEvalCache;