import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PRE_DEFINED_USERS } from './constants';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async login(login: string, password: string) {
        const user = PRE_DEFINED_USERS.find((u) => u.login === login && u.password === password);

        if (!user) {
            throw new UnauthorizedException('Invalid login or password');
        }

        const access_token = this.jwtService.sign({
            sub: user.id,
            role: user.role,
        });

        return { access_token };
    }
}
