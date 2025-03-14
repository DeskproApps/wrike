import { useCallback, useRef, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { IOAuth2, Title, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
import { AnchorButton } from '@deskpro/deskpro-ui';
import { Container } from '@/components/common';
import { GLOBAL_CLIENT_ID } from '@/constants';
import { Settings } from '@/types';
import { getTokens } from '@/services/wrike/getTokens';
import setAccessToken from '@/services/deskpro/setAccessToken';
import setRefreshToken from '@/services/deskpro/setRefreshToken';
import { useAsyncError } from '@/hooks';

function LogInPage() {
    const { context } = useDeskproLatestAppContext<unknown, Settings>();
    const navigate = useNavigate();
    const callbackURLRef = useRef('');
    const [authorisationURL, setAuthorisationURL] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { asyncErrorHandler } = useAsyncError();
    const [isPolling, setIsPolling] = useState(false);
    const [oAuth2Context, setOAuth2Context] = useState<IOAuth2 | null>(null);

    useInitialisedDeskproAppClient(async client => {
        if (context?.settings.use_deskpro_saas === undefined) {
            return;
        };

        const clientID = context.settings.client_id;
        const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';

        if (mode === 'local' && typeof clientID !== 'string') {
            return;
        };

        const oauth2Response = mode === 'global' ? await client.startOauth2Global(GLOBAL_CLIENT_ID) : await client.startOauth2Local(
            ({ callbackUrl, state }) => {
                callbackURLRef.current = callbackUrl;

                return `https://login.wrike.com/oauth2/authorize/v4?${createSearchParams([
                    ['client_id', clientID ?? ''],
                    ['state', state],
                    ['response_type', 'code'],
                    ['redirect_uri', callbackUrl]
                ])}`;
            },
            /code=(?<code>[^&]+)/,
            async code => {
                const data = await getTokens({
                    client,
                    code,
                    redirectURI: callbackURLRef.current
                });

                return { data };
            }
        );

        setAuthorisationURL(oauth2Response.authorizationUrl);
        setOAuth2Context(oauth2Response);
    }, [context, navigate]);

    useInitialisedDeskproAppClient(client => {
        if (!oAuth2Context) {
            return;
        };

        const startPolling = async () => {
            try {
                const pollResult = await oAuth2Context.poll();

                await setAccessToken({ client, token: pollResult.data.access_token });
                pollResult.data.refresh_token && await setRefreshToken({ client, token: pollResult.data.refresh_token });

                navigate('/');
            } catch (error) {
                asyncErrorHandler(error instanceof Error ? error : new Error('error logging in with OAuth2'));
            } finally {
                setIsPolling(false);
                setIsLoading(false);
            };
        };

        if (isPolling) {
            startPolling();
        };
    }, [oAuth2Context, navigate, isPolling]);

    const onLogIn = useCallback(() => {
        setIsLoading(true);
        setIsPolling(true);
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