import { Participant } from '../participant';
import { Prize } from '../prize';
import { BlockInfo } from '../block/block';
import { Transaction } from '../transaction/transaction';
import { CreateLotteryRequestDTO } from '../../app/lottery/dto/create-lottery-request.dto';
import { BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsEnum, IsOptional, ValidateNested } from 'class-validator';

export enum DrawType {
  DRAW_BLOCK_HASH = 'DRAW_BLOCK_HASH',
  DRAW_SERVICE_PROVIDER_HASH = 'DRAW_SERVICE_PROVIDER',
  DRAW_BYZNATINE_PROTOCOL = 'DRAW_BYZANTINE_PROTOCOL',
}

export enum Status {
  STATUS_REGISTERD = 'REGISTERED',
  STATUS_DRAWN = 'DRAWN',
  STATUS_REMOVED = 'REMOVED',
}

export class Lottery {
  // event data
  UUID: string;
  eventName: string;
  contents: string;

  @IsEnum(Status)
  status: Status;

  createTime: number;
  deadlineTime: number;
  maxParticipant: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => Participant)
  participants: Participant[];

  @IsEnum(DrawType, { each: true })
  @ArrayNotEmpty()
  drawTypes: DrawType[];

  @ValidateNested()
  @Type(() => Prize)
  prizes: Prize[];

  // block hash
  @Type(() => BlockInfo)
  targetBlock: BlockInfo;

  // service provider hash
  serviceProviderHash: string;

  // result data
  seedHash: string;

  // transaction info
  @ValidateNested()
  @Type(() => Transaction)
  eventCreateTx: Transaction[];

  @ValidateNested()
  @Type(() => Transaction)
  drawTx: Transaction[];

  static fromDTO(createDTO: CreateLotteryRequestDTO): Lottery {
    const e = new Lottery();
    e.eventName = createDTO.eventName;
    e.contents = createDTO.contents;
    e.status = Status.STATUS_REGISTERD;
    e.createTime = new Date().getUTCSeconds();
    e.deadlineTime = createDTO.deadlineTime;


    if (createDTO.maxParticipant === 0) {
      e.maxParticipant = 1000000;
    } else {
      e.maxParticipant = createDTO.maxParticipant;
    }

    e.drawTypes = createDTO.drawTypes;
    e.prizes = createDTO.prizes;
    return e;
  }
}
