import { useCallback, useRef, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Title, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
import { AnchorButton } from '@deskpro/deskpro-ui';
import { Container } from '@/components/common';
import { GLOBAL_CLIENT_ID } from '@/constants';
import { Settings } from '@/types';
import { getTokens } from '@/services/wrike/getTokens';
import setAccessToken from '@/services/deskpro/setAccessToken';
import setRefreshToken from '@/services/deskpro/setRefreshToken';

function LogInPage() {
    const { context } = useDeskproLatestAppContext<unknown, Settings>();
    const navigate = useNavigate();
    const callbackURLRef = useRef('');
    const [authorisationURL, setAuthorisationURL] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useInitialisedDeskproAppClient(async client => {
        if (context?.settings.use_deskpro_saas === undefined) return;

        const clientID = context.settings.client_id;
        const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';

        if (mode === 'local' && typeof clientID !== 'string') return;

        const oauth2 = mode === 'global' ? await client.startOauth2Global(GLOBAL_CLIENT_ID) : await client.startOauth2Local(
            ({ callbackUrl, state }) => {
                callbackURLRef.current = callbackUrl;

                return `https://login.wrike.com/oauth2/authorize/v4?${createSearchParams([
                    ['client_id', context?.settings.client_id!],
                    ['state', state],
                    ['response_type', 'code'],
                    ['redirect_uri', callbackUrl]
                ])}`;
            },
            /code=(?<code>[^&]+)/,
            async code => {
                const { access_token } = await getTokens({
                    client,
                    code,
                    redirectURI: callbackURLRef.current
                });

                return {
                    data: { access_token }
                };
            }
        );

        setAuthorisationURL(oauth2.authorizationUrl);

        try {
            const pollResult = await oauth2.poll();

            await setAccessToken({ client, token: pollResult.data.access_token });
            pollResult.data.refresh_token && await setRefreshToken({ client, token: pollResult.data.refresh_token });

            navigate('/');
        } catch (error) {

        } finally {
            setIsLoading(false);
        };
    }, [context, navigate]);

    const onLogIn = useCallback(() => {
        setIsLoading(true);
        window.open(authorisationURL, '_blank');
      }, [setIsLoading, authorisationURL]);

    return (
        <Container>
            <Title title='Log into Wrike' />
            <AnchorButton
                text='Log In'
                target='_blank'
                href={authorisationURL ?? '#'}
                loading={!authorisationURL || isLoading}
                disabled={!authorisationURL || isLoading}
                onClick={onLogIn}
            />
        </Container>
    );
};

export default LogInPage;