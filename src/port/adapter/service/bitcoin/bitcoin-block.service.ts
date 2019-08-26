import { BlockService } from '../../../../domain/block/block.service';
import { HttpService, Inject, Injectable } from '@nestjs/common';
import { BlockInfo, BlockType } from '../../../../domain/block/block';
import { validate } from 'class-validator';

@Injectable()
export class BitcoinBlockService implements BlockService {
  private LATEST_BLOCK_URL = 'https://blockchain.info/ko/latestblock';
  private GET_BLOCK_URL = 'https://api.blockcypher.com/v1/btc/main/blocks/';

  constructor(@Inject('HttpService') private readonly httpService: HttpService) {
  }

  async getTargetBlock(targetHeight: number): Promise<BlockInfo> {
    return this.httpService.get(this.GET_BLOCK_URL + targetHeight.toString())
      .toPromise()
      .then(async res => {
        const blockInfo = new BlockInfo(BlockType.BITCOIN, res.data.hash, Math.floor(Date.parse(res.data.time) / 1000), res.data.height);

        const errors = await validate(blockInfo);
        if (errors.length > 0) {
          throw Error('invalid block return from Bitcoin Block Service');
        }

        return blockInfo;
      })
      .catch(e => {
          throw e;
        },
      );
  }

  async makeTargetBlockHeight(deadlineTimestamp: number): Promise<number> {
    // todo : 일단 10분당 1블록 생각하고 마감일까지 계산 + 6블록 추가. 다른방법 고민
    const nowSec = Math.floor(Date.now() / 1000);
    const diffSec = deadlineTimestamp - nowSec;
    if (diffSec < 0) {
      throw Error('input time is past in Bitcoin make target block height');
    }

    const lastHeight = await this.getLatestBlockHeight();
    return lastHeight + Math.floor(diffSec / 600) + 6;
  }

  async getLatestBlockHeight(): Promise<number> {
    return this.httpService.get(this.LATEST_BLOCK_URL)
      .toPromise()
      .then(async res => {
        const blockInfo = new BlockInfo(BlockType.BITCOIN, res.data.hash, Math.floor(Date.parse(res.data.time) / 1000), res.data.height);

        const errors = await validate(blockInfo);
        if (errors.length > 0) {
          throw Error('invalid block return from Bitcoin Block Service');
        }

        return blockInfo.height;
      })
      .catch(e => {
          throw e;
        },
      );
  }

}
