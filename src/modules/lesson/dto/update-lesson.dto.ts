import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
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
    @IsNumber()
    sectionId : number
}