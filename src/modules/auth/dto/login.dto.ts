import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'admin_user' })
    @IsString()
    @IsNotEmpty()
    login: string;

    @ApiProperty({ example: 'hashed_password' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
