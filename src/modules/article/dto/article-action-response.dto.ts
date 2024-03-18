import { ApiProperty } from '@nestjs/swagger';

export class ArticleActionDtoResponse {
  @ApiProperty({ example: 1 })
  id: number | null;
}
