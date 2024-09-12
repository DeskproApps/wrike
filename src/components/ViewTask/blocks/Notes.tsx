import { Title } from "@deskpro/app-sdk";
import { getFullName } from "@/utils";
import { Comment } from "@/components/common";
import type { FC } from "react";
import type { NoteType } from "@/types";

type Props = {
  notes: NoteType[];
  onNavigateToAddNote: () => void;
};

const Notes: FC<Props> = ({ notes, onNavigateToAddNote }) => {
  return (
    <>
      <Title
        title={`Notes (${notes.length})`}
        onClick={onNavigateToAddNote}
      />
      {notes.map((note) => (
        <Comment
          key={note.id}
          name={getFullName(note.author)}
          date={new Date(note.updatedDate)}
          text={note.text}
          avatarUrl={note.author?.avatarUrl}
        />
      ))}
    </>
  );
};

export { Notes };
