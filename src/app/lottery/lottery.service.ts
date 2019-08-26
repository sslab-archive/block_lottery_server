import { Inject, Injectable } from '@nestjs/common';
import { CreateLotteryRequestDTO } from './dto/create-lottery-request.dto';
import { Lottery } from '../../domain/lottery/lottery';
import { LotteryTxService } from '../../domain/lottery/lottery-tx.service';

@Injectable()
export class LotteryService {
  constructor(
    @Inject('LotteryTxService') private readonly txService: LotteryTxService,
  ) {}

  createLottery(createRequest: CreateLotteryRequestDTO): Promise<Lottery> {
    this.txService.sendLotteryCreateTx('http://',)
    return undefined;
  }
}
