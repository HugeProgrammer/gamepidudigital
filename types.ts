
export interface Question {
  id: number;
  question: string;
  answer: string;
  imageUrl?: string;
  answerImageUrl?: string;
}

export enum QuizState {
  START = 'START',
  PLAYING = 'PLAYING',
  TIMEOUT = 'TIMEOUT',
  REVEALED = 'REVEALED',
  FINISHED = 'FINISHED'
}
