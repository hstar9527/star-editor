import { Schedule } from "../src/schedule";

describe("scheduler", () => {
  const timeout = (ms: number) => new Promise<number>(r => setTimeout(r, ms, ms));

  it("task", async () => {
    const schedule = new Schedule<number>(3);
    const start = Date.now();
    const task1 = schedule
      .commit(() => timeout(200))
      .then(() => {
        const diff = Date.now() - start;
        expect(diff).toBeLessThan(250);
        expect(diff).toBeGreaterThanOrEqual(200);
      });
    const task2 = schedule
      .commit(() => timeout(300))
      .then(() => {
        const diff = Date.now() - start;
        expect(diff).toBeLessThan(350);
        expect(diff).toBeGreaterThanOrEqual(300);
      });
    const task3 = schedule
      .commit(() => timeout(300))
      .then(() => {
        const diff = Date.now() - start;
        expect(diff).toBeLessThan(350);
        expect(diff).toBeGreaterThanOrEqual(300);
      });
    const task4 = schedule
      .commit(() => timeout(100))
      .then(() => {
        const diff = Date.now() - start;
        expect(diff).toBeLessThan(350);
        expect(diff).toBeGreaterThanOrEqual(300);
      });
    const task5 = schedule
      .commit(() => timeout(100))
      .then(res => {
        expect(res).toBe(100);
        const diff = Date.now() - start;
        expect(diff).toBeLessThan(450);
        expect(diff).toBeGreaterThanOrEqual(400);
      });
    await Promise.all([task1, task2, task3, task4, task5]);
  });
});
