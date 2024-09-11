import { getFullName } from "../getFullName";
import { mockContacts } from "@/testing";
import type { IUser } from "@/services/wrike/types";

const mockUser = mockContacts.data["1"];

describe("utils", () => {
  describe("getFullName", () => {
    test("should return full name", () => {
      expect(getFullName(mockUser as IUser)).toBe("Pylyp Orlyk");

      expect(getFullName({ firstName: mockUser.firstName } as IUser)).toBe("Pylyp");
      expect(getFullName({ lastName: mockUser.lastName } as IUser)).toBe("Orlyk");
      expect(getFullName({ primaryEmail: mockUser.primaryEmail } as IUser)).toBe("pylyp.orlyk@zaporizhian.org");
      expect(getFullName({ profiles: mockUser.profiles } as IUser)).toBe("contact@zaporizhianhost.ua");
    });
  });
});
