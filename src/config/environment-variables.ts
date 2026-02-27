import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class EnvironmentVariables {
    @IsNotEmpty()
	@IsNumberString()
    PORT!: number;

    @IsNotEmpty()
    @IsString()
    JWT_SECRET!: string;

    @IsNotEmpty()
    @IsString()
    DATABASE_URL!: string;
}
