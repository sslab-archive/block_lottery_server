import { HttpService, Inject, Injectable } from '@nestjs/common';
import { LotteryTxService } from '../../../../../domain/lottery/lottery-tx.service';
import { CreateLotteryTxRequestDto } from '../../../../../domain/lottery/dto/create-lottery-tx-request.dto';
import { Lottery } from '../../../../../domain/lottery/lottery';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ID } from '../../../../../common/config/serviceprovider-info';
import { CHAINCODE_NAME, CHANNEL_NAME, PEER_LIST } from '../../../../../common/config/fabric-info';

@Injectable()
export class FabricLotteryTxService implements LotteryTxService {
  private BASE_URL = 'http://localhost:4000';
  private BASE_BODY = {
    peers: PEER_LIST,
    fcn: 'invoke',
  };
  private BASE_HEADERS = {
    userName: ID,
    orgName: 'Org1',
  };

  private CHAINCODE_URL = this.BASE_URL + '/channels/' + CHANNEL_NAME + '/chaincodes/' + CHAINCODE_NAME;

  constructor(@Inject('HttpService') private readonly httpService: HttpService) {
  }

  async sendCreateLotteryTx(dto: CreateLotteryTxRequestDto): Promise<Lottery> {
    const jsonArgs = JSON.stringify(dto);

    return this.httpService.post(this.CHAINCODE_URL, { ...this.BASE_BODY, args: ['createLottery', jsonArgs] }, { headers: { ...this.BASE_HEADERS } })
      .toPromise()
      .then(async res => {
          const l: Lottery = plainToClass(res.data, Lottery);
          const errors = await validate(l);
          if (errors.length > 0) {
            throw Error('invalid lottery return from txRequest');
          }

          return l;
        },
      ).catch(e => {
        throw e;
      });
  }

  async sendQueryLotteriesTx(jsonArgs: string): Promise<Lottery[]> {
    return [];
  }

  async sendQueryLotteryTx(jsonArgs: string): Promise<Lottery> {
    return undefined;
  }
}
