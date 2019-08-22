import { Inject, Injectable } from '@nestjs/common';
import { CreateLotteryRequestDTO } from './dto/create-lottery-request.dto';
import { Lottery } from '../../domain/lottery';
import { TransactionService } from '../../domain/transaction/transactionService';

@Injectable()
export class LotteryService {
  constructor(
    @Inject('TransactionService') private readonly txService: TransactionService,
  ) {}

  createLottery(createRequest: CreateLotteryRequestDTO): Promise<Lottery> {

    this.txService.sendTransaction('http://',)
    return undefined;
  }
}
