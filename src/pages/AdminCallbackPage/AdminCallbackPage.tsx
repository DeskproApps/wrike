import { useState } from 'react';
import styled from 'styled-components';
import { CopyToClipboardInput, LoadingSpinner, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
import { DeskproTheme, P1 } from '@deskpro/deskpro-ui';
import { createSearchParams } from 'react-router-dom';

const Description = styled(P1)`
    margin-top: 8px;
    color: ${({ theme }) => (theme as DeskproTheme).colors.grey80};
`;

function AdminCallbackPage() {
    const [callbackURL, setCallbackURL] = useState<string | null>(null);

    useInitialisedDeskproAppClient(client => {
        client.startOauth2Local(
            ({ callbackUrl, state }) => {
                setCallbackURL(callbackUrl);

                return `https://login.wrike.com/oauth2/authorize/v4?${createSearchParams([
                    ['client_id', 'clientID'],
                    ['state', state],
                    ['response_type', 'code'],
                    ['redirect_uri', callbackUrl]
                ])}`;
            },
            /^$/,
            async () => ({data: {access_token: ''}}),
            {
                pollInterval: 10000,
                timeout: 600
            }
        );
    }, []);

    if (!callbackURL) {
        return <LoadingSpinner />
    };

    return (
        <>
            <CopyToClipboardInput value={callbackURL || ''} />
            <Description>The callback URL will be required during Wrike setup</Description>
        </>
    );
};

export default AdminCallbackPage;