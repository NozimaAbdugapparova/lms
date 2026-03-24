import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/common/decorators/role';
import { registerUserDto, UpdateProfileDto, UpdateRoleDto } from './dto/create.user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @ApiOperation({
        summary: `${UserRole.ADMIN}, ${UserRole.SUPERADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
    @Get('/all')
    getAllUsers(
        @Req() req: Request
    ){
        return this.usersService.getAllUsers(req)
    }

    @ApiOperation({
        summary: `Everyone can register, no any guards`
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema:{
            type:"object",
            properties:{
                fullName: {type:"string"},
                phone: {type: "string"},
                password: {type: "string"},
                image: {type: 'string', format: 'binary'}
            }
        }
    })
    @UseInterceptors(FileInterceptor("image", {
        fileFilter:(req, file, cb)=>{
            const existFile = ["png", "jpg", "jpeg"]
            if(!existFile.includes(file.mimetype.split("/")[1])){
                return cb(new UnsupportedMediaTypeException(), false)
            }

            cb(null, true)
        }
    }))
    @Post('register')
    registerUser(
        @Body() payload : registerUserDto,
        @UploadedFile() file? : Express.Multer.File
    ){
        return this.usersService.registerUser(payload, file)
    }

    @ApiOperation({
        summary: `${UserRole.SUPERADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN)
    @Put('update/role')
    updateRole(
        @Body() payload: UpdateRoleDto
    ){
        return this.usersService.updateRole(payload)
    }

    @ApiOperation({
        summary: `It is for updating profile, users can edit their name, phone number and image`
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema:{
            type:"object",
            properties:{
                fullName: {type:"string"},
                phone: {type: "string"},
                password: {type: "string"},
                image: {type: 'string', format: 'binary'}
            }
        }
    })
    @UseInterceptors(FileInterceptor("image", {
        fileFilter:(req, file, cb)=>{
            const existFile = ["png", "jpg", "jpeg"]
            if(!existFile.includes(file.mimetype.split("/")[1])){
                return cb(new UnsupportedMediaTypeException(), false)
            }

            cb(null, true)
        }
    }))
    @UseGuards(AuthGuard)
    @Put('update/profile/:id')
    updateProfile(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload : UpdateProfileDto,
        @Req() req: Request,
        @UploadedFile() file? : Express.Multer.File
    ){
        return this.usersService.updateProfile(id, payload, req['user'], file)
    }


    @ApiOperation({
        summary: `It is for deleting profile`
    })
    @UseGuards(AuthGuard)
    @Delete("delete/:id")
    deleteAccount(
        @Param("id", ParseIntPipe) id: number,
        @Req() req: Request
    ){
        return this.usersService.deleteUser(id, req["user"])
    }
}
