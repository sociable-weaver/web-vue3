import {
  createSaveEntry,
  doAllVariablesHaveValues,
  Entry,
  getPart,
  interpolate,
  join,
  SaveEntry,
  setPart,
  setValue,
} from "@/models/Chapter";

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
      /* TODO: How can I inline this? */
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

  describe("createSaveEntry()", () => {
    it("returns an empty entry", () => {
      /* Given */
      const entry = {} as Entry;

      /* When */
      const result = createSaveEntry(entry);

      /* Then */
      const expected = {
        parameters: [],
        variables: [],
        environmentVariables: [],
        values: {},
      };
      expect(result).toEqual(expected);
    });

    it("copies all values", () => {
      /* Given */
      const entry = {
        type: "test-type",
        id: "86e03298-367e-48f9-afa8-2d90438f4d2b",
        name: "copy all values",
        workingDirectory: "working-directory",
        parameters: ["param-1", "param-2"],
        variables: ["var-1", "var-2"],
        environmentVariables: ["env-1", "env-2"],
        values: {},
        ignoreErrors: true,
        pushChanges: true,
        dryRun: true,
        sensitive: true,
        expectedExitValue: 1,
        commandTimeout: 600,
      } as Entry;
      /* TODO: How can I inline these? */
      entry.values["NAME"] = "Albert";
      entry.values["SURNAME"] = "Attard";

      /* When */
      const result = createSaveEntry(entry);

      /* Then */
      const expected = {
        type: "test-type",
        id: "86e03298-367e-48f9-afa8-2d90438f4d2b",
        name: "copy all values",
        workingDirectory: "working-directory",
        parameters: ["param-1", "param-2"],
        variables: ["var-1", "var-2"],
        environmentVariables: ["env-1", "env-2"],
        values: {},
        ignoreErrors: true,
        pushChanges: true,
        dryRun: true,
        sensitive: true,
        expectedExitValue: 1,
        commandTimeout: 600,
      } as SaveEntry;
      /* TODO: How can I inline these? */
      expected.values["NAME"] = "Albert";
      expected.values["SURNAME"] = "Attard";
      expect(result).toEqual(expected);
    });
  });

  describe("join()", () => {
    it("returns an empty string when given a null array", () => {
      /* Given */
      const entry = {} as Entry;

      /* When */
      const result = join(entry.parameters);

      /* Then */
      expect(result).toEqual("");
    });

    it("returns the default value when given a null array", () => {
      /* Given */
      const entry = {} as Entry;

      /* When */
      const result = join(entry.parameters, () => "Default value");

      /* Then */
      expect(result).toEqual("Default value");
    });
  });
});

describe("Variables interpolation", () => {
  it("interpolates single variable", () => {
    /* Given */
    const variables = ["NAME"];
    const values = { NAME: "Albert" };
    const text = "My name is ${NAME}";

    /* When */
    const result = interpolate(variables, values, text);

    /* Then */
    expect(result).toEqual("My name is Albert");
  });

  it("interpolates multiple instances of the same variable", () => {
    /* Given */
    const variables = ["NAME"];
    const values = { NAME: "Moto" };
    const text = "My name is ${NAME} ${NAME}";

    /* When */
    const result = interpolate(variables, values, text);

    /* Then */
    expect(result).toEqual("My name is Moto Moto");
  });

  it("interpolates multiple variables", () => {
    /* Given */
    const variables = ["NAME", "SURNAME"];
    const values = { NAME: "Albert", SURNAME: "Attard" };
    const text = "My name is ${NAME} ${SURNAME}";

    /* When */
    const result = interpolate(variables, values, text);

    /* Then */
    expect(result).toEqual("My name is Albert Attard");
  });
});

describe("Multipart Parameters", () => {
  it("returns empty array if name is not found", () => {
    /* Given */
    const parameters: string[] = [];
    const name = "SOMETHING";

    /* When */
    const result = getPart(name, parameters);

    /* Then */
    expect(result).toEqual([]);
  });

  it("returns the part with the given name", () => {
    /* Given */
    const name = "SOMETHING";
    const parameters = ["OTHER-1:1", "x", `${name}:2`, "A", "B", "OTHER-2:1", "y"];

    /* When */
    const result = getPart(name, parameters);

    /* Then */
    expect(result).toEqual(["A", "B"]);
  });

  it("adds a new part if one with the same name does not exists", () => {
    /* Given */
    const name = "SOMETHING";
    const parameters = ["OTHER:1", "x"];

    /* When */
    setPart(name, ["A", "B"], parameters);

    /* Then */
    expect(parameters).toEqual(["OTHER:1", "x", `${name}:2`, "A", "B"]);
  });

  it("updates a part with the new shorter values", () => {
    /* Given */
    const name = "SOMETHING";
    const parameters = ["OTHER:1", "x", `${name}:5`, "a", "b", "c", "d", "e"];

    /* When */
    setPart(name, ["A", "B"], parameters);

    /* Then */
    expect(parameters).toEqual(["OTHER:1", "x", `${name}:2`, "A", "B"]);
  });

  it("updates a part with the new longer values", () => {
    /* Given */
    const name = "SOMETHING";
    const parameters = ["OTHER:1", "x", `${name}:1`, "a"];

    /* When */
    setPart(name, ["A", "B"], parameters);

    /* Then */
    expect(parameters).toEqual(["OTHER:1", "x", `${name}:2`, "A", "B"]);
  });
});
