import * as Constants from "../Constants";
import { Entity } from "./Entity";
import { intersectTwoRects, Rect } from "../Core/Utils";

export class Skier extends Entity {
    assetName = Constants.SKIER_DOWN;
    crashed = false;
    timer = ms => new Promise(res => setTimeout(res, ms));

    direction = Constants.SKIER_DIRECTIONS.DOWN;
    speed = Constants.SKIER_STARTING_SPEED;

    constructor(x, y ) {
        super(x, y);
    }

    gameOver(){
        this.setDirection(Constants.SKIER_DIRECTIONS.DISAPPEAR);
    }

    setDirection(direction) {
        if( !this.validateDirection(direction) || this.direction ===  Constants.SKIER_DIRECTIONS.DISAPPEAR ) return;
        this.direction = direction;
        this.updateAsset();
    }

    validateDirection(direction){
        if(Object.values(Constants.SKIER_DIRECTIONS).find((obj) => obj == direction) == null){
            return false;
        }
        return true;
    }

   async updateAsset() {
        if(this.direction === Constants.SKIER_DIRECTIONS.UP){ 
            for (const [assetId, assetName] of Object.entries(Constants.SKIER_JUMP_DIRECTION_ASSET)) {
                this.assetName =   assetName;            
                await this.timer(200);
            }
        }
        else this.assetName = Constants.SKIER_DIRECTION_ASSET[this.direction];
    }

    move() {
        switch(this.direction) {
            case Constants.SKIER_DIRECTIONS.LEFT_DOWN:
                this.moveSkierLeftDown();
                break;
            case Constants.SKIER_DIRECTIONS.DOWN:
                this.moveSkierDown();
                break;
            case Constants.SKIER_DIRECTIONS.RIGHT_DOWN:
                this.moveSkierRightDown();
                break;
            case Constants.SKIER_DIRECTIONS.UP:
                this.moveSkierDown();
                break;
        }
    }

    moveSkierLeft() {
        this.x -= Constants.SKIER_STARTING_SPEED;
    }

    moveSkierLeftDown() {
        this.x -= this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveSkierDown() {
        this.y += this.speed;
    }

    moveSkierRightDown() {
        this.x += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveSkierRight() {
        this.x += Constants.SKIER_STARTING_SPEED;
    }

    moveSkierUp() {
        this.y -= Constants.SKIER_STARTING_SPEED;
    }

    turnLeft() {
        if(this.direction === Constants.SKIER_DIRECTIONS.LEFT) {
            this.moveSkierLeft();
        }
        else {
            if(this.direction === Constants.SKIER_DIRECTIONS.CRASH)   this.setDirection( Constants.SKIER_DIRECTIONS.LEFT);
            else this.setDirection(this.direction - 1); 
        }
    }

    turnRight() {
        if(this.direction === Constants.SKIER_DIRECTIONS.RIGHT) {
            this.moveSkierRight();
        }
        else {
            this.setDirection(this.direction + 1);
        }
    }

    turnUp() {
        if(this.direction === Constants.SKIER_DIRECTIONS.LEFT || this.direction === Constants.SKIER_DIRECTIONS.RIGHT) {
            this.moveSkierUp();
        }
        else {
            this.setDirection(Constants.SKIER_DIRECTIONS.UP);
            setTimeout(() => {  this.turnDown() }, 1000);

        }
    }

    turnDown() {
        this.setDirection(Constants.SKIER_DIRECTIONS.DOWN);
    }

    checkIfSkierHitObstacle(obstacleManager, assetManager) {
        const asset = assetManager.getAsset(this.assetName);
        const skierBounds = new Rect(
            this.x - asset.width / 2,
            this.y - asset.height / 2,
            this.x + asset.width / 2,
            this.y - asset.height / 4
        );

        const collision = obstacleManager.getObstacles().find((obstacle) => {
            const obstacleName=  obstacle.getAssetName(); 
            if((obstacleName == Constants.ROCK1 || obstacleName == Constants.ROCK2) && this.direction == Constants.SKIER_DIRECTIONS.UP ){
                return false;
            }
            const obstacleAsset = assetManager.getAsset(obstacle.getAssetName());
            const obstaclePosition = obstacle.getPosition();
            const obstacleBounds = new Rect(
                obstaclePosition.x - obstacleAsset.width / 2,
                obstaclePosition.y - obstacleAsset.height / 2,
                obstaclePosition.x + obstacleAsset.width / 2,
                obstaclePosition.y
            );

            return intersectTwoRects(skierBounds, obstacleBounds);
        });

        if(collision && !this.crashed) {
            this.crashed = true;
            this.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
        }else if(!collision){
            this.crashed = false;
        }
    };
}