import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { ViewTask } from "../../../src/pages/View/Task";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <ViewTask />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/api", () => {
  return {
    getTaskById: () => ({
      data: [
        {
          id: "1",
          status: "Active",
          description: "Test Description",
          importance: "High",
          customStatusId: "1",
          scope: "Test Scope",
          title: "Test Task",
          dates: {
            start: "2021-09-30T00:00:00Z",
            due: "2021-09-30T00:00:00Z",
          },
          linked_tickets: 1,
          customFields: [
            {
              id: "1",
              value: "Test Value",
            },
          ],
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
    getUsersByIds: () => ({
      data: [{ firstName: "David", lastName: "Something", id: 1 }],
    }),
    getCustomFields: () => ({
      data: [
        {
          id: "1",
          title: "Test Custom Field",
          type: "Text",
          settings: {},
        },
      ],
    }),
    getNotesByTaskId: () => ({
      data: [],
    }),
  };
});

describe("View", () => {
  test("View page should show a contact correctly", async () => {
    const { getByText } = renderPage();

    const title = await waitFor(() => getByText(/Test Task/i));

    const importance = await waitFor(() => getByText(/High/i));

    const status = await waitFor(() => getByText(/Test Status/i));

    await waitFor(() => {
      [title, importance, status].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
