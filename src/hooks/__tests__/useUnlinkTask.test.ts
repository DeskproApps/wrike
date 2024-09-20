import { cleanup, renderHook, act } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { deleteEntityService } from "@/services/deskpro";
import { useUnlinkTask } from "../useUnlinkTask";
import { mockTask } from "@/testing";
import type { Result } from "../useUnlinkTask";
import type { TaskType } from "@/types";

const renderUseUnlinkTask = () =>
  renderHook<Result, unknown>(() => useUnlinkTask());

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("@/services/deskpro/deleteEntityService");

describe("hooks", () => {
  describe("useUnlinkDevice", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("shouldn't navigate to home page if unlink task failed", async () => {
      const mockNavigate = jest.fn();
      (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
      (deleteEntityService as jest.Mock).mockRejectedValue("");

      const { result } = renderUseUnlinkTask();

      try {
        await act(async () => {
          await result.current.unlink(mockTask.data[0] as unknown as TaskType);
        })
      } catch (e) {
        expect(deleteEntityService).toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
      }
    });

    test("should unlink device and navigate to home page", async () => {
      const mockNavigate = jest.fn();
      (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
      (deleteEntityService as jest.Mock).mockResolvedValueOnce("");

      const { result } = renderUseUnlinkTask();

      await act(async () => {
        await result.current.unlink(mockTask.data[0] as unknown as TaskType);
      })

      expect(deleteEntityService).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });

    test("shouldn't unlink if no pass task", async () => {
      const mockNavigate = jest.fn();
      (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
      (deleteEntityService as jest.Mock).mockResolvedValueOnce("");

      const { result } = renderUseUnlinkTask();

      await act(async () => {
        await result.current.unlink(null as unknown as TaskType);
      })

      expect(deleteEntityService).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalledWith("/home");
    });
  });
});
