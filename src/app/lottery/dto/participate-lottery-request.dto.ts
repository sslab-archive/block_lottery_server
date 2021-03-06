import { IsNotEmpty, IsString } from 'class-validator';

export class ParticipateLotteryRequestDTO {
  eventUUID: string;

  @IsString()
  @IsNotEmpty()
  participantUUID: string;

  participantInfo: string;

  authParams: string[];
  participantEntropy: string;
}
