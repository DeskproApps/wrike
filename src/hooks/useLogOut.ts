import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeskproAppClient } from '@deskpro/app-sdk';
import { OAUTH2_ACCESS_TOKEN_PATH } from '@/constants';

export function useLogOut() {
    const { client } = useDeskproAppClient();
    const navigate = useNavigate();

    const logOut = useCallback(() => {
        if (!client) {
            return;
        };

        client.setBadgeCount(0);
        client.deleteUserState(OAUTH2_ACCESS_TOKEN_PATH)
            .finally(() => {
                navigate('/log_in');
            });
    }, [client, navigate]);

    return { logOut };
};