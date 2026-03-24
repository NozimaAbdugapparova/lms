import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { MentorProfileService } from './mentor-profile.service';
import { MentorProfileDto } from './dto/mentor-profile.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateMentorProfileDto } from './dto/update-profile.dto';

@ApiBearerAuth()
@Controller('mentor-profile')
export class MentorProfileController {
    constructor(private readonly mentorProfileService: MentorProfileService){}

    @ApiOperation({
        summary:`Superadmin, admin can see all mentors`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @Get('all')
    getAllMentors(
        @Req() req: Request
    ){
        return this.mentorProfileService.getAllMentors(req["user"])
    }


    @ApiOperation({
        summary:`Superadmin, admin and mentor can fill mentor's profile`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.MENTOR)
    @Post("create")
    createProfile(
        @Body() payload : MentorProfileDto,
        @Req() req: Request
    ){
        return this.mentorProfileService.createProfile(payload, req["user"])
    }

    @ApiOperation({
        summary:`Superadmin, admin and mentor can update mentor's profile`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.MENTOR)
    @Put('update/:id')
    updateProfile(
        @Param("id", ParseIntPipe) id: number,
        @Body() payload : UpdateMentorProfileDto,
        @Req() req: Request
    ){
        return this.mentorProfileService.updateProfile(id, payload,req["user"])
    }


    @ApiOperation({
        summary:`Only superadmin can fire mentor`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN)
    @Delete("fire/:id")
    fireMentor(
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ){
        return this.mentorProfileService.deleteProfile(id, req["user"])
    }
}
