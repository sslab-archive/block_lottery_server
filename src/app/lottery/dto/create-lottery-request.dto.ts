import { BlockInfo } from '../../../domain/block';
import { DrawType } from '../../../domain/lottery';
import { Prize } from '../../../domain/prize';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsEnum, IsNotEmpty, IsPositive, ValidateNested } from 'class-validator';

export class CreateLotteryRequestDTO {
  @IsNotEmpty()
  eventName: string;

  @IsPositive()
  deadlineTime: number;

  @IsNotEmpty()
  maxParticipant: number;

  @IsEnum(DrawType)
  @ArrayNotEmpty()
  drawTypes: DrawType[];

  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => Prize)
  prizes: Prize[];

  @ValidateNested()
  @Type(() => BlockInfo)
  targetBlock: BlockInfo;
}