import {Participant} from './participant';

export class Prize {
  UUID: string;
  title: string;
  memo: string;
  winnerNum: number;
  winners: Participant[];
}
