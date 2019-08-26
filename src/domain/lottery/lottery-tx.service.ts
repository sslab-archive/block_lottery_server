import { Lottery } from './lottery';

export interface LotteryTxService {
  sendCreateLotteryTx(url: string, jsonArgs: string): Lottery;
  sendQueryLotteryTx(url: string, jsonArgs: string): Lottery;
  sendQueryLotteriesTx(url: string, jsonArgs: string): Lottery[];
}
