import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { LotteryService } from '../../app/lottery/lottery.service';
import { CreateLotteryRequestDTO } from '../../app/lottery/dto/create-lottery-request.dto';
import { Lottery } from '../../domain/lottery/lottery';
import { ParticipateLotteryRequestDTO } from '../../app/lottery/dto/participate-lottery-request.dto';
import { DrawLotteryRequestDTO } from '../../app/lottery/dto/draw-lottery-request.dto';

@Controller('lottery')
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {
  }

  @Post()
  async create(@Body() createRequest: CreateLotteryRequestDTO): Promise<Lottery> {
    return await this.lotteryService.createLottery(createRequest);
  }

  @Get()
  async getByTimeRange(@Query('startTimestamp', new ParseIntPipe())startTimestamp: number,
                       @Query('endTimestamp', new ParseIntPipe())endTimestamp: number): Promise<Lottery[]> {
    if (startTimestamp <= 0 || endTimestamp <= 0) {
      throw new HttpException('startTimestamp, endTimestamp query required', HttpStatus.BAD_REQUEST);
    }

    return await this.lotteryService.getLotteriesByDateRange(startTimestamp, endTimestamp);
  }

  @Get(':UUID')
  async getByLotteryUUID(@Param('UUID') UUID): Promise<Lottery> {
    return await this.lotteryService.getLotteryByUUID(UUID);
  }

  @Post(':UUID/participant')
  async participateLottery(@Param('UUID')eventUUID: string, @Body()participateRequestDTO: ParticipateLotteryRequestDTO) {
    participateRequestDTO.eventUUID = eventUUID;
    return await this.lotteryService.participateLottery(participateRequestDTO);
  }

  @Post(':UUID/draw')
  async drawLottery(@Param('UUID')eventUUID: string, @Body()drawRequestDTO: DrawLotteryRequestDTO) {
    drawRequestDTO.eventUUID = eventUUID;
    return await this.lotteryService.drawLottery(drawRequestDTO);
  }

}
