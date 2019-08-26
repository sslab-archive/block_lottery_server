import { Inject, Injectable } from '@nestjs/common';
import { CreateLotteryRequestDTO } from './dto/create-lottery-request.dto';
import { Lottery } from '../../domain/lottery/lottery';
import { LotteryTxService } from '../../domain/lottery/lottery-tx.service';
import { CreateLotteryTxRequestDto } from '../../domain/lottery/dto/create-lottery-tx-request.dto';
import { ID } from '../../common/config/serviceprovider-info';
import { BlockService } from '../../domain/block/block.service';

@Injectable()
export class LotteryService {
  constructor(
    @Inject('LotteryTxService') private readonly txService: LotteryTxService,
    @Inject('BlockService') private readonly blockService: BlockService) {
  }

  async createLottery(createRequest: CreateLotteryRequestDTO): Promise<Lottery> {
    const lottery = Lottery.fromDTO(createRequest);
    const createLotteryTxDTO = new CreateLotteryTxRequestDto();

    createLotteryTxDTO.eventName = lottery.eventName;
    createLotteryTxDTO.deadlineTime = lottery.deadlineTime;
    createLotteryTxDTO.maxParticipant = lottery.maxParticipant;
    createLotteryTxDTO.drawTypes = lottery.drawTypes;
    createLotteryTxDTO.prizes = lottery.prizes;
    createLotteryTxDTO.submitterID = ID;
    createLotteryTxDTO.submitterAddress = 'not impl';
    createLotteryTxDTO.targetBlock = lottery.targetBlock;
    return await this.txService.sendCreateLotteryTx(createLotteryTxDTO);
  }
}
