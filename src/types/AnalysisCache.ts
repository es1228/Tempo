import type { PV } from "./PV";

export type AnalysisCache = {
    bestMove: string;
    evaluation: string;
    pv: PV[];
}