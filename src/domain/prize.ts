import { Participant } from './participant';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class Prize {
  UUID: string;
  title: string;
  memo: string;
  winnerNum: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => Participant)
  winners: Participant[];
}
