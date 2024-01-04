import { IsString } from 'class-validator';

export class createMessagesDto {
  @IsString()
  content: string;
}
