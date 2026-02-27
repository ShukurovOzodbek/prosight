import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );
    const configService = app.get(ConfigService);

    const config = new DocumentBuilder()
        .setTitle('Prosight API')
        .setDescription('API documentation for Prosight application')
        .setVersion('1.0')
        .addTag('docs')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);

    const port = configService.get<number>('port') || 3000;

    await app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
bootstrap();
