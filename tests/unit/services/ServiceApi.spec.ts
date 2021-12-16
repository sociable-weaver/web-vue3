import { formatError } from "@/services/ServiceApi";

describe("Service API", () => {
  describe("formatError()", () => {
    it("returns unknown error when the error is undefined", () => {
      /* Given */
      const e = undefined;

      /* When */
      const message = formatError(e);

      /* Then */
      expect(message).toEqual("Unknown error");
    });

    it("returns unknown error when the error is null", () => {
      /* Given */
      const e = null;

      /* When */
      const message = formatError(e);

      /* Then */
      expect(message).toEqual("Unknown error");
    });

    it("returns the error message found in the exception", () => {
      /* Given */
      const e = { message: "Testing error formatting" };

      /* When */
      const message = formatError(e);

      /* Then */
      expect(message).toEqual("Testing error formatting");
    });

    it("returns the error message found in the payload", () => {
      /* Given */
      const e = { response: { data: { message: "Testing error formatting" } } };

      /* When */
      const message = formatError(e);

      /* Then */
      expect(message).toEqual("Testing error formatting");
    });
  });
});
