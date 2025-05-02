import * as dotenv from 'dotenv';

dotenv.config();

export const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`;
export const GITHUB_APP_INSTALLATION_URL = `https://github.com/apps/${process.env.GITHUB_APP_NAME}/installations/new`;
