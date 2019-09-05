import { ArrayNotEmpty, IsEnum, IsNotEmpty, IsPositive, IsString, ValidateNested } from 'class-validator';
import { DrawType } from '../../../domain/lottery/lottery';
import { Type } from 'class-transformer';
import { Prize } from '../../../domain/prize';
import { BlockInfo } from '../../../domain/block/block';

export class CreateLotteryRequestDTO {
  @IsNotEmpty()
  eventName: string;

  @IsNotEmpty()
  contents: string;

  @IsPositive()
  deadlineTime: number;

  @IsNotEmpty()
  maxParticipant: number;

  @IsEnum(DrawType, { each: true })
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
