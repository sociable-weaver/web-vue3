import { doAllVariablesHaveValues, Entry, setValue } from "@/models/Chapter";

describe("Entry", () => {
  describe("setValue()", () => {
    it("does not fail if variables are not set", () => {
      /* Given */
      const update = { name: "NAME", value: "Albert" };
      const entry = { values: {} } as Entry;

      /* When */
      setValue(entry, update);

      /* Then */
      expect(entry.values).toEqual({});
    });

    it("does not update the value as the variable is not used", () => {
      /* Given */
      const update = { name: "NAME", value: "Albert" };
      const entry = { variables: ["USERNAME"], values: {} } as Entry;

      /* When */
      setValue(entry, update);

      /* Then */
      expect(entry.values).toEqual({});
    });

    it("set the new variable value", () => {
      /* Given */
      const update = { name: "NAME", value: "Albert" };
      const entry = { variables: ["NAME"], values: {} } as Entry;

      /* When */
      setValue(entry, update);

      /* Then */
      expect(entry.values).toEqual({ NAME: "Albert" });
    });

    it("does not fail if values are not set", () => {
      /* Given */
      const update = { name: "NAME", value: "Albert" };
      const entry = { variables: ["NAME"] } as Entry;

      /* When */
      setValue(entry, update);

      /* Then */
      expect(entry.values).toEqual({ NAME: "Albert" });
    });
  });

  describe("doAllVariablesHaveValues()", () => {
    it("returns true if all variables have a value", () => {
      /* Given */
      const entry = { variables: ["NAME"], values: {} } as Entry;
      entry.values["NAME"] = "Albert";

      /* When */
      const result = doAllVariablesHaveValues(entry);

      /* Then */
      expect(result).toEqual(true);
    });

    it("returns false when at least one variables dose not have a value", () => {
      /* Given */
      const entry = { variables: ["NAME"], values: {} } as Entry;

      /* When */
      const result = doAllVariablesHaveValues(entry);

      /* Then */
      expect(result).toEqual(false);
    });

    it("does not fail and returns false when variables exists but values are missing", () => {
      /* Given */
      const entry = { variables: ["NAME"] } as Entry;

      /* When */
      const result = doAllVariablesHaveValues(entry);

      /* Then */
      expect(result).toEqual(false);
    });

    it("does not fail and returns true when variables do not exist", () => {
      /* Given */
      const entry = {} as Entry;

      /* When */
      const result = doAllVariablesHaveValues(entry);

      /* Then */
      expect(result).toEqual(true);
    });
  });
});
