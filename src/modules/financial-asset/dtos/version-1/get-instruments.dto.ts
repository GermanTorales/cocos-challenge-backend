import { IsString } from 'class-validator';

export class GetInstrumentDto {
  @IsString()
  text: string;
}
