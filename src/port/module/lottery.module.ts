import { HttpModule, Module } from '@nestjs/common';
import { LotteryController } from '../../web/lottery/lottery.controller';
import { LotteryService } from '../../app/lottery/lottery.service';
import { FabricLotteryTxService } from '../adapter/service/fabric/lottery/fabric-lottery-tx.service';
import { BitcoinBlockService } from '../adapter/service/bitcoin/bitcoin-block.service';

@Module({
  imports: [HttpModule],
  controllers: [LotteryController],
  providers: [
    { provide: 'LotteryTxService', useClass: FabricLotteryTxService },
    { provide: 'BlockService', useClass: BitcoinBlockService },
    LotteryService,
  ],
})

export class LotteryModule {
}
