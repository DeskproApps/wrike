import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { Main } from "../../src/pages/Main";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Main />
    </ThemeProvider>
  );
};

jest.mock("../../src/api/api", () => {
  return {
    getTasksByIds: () => ({
      data: [
        {
          id: "1",
          status: "Active",
          customStatusId: "1",
          importance: "High",
          dates: {
            due: "2021-09-30T00:00:00Z",
          },
          linked_tickets: 1,
        },
      ],
    }),
    getWorkflows: () => ({
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
    }),
  };
});

describe("Main", () => {
  test("Main page should show all data correctly", async () => {
    const { getByText } = renderPage();

    const status = await waitFor(() => getByText(/Test Status/i));

    const importance = await waitFor(() => getByText(/High/i));

    await waitFor(() => {
      [status, importance].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
