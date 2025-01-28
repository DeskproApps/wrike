import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stack } from "@deskpro/deskpro-ui";
import { createNote } from "@/services/wrike";
import { useSetTitle, useRegisterElements } from "@/hooks";
import { Input, Label, Button, Container, ErrorBlock } from "@/components/common";
import { Settings } from "@/types";

const CreateNotePage = () => {
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext<unknown, Settings>();
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
      .then(() => navigate(`/tasks/${taskId}`))
      .finally(() => setSubmitting(false));
  }, [client, context?.settings, navigate, taskId, note]);

  const onCancel = useCallback(() => {
    navigate(`/tasks/${taskId}`);
  }, [navigate, taskId]);

  useSetTitle("Create Update");

  useRegisterElements(({ registerElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  }, []);

  return (
    <Container>
      {error && <ErrorBlock texts={[error]} />}

      <Label label="New update" required>
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Label>

      <Stack justify="space-between">
        <Button
          text="Create"
          onClick={onCreate}
          loading={submitting}
          disabled={submitting}
        />
        <Button type="button" text="Cancel" intent="tertiary" onClick={onCancel}/>
      </Stack>
    </Container>
  );
};

export { CreateNotePage };
