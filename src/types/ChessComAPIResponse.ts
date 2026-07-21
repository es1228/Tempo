export type ChessComArchives = {
    archives: string[];
}

export type ChessComGames = {
  games: Game[]
}

export type Game = {
  url: string
  pgn: string
  time_control: string
  end_time: number
  rated: boolean
  accuracies?: Accuracies
  tcn: string
  uuid: string
  initial_setup: string
  fen: string
  time_class: string
  rules: string
  white: White
  black: Black
  eco: string
}

export type Accuracies = {
  white: number
  black: number
}

export type White = {
  rating: number
  result: string
  "@id": string
  username: string
  uuid: string
}

export type Black = {
  rating: number
  result: string
  "@id": string
  username: string
  uuid: string
}
