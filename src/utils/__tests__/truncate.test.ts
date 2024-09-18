import { truncate } from "../truncate";

describe("utils", () => {
  describe("truncate", () => {
    test("should truncates the string uses the default options", () => {
      expect(truncate("Testing truncate")).toBe("Testing tr...");
    });

    test("should truncates the string and adds an ellipsis by default if its length exceeds the specified length", () => {
      expect(truncate("Hello, World!", { length: 5 })).toBe("Hello...");
      expect(truncate("JavaScript testing", { length: 10 })).toBe("JavaScript...");
    });

    test("should returns the full string if its length is less than or equal to the specified length", () => {
      expect(truncate("Hello", { length: 10 })).toBe("Hello");
      expect(truncate("Test", { length: 4 })).toBe("Test");
    });

    test("should returns an empty string if the string is empty", () => {
      expect(truncate("", { length: 5 })).toBe("");
    });

    test("shoudl adds a custom ending if provided in the options", () => {
      expect(truncate("Hello, World!", { length: 5, ending: "!!" })).toBe("Hello!!");
      expect(truncate("JavaScript testing", { length: 10, ending: " [more]" })).toBe("JavaScript [more]");
    });
  });
});
