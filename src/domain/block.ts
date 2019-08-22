import { IsEnum, IsNotEmpty } from 'class-validator';

export enum BlockType {
  BITCOIN = 'BITCOIN',
  EOS = 'EOS',
}

export class BlockInfo {
  @IsEnum(BlockType)
  @IsNotEmpty()
  blockType: BlockType;
  hash: string;
  timestamp: number;
  height: number;
}
