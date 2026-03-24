import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CourseCategoryDto{
    @ApiProperty()
    @IsString()
    name: string
}
