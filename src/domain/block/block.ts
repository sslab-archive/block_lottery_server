import { IsEnum, IsNotEmpty } from 'class-validator';

export enum BlockType {
  BITCOIN = 'BITCOIN',
  EOS = 'EOS',
}

export class BlockInfo {
  @IsNotEmpty()
  @IsEnum(BlockType)
  blockType: BlockType;

  hash: string;

  timestamp: number;

  height: number;

  static fromData(blockType: BlockType, hash: string, timestamp: number, height: number): BlockInfo {
    const b = new BlockInfo();
    b.blockType = blockType;
    b.hash = hash;
    b.timestamp = timestamp;
    b.height = height;
    return b;
  }
}
