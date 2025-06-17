import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { AnyIcon, Button, H1, H2, Stack } from "@deskpro/deskpro-ui";
import { parseJsonErrorMessage } from "@/utils";
import { Container } from "@/components/common";

interface ErrorFallbackProps {
  error: unknown;
  componentStack: string;
  eventId: string;
  resetError(): void;
}

export function ErrorFallback(props: Readonly<ErrorFallbackProps>) {
  const { error, resetError } = props
  return (
    <Container>
      <Stack vertical gap={10} role="alert">
        <H1>Something went wrong:</H1>
        {/* This needs to be updated in the future as regular errors will cause this to crash. */}
        <H2>{error instanceof Error ? parseJsonErrorMessage(error.message) : "An unknown error occurred"}</H2>
        <Button
          text="Reload"
          onClick={resetError}
          icon={faRefresh as AnyIcon}
          intent="secondary"
        />
      </Stack>
    </Container>
  )
}
