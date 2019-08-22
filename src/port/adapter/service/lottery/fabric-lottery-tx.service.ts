import { HttpService, Inject, Injectable } from '@nestjs/common';
import { TransactionService } from '../../../domain/transaction/transactionService';

@Injectable()
export class FabricLotteryTxService implements TransactionService {
  constructor(@Inject('HttpService') private readonly httpService: HttpService) {
  }

  async send<T>(url: string, args: string): Promise<T> {
    return this.httpService.post(url, args).toPromise()

  }
}
