import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { LotteryService } from '../../app/lottery/lottery.service';
import { async } from 'rxjs/internal/scheduler/async';
import { CreateLotteryRequestDTO } from '../../app/lottery/dto/create-lottery-request.dto';
import { constants } from 'http2';

@Controller('lottery')
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {
  }

  @Post()
  async create(@Body() createRequest: CreateLotteryRequestDTO): Promise<Event> {
    return this.lotteryService.createLottery(createRequest);
  }
}
