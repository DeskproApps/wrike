import { enhanceNote } from "../enhanceNote";
import { mockComments, mockContacts } from "@/testing";
import type { IUser } from "@/services/wrike/types";

const mockNote = mockComments.data[0];

describe("utils", () => {
  describe("enhanceNote", () => {
    test("should return enhanced note", () => {
      expect(enhanceNote(mockNote, mockContacts.data as IUser[]))
        .toStrictEqual({
          ...mockNote,
          author: mockContacts.data[1],
        });
    });
  });
});
