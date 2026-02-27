import { Module } from '@nestjs/common';
import configuration from './config.consts';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            cache: true,
            expandVariables: true,
        }),
    ],
})
export class ConfigModule {}
