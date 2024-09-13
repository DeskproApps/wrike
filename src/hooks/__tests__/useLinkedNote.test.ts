import { cleanup, renderHook, act } from "@testing-library/react";
import { mockTicketContext } from "@deskpro/app-testing-utils";
import { createNote } from "@/services/wrike";
import { mockTask } from "@/testing";
import {
  useLinkedNote,
  getLinkedMessage,
  getUnlinkedMessage,
} from "../useLinkedNote";
import { setCurrentContext } from "../../../jest.setup";
import type { TicketContext } from "@/types";
import type { Result } from "../useLinkedNote";

const mockContext = mockTicketContext as TicketContext;

jest.mock("@/services/wrike/api");

const renderUseLinkedNote = () => renderHook<Result, unknown>(() => useLinkedNote());

describe("hooks", () => {
  describe("useLinkedNote", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("should generate link message", () => {
      expect(getLinkedMessage("137", "https://some.link")).toEqual(
        "Linked to Deskpro ticket 137, <a href=\"https://some.link\">https://some.link</a>"
      );
    });

    test("should generate link message without permalink", () => {
      expect(getLinkedMessage("137")).toEqual("Linked to Deskpro ticket 137");
    });

    test("should generate unlink message", () => {
      expect(getUnlinkedMessage("137", "https://some.link")).toEqual(
        "Unlinked from Deskpro ticket 137, <a href=\"https://some.link\">https://some.link</a>"
      );
    });

    test("should generate unlink message without permalink", () => {
      expect(getUnlinkedMessage("137")).toEqual(
        "Unlinked from Deskpro ticket 137"
      );
    });

    test("should to called the service to create an automatic note (link task)", async () => {
      setCurrentContext({
        ...mockContext,
        settings: { add_comment_when_linking: true },
      });
      (createNote as jest.Mock).mockResolvedValueOnce(() => Promise.resolve());

      const { result } = renderUseLinkedNote();

      await act(async () => {
        await result.current.addLinkNote(mockTask.data[0] as never);
      });

      expect(createNote).toHaveBeenCalled();
    });

    test("should to called the service to create an automatic comment (unlink issue)", async () => {
      setCurrentContext({
        ...mockContext,
        settings: { add_comment_when_linking: true },
      });
      (createNote as jest.Mock).mockResolvedValueOnce(() => Promise.resolve());

      const { result } = renderUseLinkedNote();

      await act(async () => {
        await result.current.addUnlinkNote(mockTask.data[0] as never);
      });

      expect(createNote).toHaveBeenCalled();
    });

    test("shouldn't to called the service to create an automatic note (link task)", async () => {
      setCurrentContext({
        ...mockContext,
        settings: { add_comment_when_linking: false },
      });
      (createNote as jest.Mock).mockResolvedValueOnce(() => Promise.resolve());

      const { result } = renderUseLinkedNote();

      await act(async () => {
        await result.current.addLinkNote(mockTask.data[0] as never);
      });

      expect(createNote).not.toHaveBeenCalled();
    });

    test("shouldn't to called the service to create an automatic comment (unlink issue)", async () => {
      setCurrentContext({
        ...mockContext,
        settings: { add_comment_when_linking: false },
      });
      (createNote as jest.Mock).mockResolvedValueOnce(() => Promise.resolve());

      const { result } = renderUseLinkedNote();

      await act(async () => {
        await result.current.addUnlinkNote(mockTask.data[0] as never);
      });

      expect(createNote).not.toHaveBeenCalled();
    });
  });
});
