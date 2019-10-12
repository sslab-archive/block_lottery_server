import { HttpException, HttpService, HttpStatus, Inject, Injectable, Type } from '@nestjs/common';
import { LotteryTxService } from '../../../../../domain/lottery/lottery-tx.service';

import { Lottery } from '../../../../../domain/lottery/lottery';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ID } from '../../../../../common/config/serviceprovider-info';
import { CHAINCODE_NAME, CHANNEL_NAME, PEER_LIST } from '../../../../../common/config/fabric-info';
import { QueryLotteryTxRequestDto } from '../../../../../domain/lottery/dto/query-lottery-tx-request.dto';
import { CreateLotteryTxRequestDto } from '../../../../../domain/lottery/dto/create-lottery-tx-request.dto';
import { ClassType } from 'class-transformer/ClassTransformer';
import { ParticipateLotteryTxRequestDto } from '../../../../../domain/lottery/dto/participate-lottery-tx-request.dto';
import { DrawLotteryTxRequestDto } from '../../../../../domain/lottery/dto/drawLotteryTxRequest.dto';

@Injectable()
export class FabricLotteryTxService implements LotteryTxService {
  private BASE_URL = 'http://localhost:4000';
  private BASE_BODY = {
    peers: PEER_LIST,
    fcn: 'invoke',
  };
  private BASE_HEADERS = {
    'user-name': ID,
    'org-name': 'Org1',
  };

  private CHAINCODE_URL = this.BASE_URL + '/channels/' + CHANNEL_NAME + '/chaincodes/' + CHAINCODE_NAME;

  constructor(@Inject('HttpService') private readonly httpService: HttpService) {
  }

  async sendCreateLotteryTx(dto: CreateLotteryTxRequestDto): Promise<Lottery> {
    const jsonArgs = JSON.stringify(dto);

    return this.sendTx('createLotteryEvent', jsonArgs, Lottery);
  }

  async sendQueryLotteriesTx(dto: QueryLotteryTxRequestDto): Promise<Lottery[]> {
    const jsonArgs = JSON.stringify(dto);

    return this.sendTx<Lottery[]>('queryLotteryEvent', jsonArgs, Lottery);
  }

  async sendQueryLotteryTx(dto: QueryLotteryTxRequestDto): Promise<Lottery> {
    const jsonArgs = JSON.stringify(dto);

    return this.sendTx<Lottery>('queryLotteryEvent', jsonArgs, Lottery);
  }

  async sendParticipateLotteryTx(dto: ParticipateLotteryTxRequestDto): Promise<Lottery> {
    const jsonArgs = JSON.stringify(dto);
    return this.sendTx<Lottery>('participateLotteryEvent', jsonArgs, Lottery);
  }

  async sendDrawLotteryTx(dto: DrawLotteryTxRequestDto): Promise<Lottery> {
    const jsonArgs = JSON.stringify(dto);

    return this.sendTx<Lottery>('drawLotteryEvent', jsonArgs, Lottery);
  }

  private async sendTx<T>(chainFuncName: string, jsonArgs: string, classType: ClassType<any>): Promise<T> {
    return this.httpService.post(this.CHAINCODE_URL,
      { ...this.BASE_BODY, args: [chainFuncName, jsonArgs] },
      { headers: { ...this.BASE_HEADERS } })
      .toPromise()
      .then(async res => {
          if (res.data.success === false) {
            throw new HttpException(res.data.message, 500);
          }
          const l: T = plainToClass(classType, JSON.parse(res.data.response) as T);
          const errors = await validate(l);
          if (errors.length > 0) {
            throw new HttpException(errors.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
          }
          return l;
        },
      ).catch(e => {
        throw e;
      });
  }

}
