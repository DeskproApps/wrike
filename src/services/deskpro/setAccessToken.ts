import { IDeskproClient } from '@deskpro/app-sdk';
import { OAUTH_ACCESS_TOKEN_PATH } from '@/constants';

interface SetAccessToken {
    client: IDeskproClient;
    token: string;
};

function setAccessToken({ client, token }: SetAccessToken) {
    return client.setUserState(OAUTH_ACCESS_TOKEN_PATH, token);
};

export default setAccessToken;