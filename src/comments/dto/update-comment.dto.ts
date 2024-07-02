import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';

// DTO for updating a Comment
export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
