import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LinkTasks } from "@/components";
import type { FC } from "react";

const LinkTasksPage: FC = () => {
  const navigate = useNavigate();

  const onNavigateToCreate = useCallback(() => navigate("/findOrCreate"), [navigate]);

  return (
    <LinkTasks
      onNavigateToCreate={onNavigateToCreate}
    />
  );
};

export { LinkTasksPage };
