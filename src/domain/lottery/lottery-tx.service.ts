import { Lottery } from './lottery';
import { CreateLotteryTxRequestDto } from './dto/create-lottery-tx-request.dto';
import { QueryLotteryTxRequestDto } from './dto/query-lottery-tx-request.dto';
import { DrawLotteryTxRequestDto } from './dto/drawLotteryTxRequest.dto';
import { ParticipateLotteryTxRequestDto } from './dto/participate-lottery-tx-request.dto';

export interface LotteryTxService {
  sendCreateLotteryTx(dto: CreateLotteryTxRequestDto): Promise<Lottery>;
  sendQueryLotteryTx(dto: QueryLotteryTxRequestDto): Promise<Lottery>;
  sendQueryLotteriesTx(dto: QueryLotteryTxRequestDto): Promise<Lottery[]>;
  sendParticipateLotteryTx(dto: ParticipateLotteryTxRequestDto): Promise<Lottery>;
  sendDrawLotteryTx(dto: DrawLotteryTxRequestDto): Promise<Lottery>;
}
