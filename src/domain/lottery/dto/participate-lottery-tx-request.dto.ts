import { Participant } from '../../participant';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ParticipateLotteryTxRequestDto {
  eventUUID: string;

  @ValidateNested()
  @Type(() => Participant)
  participant: Participant;

  submitterID: string;
  submitterAddress: string;
}
