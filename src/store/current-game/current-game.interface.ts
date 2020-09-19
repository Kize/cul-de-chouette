export enum GameStatus {
  CREATION = 'creation',
  IN_GAME = 'in game',
  FINISHED = 'finished'
}

export interface Player {
  name: string;
  history: Array<HistoryLine>
}

export enum HistoryLineType {
  BEVUE = 'bévue',
  VELUTE = 'velute',
  CHOUETTE = 'chouette',
  CUL_DE_CHOUETTE = 'cul de chouette'
}

export interface StartGameData {
  gameName: string;
  playerNames: Array<string>
}

export interface HistoryLine {
  designation: HistoryLineType;
  amount: number;
}
