import { Module } from '@nestjs/common';
import { LotteryController } from '../../web/lottery/lottery.controller';
import { LotteryService } from '../../app/lottery/lottery.service';
import { FabricLotteryTxService } from '../adapter/service/fabric/lottery/fabric-lottery-tx.service';

@Module({
  imports: [],
  controllers: [LotteryController],
  providers: [LotteryService,
    { provide: 'LotteryTxService', useClass: FabricLotteryTxService },
  ],
})

export class LotteryModule {
}
