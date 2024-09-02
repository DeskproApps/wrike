import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputWithTitle } from "@/components/InputWithTitle/InputWithTitle";
import { Button, P8, Stack } from "@deskpro/deskpro-ui";
import { createNote } from "@/services/wrike";
import { Container } from "@/components/common";

export const CreateNote = () => {
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();
  const navigate = useNavigate();
  const { taskId } = useParams();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const onCreate = useCallback(() => {
    if (!client || !context?.settings || !taskId) {
      return;
    }

    setSubmitting(true);
    setError(null);

    if (note.length === 0) {
      setSubmitting(false);
      setError("Note cannot be empty");
      return;
    }

    return createNote(client, taskId, note, context.settings)
      .then(() => navigate(-1))
      .finally(() => setSubmitting(false));
  }, [client, context?.settings, navigate, taskId, note]);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Create Update");

    client.deregisterElement("edit");
  });

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "home":
          navigate("/redirect");
      }
    },
  });

  return (
    <Container>
      <Stack style={{ width: "100%" }} vertical gap={8}>
        <InputWithTitle
          title="New update"
          setValue={(e) => setNote(e.target.value)}
          data-testid="note-input"
          value={note}
          required={true}
        />
        <Stack justify="space-between" style={{ width: "100%" }}>
          <Button
            data-testid="button-submit"
            onClick={onCreate}
            loading={submitting}
            text={"Create"}
            disabled={submitting}
            />
          <Button onClick={() => navigate(-1)} text="Cancel" intent="secondary" />
        </Stack>
        {error && <P8 color="red">{error}</P8>}
      </Stack>
    </Container>
  );
};
