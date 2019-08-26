import { Lottery } from './lottery';
import { CreateLotteryTxRequestDto } from './dto/create-lottery-tx-request.dto';

export interface LotteryTxService {
  sendCreateLotteryTx(dto: CreateLotteryTxRequestDto): Promise<Lottery>;
  sendQueryLotteryTx(jsonArgs: string): Promise<Lottery>;
  sendQueryLotteriesTx(jsonArgs: string): Promise<Lottery[]>;
}
