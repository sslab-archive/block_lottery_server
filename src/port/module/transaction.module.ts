import { Module, HttpModule } from '@nestjs/common';
import { TransactionService } from '../../domain/transaction/transactionService';
import { FabricLotteryTxService } from '../adapter/service/lottery/fabric-lottery-tx.service';

@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  })],
  controllers: [],
  providers: [
    { provide: 'TransactionService', useClass: FabricLotteryTxService },
  ],
  exports: [
    { provide: 'TransactionService', useClass: FabricLotteryTxService },
  ],
})

export class TransactionModule {
}
