import { Intl } from "../src/intl";

describe("i18n", () => {
  const ZH = {
    a: "A",
    b: {
      c: "C",
      d: "{{id}}d",
    },
  };

  const EN: typeof ZH = {
    a: "AA",
    b: {
      c: "CC",
      d: "{{id}}DD",
    },
  };

  it("base", () => {
    const i18n = new Intl<typeof ZH>("zh");
    i18n.load("zh", ZH);
    expect(i18n.t("a")).toBe("A");
    expect(i18n.t("b.c")).toBe("C");
  });

  it("format", () => {
    const i18n = new Intl<typeof ZH>("zh");
    i18n.load("zh", ZH);
    expect(i18n.t("b.d")).toBe("{{id}}d");
    expect(i18n.t("b.d", { id: "d" })).toBe("dd");
  });

  it("not found", () => {
    const i18n = new Intl<typeof ZH>("en");
    i18n.load("en", {} as typeof ZH);
    expect(i18n.t("b.d")).toBe("b.d");
  });

  it("switch language", () => {
    const i18n = new Intl<typeof ZH>("zh");
    i18n.load("zh", ZH);
    expect(i18n.t("a")).toBe("A");
    i18n.setLanguage("en");
    i18n.load("en", EN);
    expect(i18n.t("a")).toBe("AA");
  });

  it("override", () => {
    const i18n = new Intl<typeof ZH>("zh");
    i18n.load("zh", ZH);
    i18n.override({ "b.c": "CCC" });
    expect(i18n.t("a")).toBe("A");
    expect(i18n.t("b.c")).toBe("CCC");
  });

  it("locale", () => {
    const i18n = new Intl<typeof ZH>("zh");
    i18n.load("zh", ZH);
    expect(i18n.locale!.a).toBe("A");
    expect(i18n.locale!.b.c).toBe("C");
  });

  it("cache", () => {
    const i18n = new Intl<typeof ZH>("zh");
    i18n.load("zh", ZH);
    expect(i18n.t("a")).toBe("A");
    const origin = ZH.a;
    ZH.a = "AA";
    expect(i18n.t("a")).toBe("A");
    expect(i18n.locale!.a).toBe("AA");
    ZH.a = origin;
  });

  it("seal", () => {
    const i18n = new Intl<typeof ZH>("zh");
    i18n.load("zh", ZH);
    const target = {
      a: i18n.t("a"),
      b: i18n.seal("b.d", { id: "1" }, "default"),
    };
    expect(target.a).toBe("A");
    expect(String(target.b)).toBe("1d");
    expect(target.b).toEqual({ k: "b.d", v: { id: "1" }, d: "default" });
  });

  it("proxy", () => {
    const i18n = new Intl<typeof ZH>("zh");
    i18n.load("zh", ZH);
    i18n.load("en", EN);
    const target = i18n.proxy({
      a: i18n.t("a"),
      b: i18n.seal("b.d", { id: "1" }, "default"),
    });
    expect(target.a).toBe("A");
    expect(target.b).toBe("1d");
    i18n.setLanguage("en");
    expect(target.a).toBe("A");
    expect(target.b).toBe("1DD");
  });
});
