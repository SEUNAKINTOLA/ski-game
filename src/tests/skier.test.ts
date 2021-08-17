import "babel-polyfill";
import { Skier } from "../Entities/Skier";
import * as Constants from "../Constants";


describe('Testing Skier', () => {
  test('test move Skier in unknown direction', () => {
    const skier = new Skier(0, 0);
    const invalidDirection = -1;
    const currentSkierDirection = skier.direction;
    skier.setDirection(invalidDirection)
    expect(skier.direction).toBe(currentSkierDirection);
  });
  test('test move Skier to left after crash', () => {
    const skier = new Skier(0, 0);
    skier.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT);
  });
});
