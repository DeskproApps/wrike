import { formatDateSince } from "../../utils/dateUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Avatar, H1, H2, Stack } from "@deskpro/deskpro-ui";
import styled from "styled-components";
import type { INote } from "@/services/wrike/types";
import {
  HorizontalDivider,
  useQueryWithClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { getUsersByIds } from "@/services/wrike";
import { useMemo } from "react";
import { mutateDangerouslySetHTML } from "@/utils/utils";
import { dpNormalize } from "@/styles";

type Props = {
  notes: INote[];
  id: string;
};

const HTMLDiv = styled.div`
  & > p {
    margin: 0;
  }
  max-width: 100%;

  ${dpNormalize}
`;

export const Notes = ({ notes, id }: Props) => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();

  const userIdsStr = useMemo(
    () => notes.map((e) => e.authorId).reduce((a, c) => a + c, ""),
    [notes]
  );

  const usersQuery = useQueryWithClient(
    ["users", userIdsStr],
    (client) => getUsersByIds(client, notes.map((e) => e.authorId), context?.settings),
    { enabled: Boolean(context?.settings) },
  );

  const users = usersQuery.data?.data;

  return (
    <Stack vertical gap={10} style={{ width: "100%" }}>
      <HorizontalDivider />
      <Stack gap={5}>
        <H1>Updates ({notes.length})</H1>
        <FontAwesomeIcon
          icon={faPlus}
          size="sm"
          style={{
            alignSelf: "center",
            cursor: "pointer",
            marginBottom: "2px",
          }}
          onClick={() => navigate(`/create/note/${id}`)}
        ></FontAwesomeIcon>
      </Stack>
      {notes.map((note, i) => {
        const user = users?.find((e) => e.id === note.authorId);

        return (
          <Stack key={i} vertical gap={5} style={{ width: "100%" }}>
            <Stack
              style={{ alignItems: "flex-start", marginTop: "5px" }}
              gap={5}
            >
              <Stack
                vertical
                gap={3}
                style={{
                  marginLeft: "5px",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Avatar
                  size={22}
                  imageUrl={user?.avatarUrl}
                  name={`${user?.firstName} ${user?.lastName}`}
                ></Avatar>
                <H2 style={{ width: "5ch" }}>
                  {formatDateSince(new Date(note.createdDate)).slice(0, 8)}
                </H2>
              </Stack>
              <Stack>
                <HTMLDiv
                  style={{
                    fontSize: "12px",
                    maxWidth: "100%",
                    wordBreak: "break-word",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: mutateDangerouslySetHTML(note.text),
                  }}
                />
              </Stack>
            </Stack>
            <HorizontalDivider />
          </Stack>
        );
      })}
    </Stack>
  );
};
