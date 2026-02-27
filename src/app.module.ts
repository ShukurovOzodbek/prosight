import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { LocusModule } from './modules/locus/locus.module';

@Module({
    imports: [ConfigModule, DatabaseModule, AuthModule, LocusModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
