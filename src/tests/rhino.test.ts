import "babel-polyfill";
import { Rhino } from "../Entities/Rhino";
import { Skier } from "../Entities/Skier";
import * as Constants from "../Constants";


describe('Testing Rhino', () => {
  test('test re-allign rhino to skier lane', () => {
    const skier = new Skier(5, 0);
    const rhino = new Rhino(0, 100);
    rhino.reAllignRhinoToSkierLane(skier);
    expect(rhino.x).toBe(skier.x);
  });
});
