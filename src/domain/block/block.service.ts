import { BlockInfo } from './block';

export interface BlockService {
  makeTargetBlockHeight(deadlineTimestamp: number): Promise<number>;
  getTargetBlock(targetHeight: number): Promise<BlockInfo>;
  getLatestBlockHeight(): Promise<number>;
}
