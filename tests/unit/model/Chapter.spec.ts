import { Entry, updateValue } from "@/models/Chapter";

describe("Entry", () => {
  it("does not fail if variables are not set", () => {
    /* Given */
    const update = { name: "NAME", value: "Albert", previousValue: "" };
    const entry = { values: {} } as Entry;

    /* When */
    updateValue(entry, update);

    /* Then */
    expect(entry.values).toEqual({});
  });

  it("does not update the value as the variable is not used", () => {
    /* Given */
    const update = { name: "NAME", value: "Albert", previousValue: "" };
    const entry = { variables: ["USERNAME"], values: {} } as Entry;

    /* When */
    updateValue(entry, update);

    /* Then */
    expect(entry.values).toEqual({});
  });

  it("set the new variable value", () => {
    /* Given */
    const update = { name: "NAME", value: "Albert", previousValue: "" };
    const entry = { variables: ["NAME"], values: {} } as Entry;

    /* When */
    updateValue(entry, update);

    /* Then */
    expect(entry.values).toEqual({ NAME: "Albert" });
  });

  it("does not fail if values are not set", () => {
    /* Given */
    const update = { name: "NAME", value: "Albert", previousValue: "" };
    const entry = { variables: ["NAME"] } as Entry;

    /* When */
    updateValue(entry, update);

    /* Then */
    expect(entry.values).toEqual({ NAME: "Albert" });
  });
});