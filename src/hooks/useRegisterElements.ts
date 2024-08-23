import { useDeskproElements } from "@deskpro/app-sdk";
import type { DependencyList } from "react";
import type { RegisterElement, DeRegisterElement } from "@deskpro/app-sdk";

type UseRegisterElements = (
  fn?: (utils: {
    registerElement: RegisterElement,
    deRegisterElement: DeRegisterElement,
  }) => void,
  deps?: DependencyList,
) => void;

const useRegisterElements: UseRegisterElements = (fn, deps) => {
  useDeskproElements(({ deRegisterElement, registerElement }) => {
    deRegisterElement("home");
    deRegisterElement("plus");
    deRegisterElement("menu");
    deRegisterElement("edit");
    deRegisterElement("refresh");

    fn && fn({ deRegisterElement, registerElement });
  }, [...(deps || [])]);
};

export { useRegisterElements };
