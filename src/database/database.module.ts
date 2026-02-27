import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from './strategies/snake-case.naming-strategy';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const url = configService.get<string>('database.url');
                if (!url) {
                    throw new Error('database.url is not set');
                }
                return {
                    type: 'postgres',
                    url,
                    namingStrategy: new SnakeNamingStrategy(),
                    autoLoadEntities: true,
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
