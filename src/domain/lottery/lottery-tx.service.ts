import { Lottery } from '../lottery';

export interface LotteryTxService {
  sendLotteryCreateTx(url: string, jsonArgs: string): Lottery;
}
