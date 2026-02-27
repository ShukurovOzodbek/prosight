import { validateEnv } from './validate-env';

export default () => {
    const env = validateEnv(process.env as Record<string, unknown>);

    return {
        port: env.PORT,
        jwt: {
            secret: env.JWT_SECRET,
        },
        database: {
            url: env.DATABASE_URL,
        },
    };
};
