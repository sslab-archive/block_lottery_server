import { Transaction } from './transaction/transaction';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Participant {
  UUID: string;
  information: string;
  authInformation: string;
  randomEntropy: string;
  @Type(() => Transaction)
  participateTx: Transaction;
}
