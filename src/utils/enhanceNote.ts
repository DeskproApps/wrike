import type { NoteType } from "@/types";
import type { INote, IUser } from "@/services/wrike/types";

const enhanceNote = (note: INote, users: IUser[]): NoteType => {
  return {
    ...note,
    author: users.find((u) => u.id === note.authorId),
  };
};

export { enhanceNote };
