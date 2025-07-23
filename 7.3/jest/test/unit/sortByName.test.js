const sorting = require("../../app");

describe("Books names test suit", () => {
  it("Books names should be sorted in ascending order", () => {
    expect(
      sorting.sortByName([
        "Гарри Поттер",
        "Властелин Колец",
        "Волшебник изумрудного города",
      ]),
    ).toEqual([
      "Властелин Колец",
      "Волшебник изумрудного города",
      "Гарри Поттер",
    ]);
  });
  it("Should handle equal names (return 0 branch)", () => {
    expect(sorting.sortByName(["abc", "abc", "abc"])).toEqual([
      "abc",
      "abc",
      "abc",
    ]);
  });
});