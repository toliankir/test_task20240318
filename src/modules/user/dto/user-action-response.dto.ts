import { ApiProperty } from '@nestjs/swagger';

export class UserActionDtoResponse {
  @ApiProperty({ example: 1 })
  id: number | null;
}
