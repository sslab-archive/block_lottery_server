import { IsEnum, IsNotEmpty } from 'class-validator';

export enum BlockType {
  BITCOIN = 'BITCOIN',
  EOS = 'EOS',
}

export class BlockInfo {
  @IsEnum(BlockType)
  @IsNotEmpty()
  blockType: BlockType;

  @IsNotEmpty()
  hash: string;

  @IsNotEmpty()
  timestamp: number;

  @IsNotEmpty()
  height: number;

  constructor(blockType: BlockType, hash: string, timestamp: number, height: number) {
    this.blockType = blockType;
    this.hash = hash;
    this.timestamp = timestamp;
    this.height = height;
  }

}
