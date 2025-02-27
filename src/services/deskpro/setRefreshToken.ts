import { IDeskproClient } from '@deskpro/app-sdk';
import { OAUTH_REFRESH_TOKEN_PATH } from '@/constants';

interface SetRefreshToken {
    client: IDeskproClient;
    token: string;
};

function setRefreshToken({ client, token }: SetRefreshToken) {
    return client.setUserState(OAUTH_REFRESH_TOKEN_PATH, token);
};

export default setRefreshToken;