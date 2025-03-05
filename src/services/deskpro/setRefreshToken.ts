import { IDeskproClient } from '@deskpro/app-sdk';
import { OAUTH2_REFRESH_TOKEN_PATH } from '@/constants';

interface SetRefreshToken {
    client: IDeskproClient;
    token: string;
};

function setRefreshToken({ client, token }: SetRefreshToken) {
    return client.setUserState(OAUTH2_REFRESH_TOKEN_PATH, token, {backend: true});
};

export default setRefreshToken;