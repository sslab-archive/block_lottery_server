import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateLotteryRequestDTO } from './dto/create-lottery-request.dto';
import { DrawType, Lottery } from '../../domain/lottery/lottery';
import { LotteryTxService } from '../../domain/lottery/lottery-tx.service';
import { CreateLotteryTxRequestDto } from '../../domain/lottery/dto/create-lottery-tx-request.dto';
import { ID } from '../../common/config/serviceprovider-info';
import { BlockService } from '../../domain/block/block.service';
import { BlockInfo, BlockType } from '../../domain/block/block';
import { QueryLotteryTxRequestDto, QueryType } from '../../domain/lottery/dto/query-lottery-tx-request.dto';
import { Participant } from '../../domain/participant';
import { ParticipateLotteryRequestDTO } from './dto/participate-lottery-request.dto';
import { ParticipateLotteryTxRequestDto } from '../../domain/lottery/dto/participate-lottery-tx-request.dto';
import { DrawLotteryRequestDTO } from './dto/draw-lottery-request.dto';
import { DrawLotteryTxRequestDto } from '../../domain/lottery/dto/drawLotteryTxRequest.dto';

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
    createLotteryTxDTO.contents = lottery.contents;
    createLotteryTxDTO.submitterID = ID;
    createLotteryTxDTO.submitterAddress = 'not impl';

    const targetHeight = await this.blockService.makeTargetBlockHeight(createRequest.deadlineTime);
    createLotteryTxDTO.targetBlock = BlockInfo.fromData(BlockType.BITCOIN, '', 0, 592224); // targetHeight
    return await this.txService.sendCreateLotteryTx(createLotteryTxDTO);
  }

  async getLotteryByUUID(UUID: string): Promise<Lottery> {
    const queryLotteryTxDTO = new QueryLotteryTxRequestDto();
    queryLotteryTxDTO.queryType = QueryType.QUERY_BY_EVENT_ID;
    queryLotteryTxDTO.eventUUID = UUID;

    return await this.txService.sendQueryLotteryTx(queryLotteryTxDTO);
  }

  async getLotteriesByDateRange(startTimestamp: number, endTimestamp: number): Promise<Lottery[]> {
    const queryLotteryTxDTO = new QueryLotteryTxRequestDto();
    queryLotteryTxDTO.queryType = QueryType.QUERY_BY_DATE_RANGE;
    queryLotteryTxDTO.startDateTimestamp = startTimestamp;
    queryLotteryTxDTO.endDateTimestamp = endTimestamp;

    return await this.txService.sendQueryLotteriesTx(queryLotteryTxDTO);
  }

  async participateLottery(participateRequest: ParticipateLotteryRequestDTO): Promise<Lottery> {
    const participateLotteryTxDTO = new ParticipateLotteryTxRequestDto();
    participateLotteryTxDTO.eventUUID = participateRequest.eventUUID;

    participateLotteryTxDTO.participant = new Participant();
    participateLotteryTxDTO.participant.UUID = participateRequest.participantUUID;
    participateLotteryTxDTO.participant.information = participateRequest.participantInfo;
    participateLotteryTxDTO.submitterID = ID;
    participateLotteryTxDTO.submitterAddress = 'not Impl';
    return await this.txService.sendParticipateLotteryTx(participateLotteryTxDTO);
  }

  async drawLottery(drawLotteryRequest: DrawLotteryRequestDTO): Promise<Lottery> {
    const lottery = await this.getLotteryByUUID(drawLotteryRequest.eventUUID);

    const drawLotteryTxDTO = new DrawLotteryTxRequestDto();
    drawLotteryTxDTO.eventUUID = drawLotteryRequest.eventUUID;
    drawLotteryTxDTO.submitterAddress = 'not impl';
    drawLotteryTxDTO.submitterID = ID;
    for (const drawType of lottery.drawTypes) {
      switch (drawType) {
        case DrawType.DRAW_BLOCK_HASH:
          let targetBlock: BlockInfo;
          try {
            targetBlock = await this.blockService.getTargetBlock(lottery.targetBlock.height);
          } catch (e) {
            throw new HttpException('cannot load target block : ' + lottery.targetBlock.height.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
          }
          drawLotteryTxDTO.targetBlock = targetBlock;
          break;
        case DrawType.DRAW_SERVICE_PROVIDER_HASH:
          throw new HttpException('SERVICE_PROVIDER_HASH is not supported yet', HttpStatus.INTERNAL_SERVER_ERROR);
        case DrawType.DRAW_BYZNATINE_PROTOCOL:
          throw new HttpException('DRAW_BYZNATINE_PROTOCOL is not supported yet', HttpStatus.INTERNAL_SERVER_ERROR);
        default:
          throw new HttpException('not supported draw type', HttpStatus.BAD_REQUEST);

      }
    }

    return await this.txService.sendDrawLotteryTx(drawLotteryTxDTO);

  }
}
