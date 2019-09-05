export enum QueryType {
  QUERY_BY_EVENT_ID = 'QUERY_BY_EVENT_ID',
  QUERY_BY_PARTICIPANT_ID = 'QUERY_BY_PARTICIPANT_ID',
  QUERY_BY_DATE_RANGE = 'QUERY_BY_DATE_RANGE',
}

export class QueryLotteryTxRequestDto {
  queryType: QueryType;
  eventUUID: string;
  participantUUID: string;
  startDateTimestamp: number;
  endDateTimestamp: number;
}
