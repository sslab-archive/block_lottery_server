import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LotteryTxService } from '../../../../../domain/lottery/lottery-tx.service';
import { CreateLotteryTxRequestDto } from '../../../../../domain/lottery/dto/create-lottery-tx-request.dto';
import { DrawLotteryTxRequestDto } from '../../../../../domain/lottery/dto/drawLotteryTxRequest.dto';
import { ParticipateLotteryTxRequestDto } from '../../../../../domain/lottery/dto/participate-lottery-tx-request.dto';
import { QueryLotteryTxRequestDto } from '../../../../../domain/lottery/dto/query-lottery-tx-request.dto';
import { Lottery, Status } from '../../../../../domain/lottery/lottery';
import { Transaction } from '../../../../../domain/transaction/transaction';
import { v4 } from 'uuid';
import { Participant } from '../../../../../domain/participant';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { plainToClass } from 'class-transformer';
import { raw } from 'body-parser';

@Injectable()
export class MockLotteryTxService implements LotteryTxService {

  private db = new JsonDB(new Config('myDataBase', true, false, '/'));

  async sendCreateLotteryTx(dto: CreateLotteryTxRequestDto): Promise<Lottery> {
    return new Promise<Lottery>((resolve, reject) => {
      const l = Lottery.fromDTO(dto);
      l.UUID = v4();
      l.participants = new Array<Participant>();
      l.createTime = Math.floor(Date.now() / 1000);
      const createTx = new Transaction();
      createTx.ID = v4();
      createTx.timestamp = Math.floor(Date.now() / 1000);
      l.eventCreateTx = createTx;
      l.authParams = new Array<string>();
      l.authURL = '';
      l.targetBlock = dto.targetBlock;
      this.saveLottery(l);
      resolve(l);
    });
  }

  sendDrawLotteryTx(dto: DrawLotteryTxRequestDto): Promise<Lottery> {

    const event: Lottery = this.getLottery(dto.eventUUID);
    if (event === undefined) {
      throw new HttpException('해당 이벤트가 존재하지 않습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    let totalCount: number = 0;
    event.prizes.forEach((onePrize) => {
      totalCount += onePrize.winnerNum;
    });
    const shuffledParticipants: Participant[] = event.participants
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
    let passedIdx: number = 0;
    for (let i: number = 0; i < event.prizes.length; i++) {
      event.prizes[i].winners = new Array<Participant>();
      for (let j: number = 0; j < event.prizes[i].winnerNum; j++) {
        event.prizes[i].winners.push(shuffledParticipants[passedIdx]);
        passedIdx += 1;
        if (passedIdx >= totalCount) {
          break;
        }
      }
      if (passedIdx >= totalCount) {
        break;
      }
    }
    event.targetBlock = dto.targetBlock;
    event.drawTx = new Transaction();
    event.drawTx.ID = v4();
    event.drawTx.timestamp = Math.floor(Date.now() / 1000);
    event.status = Status.STATUS_DRAWN;
    this.saveLottery(event);
    return new Promise<Lottery>(((resolve, reject) => {
      resolve(event);
    }));
  }

  sendParticipateLotteryTx(dto: ParticipateLotteryTxRequestDto): Promise<Lottery> {
    const event = this.getLottery(dto.eventUUID);
    if (event === undefined) {
      throw new HttpException('해당 이벤트가 존재하지 않습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (event.deadlineTime < Math.floor(Date.now() / 1000)) {
      throw new HttpException('이벤트 참여 기간이 지났습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    dto.participant.participateTx = new Transaction();
    dto.participant.participateTx.timestamp = Math.floor(Date.now() / 1000);
    dto.participant.participateTx.ID = v4();
    event.participants.push(dto.participant);
    return new Promise<Lottery>(((resolve, reject) => {
      this.saveLottery(event);
      resolve(event);
    }));
  }

  sendQueryLotteriesTx(dto: QueryLotteryTxRequestDto): Promise<Lottery[]> {
    // todo
    return new Promise<Lottery[]>((resolve, reject) => {
      resolve(this.getAllLotteries());
    });
  }

  sendQueryLotteryTx(dto: QueryLotteryTxRequestDto): Promise<Lottery> {
    // todo
    const event = this.getLottery(dto.eventUUID);
    if (event === undefined) {
      throw new HttpException('해당 이벤트가 존재하지 않습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return new Promise<Lottery>(((resolve, reject) => {
      resolve(event);
    }));
  }

  saveLottery(l: Lottery): void {
    const idx = this.db.getIndex('/Lotteries', l.UUID);
    const dataPath = '/Lotteries[' + idx + ']';
    if (idx !== -1) {
      this.db.delete(dataPath);
    }
    this.db.push('/Lotteries[]', { id: l.UUID, data: l }, true);
  }

  getLottery(id: string): Lottery {
    const idx = this.db.getIndex('/Lotteries', id);
    console.log(id);
    console.log(idx);
    if (idx === -1) {
      return null;
    }
    const dataPath = '/Lotteries[' + idx + ']';
    const rawData = this.db.getData(dataPath);
    return plainToClass(Lottery, rawData.data);
  }

  getAllLotteries(): Lottery[] {
    const rawData: any[] = this.db.getData('/Lotteries');
    const results: Lottery[] = new Array<Lottery>();
    rawData.forEach((v, i) => {
      const a = plainToClass(Lottery, v.data);
      results.push(a);
    });
    return results;
  }
}
