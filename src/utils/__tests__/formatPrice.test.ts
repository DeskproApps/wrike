import { formatPrice } from "../formatPrice";

describe("utils", () => {
  describe("formatPrice", () => {
    test("should return formatted price", () => {
      expect(formatPrice(0, {currency: "UAH"})).toBe("₴0.00");
      expect(formatPrice(10, {currency: "GBP"})).toBe("£10.00");
    });

    test("should return formatted without currency code", () => {
      expect(formatPrice(23.5, {style: "decimal"})).toBe("23.50");
      expect(formatPrice(0, { style: "decimal", currency: "GBP" })).toBe("0.00");
    });
  });
});
