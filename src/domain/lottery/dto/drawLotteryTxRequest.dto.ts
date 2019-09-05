import { BlockInfo } from '../../block/block';

export class DrawLotteryTxRequestDto {
  eventUUID: string;
  targetBlock: BlockInfo;
  serviceProviderHash: string;

  submitterID: string;
  submitterAddress: string;
}
