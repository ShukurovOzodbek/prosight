import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Login with predefined user' })
    @ApiResponse({ status: 200, description: 'Returns JWT' })
    @ApiResponse({ status: 401, description: 'Invalid login or password' })
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto.login, dto.password);
    }
}
