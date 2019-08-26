import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { LotteryService } from '../../app/lottery/lottery.service';
import { CreateLotteryRequestDTO } from '../../app/lottery/dto/create-lottery-request.dto';
import { Lottery } from '../../domain/lottery/lottery';

@Controller('lottery')
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {
  }

  @Post()
  async create(@Body() createRequest: CreateLotteryRequestDTO): Promise<Lottery> {
    return await this.lotteryService.createLottery(createRequest);
  }
}
