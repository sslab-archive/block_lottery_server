import { DrawType } from '../lottery';
import { Prize } from '../../prize';
import { BlockInfo } from '../../block/block';

export class CreateLotteryTxRequestDto {
  eventName: string;
  contents: string;
  deadlineTime: number;
  maxParticipant: number;
  drawTypes: DrawType[];
  prizes: Prize[];
  submitterID: string;
  submitterAddress: string;

  targetBlock: BlockInfo;
  serviceProviderHash: string;

  authURL: string;
  authParams: string[];
}
