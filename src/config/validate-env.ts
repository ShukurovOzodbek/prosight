import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentVariables } from './environment-variables';

export function validateEnv(
    config: Record<string, unknown>,
): EnvironmentVariables {
    const validated = plainToInstance(
        EnvironmentVariables,
        config,
    ) as EnvironmentVariables;

    const errors = validateSync(validated, {
        whitelist: true,
        forbidNonWhitelisted: false,
    });

    if (errors.length > 0) {
        const messages = errors.map((e) => {
            const constraints = e.constraints ? Object.values(e.constraints) : [];
            return `${e.property}: ${constraints.join(', ')}`;
        });
        throw new Error(`Environment validation failed:\n${messages.join('\n')}`);
    }

    return validated;
}
