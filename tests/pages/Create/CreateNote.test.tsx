import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, fireEvent, render, waitFor, act } from "@testing-library/react/";
import { createNote, getWorkflows } from "../../../src/services/wrike";
import React from "react";
import { CreateNote } from "../../../src/pages/Create/Note";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <CreateNote />
    </ThemeProvider>
  );
};

const mockWorkflows = {
  data: [
    {
      id: "1",
      name: "Test Workflow",
      customStatuses: [
        {
          id: "1",
          name: "Test Status",
        },
      ],
    },
  ],
};

jest.mock("../../../src/services/wrike");

describe("Create Note", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("Creating a note should work correctly", async () => {
    (createNote as jest.Mock).mockResolvedValueOnce(true);
    (getWorkflows as jest.Mock).mockResolvedValueOnce(mockWorkflows);
    const { getByTestId } = renderPage();

    await act(() => {
      fireEvent.change(getByTestId("note-input"), {
        target: { value: "A note" },
      });

      fireEvent.click(getByTestId("button-submit"));
    });

    await waitFor(() => {
      expect(createNote).toHaveBeenCalledTimes(1);
    });
  });

  test("Creating a note with no content should fail", async () => {
    (createNote as jest.Mock).mockResolvedValueOnce(true);
    (getWorkflows as jest.Mock).mockResolvedValueOnce(mockWorkflows);
    const { getByTestId } = renderPage();

    fireEvent.click(getByTestId("button-submit"));

    await waitFor(() => {
      expect(createNote).toHaveBeenCalledTimes(0);
    });
  });
});
