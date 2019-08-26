import { HttpService, Inject, Injectable } from '@nestjs/common';
import { LotteryTxService } from '../../../../domain/lottery/lottery-tx.service';
import { Lottery } from '../../../../domain/lottery/lottery';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class FabricLotteryTxService implements LotteryTxService {
  constructor(@Inject('HttpService') private readonly httpService: HttpService) {
  }

  sendCreateLotteryTx(url: string, jsonArgs: string): Lottery {
    this.httpService.post(url, jsonArgs).toPromise().then(
      res => {
        const l = plainToClass(res.data, Lottery);
        validate(l).then(errors => {
          if (errors.length > 0) {
            throw Error('invalid lottery return from txRequest');
          }
        });
      },
    ).catch(e => {
      throw e;
    });

    return null;
  }

  sendQueryLotteriesTx(url: string, jsonArgs: string): Lottery[] {
    return [];
  }

  sendQueryLotteryTx(url: string, jsonArgs: string): Lottery {
    return undefined;
  }
}
