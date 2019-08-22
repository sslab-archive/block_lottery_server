import { Module } from '@nestjs/common';
import { LotteryController } from '../../web/lottery/lottery.controller';
import { LotteryService } from '../../app/lottery/lottery.service';
import { TransactionModule } from './transaction.module';

@Module({
  imports: [TransactionModule],
  controllers: [LotteryController],
  providers: [LotteryService],
})
export class LotteryModule {
}
