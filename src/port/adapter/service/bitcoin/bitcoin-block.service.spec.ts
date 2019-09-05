import { BitcoinBlockService } from './bitcoin-block.service';
import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BlockInfo, BlockType } from '../../../../domain/block/block';

describe('BitcoinBlockService', () => {
  let bitcoinBlockService: BitcoinBlockService;
  beforeAll(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [BitcoinBlockService],
    }).compile();
    bitcoinBlockService = testAppModule.get<BitcoinBlockService>(BitcoinBlockService);
    await testAppModule.createNestApplication().init();
  });

  describe('#getLatestBlockHeight()', () => {
    it('should return latest block height', async () => {
      expect(await bitcoinBlockService.getLatestBlockHeight()).toBeGreaterThan(0);
    });
  });

  describe('#makeTargetBlockHeight()', () => {
    it('should return height', async () => {
      // 600초 추가니, 10분. 즉 블럭 1개뒤 + 보너스 6개 = 7개뒤
      expect(await bitcoinBlockService.makeTargetBlockHeight(Math.floor(Date.now() / 1000) + 600))
        .toBe((await bitcoinBlockService.getLatestBlockHeight()) + 7);
    });
  });

  describe('#getTargetBlock()', () => {
    it('should return block 591802', async () => {
      expect(await bitcoinBlockService.getTargetBlock(591802))
        .toEqual(BlockInfo.fromData(BlockType.BITCOIN, '00000000000000000014991959287b2c292ab60dea2046b67250d351d696a2d8', 1566799004, 591802));
    });
  });
});
