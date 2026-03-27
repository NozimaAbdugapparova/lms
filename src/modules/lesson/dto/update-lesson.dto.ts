import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateLessonDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name : string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    about : string

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    sectionId : number
}