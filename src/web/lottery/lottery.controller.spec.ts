import { Test, TestingModule } from '@nestjs/testing';
import { LotteryController } from './lottery.controller';
import * as levelup from 'levelup';
import * as leveldown from 'leveldown';

describe('Lottery Controller', () => {
  let controller: LotteryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotteryController],
    }).compile();

    controller = module.get<LotteryController>(LotteryController);
  });

  // it('should be defined', () => {
  //   const db: levelup.LevelUp = levelup.default(leveldown.default('./db'));
  //   db.open(err => {
  //     console.log('ERRRR');
  //   });
  //   db.put('k', 'v').then(a => {
  //     let v = db.get('k');
  //     v.then(r => {
  //       console.log(r);
  //     }).finally(() =>
  //       console.log('fina'));
  //   }).finally(() => {
  //     console.log('fuck');
  //   });
  // });
  // console.log('asdf');

});
