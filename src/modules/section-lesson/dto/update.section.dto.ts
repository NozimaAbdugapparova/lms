import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateSectionDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name: string
}