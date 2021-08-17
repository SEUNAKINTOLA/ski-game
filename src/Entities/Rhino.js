import * as Constants from "../Constants";
import { Skier } from "./Skier";
import { intersectTwoRects, Rect } from "../Core/Utils";

export class Rhino extends Skier {
    assetName = Constants.RHINO_DEFAULT;
    moving = false;
    direction = Constants.RHINO_DIRECTIONS.DOWN;

    constructor(x, y ) {
        super(x, y);
    }

   async updateAsset() {
        if(this.direction === Constants.RHINO_DIRECTIONS.CRASH){
            for (const [assetId, assetName] of Object.entries(Constants.RHINO_CATCH_SKIER_ASSET)) {
                this.assetName =   assetName;            
                await this.timer(300);
            }
        }
        else this.assetName = Constants.RHINO_DIRECTION_ASSET[this.direction];
    }

    move() {
        this.moving = true;
        super.move();
    }

    reAllignRhinoToSkierLane(skier){
        if(skier.direction === Constants.RHINO_DIRECTIONS.DOWN)  this.setDirection(Constants.RHINO_DIRECTIONS.DOWN);
        if(this.y > skier.y ){
            this.y = skier.y -100;
            this.x = skier.x;
        } 
    }

    async checkIfRhinoCatchSkier(skier, assetManager) {
        this.reAllignRhinoToSkierLane(skier);
        const asset = assetManager.getAsset(this.assetName);
        const rhinoBounds = new Rect(
            this.x - asset.width / 2,
            this.y - asset.height / 2,
            this.x + asset.width / 2,
            this.y - asset.height / 4
        );

        const skierAssetName = skier.assetName;
        const skierAsset = assetManager.getAsset(skierAssetName);
        const skierBounds = new Rect(
            skier.x - skierAsset.width / 2,
            skier.y - skierAsset.height / 2,
            skier.x + skierAsset.width / 2,
            skier.y
        );

        const collision  = intersectTwoRects(rhinoBounds, skierBounds );
        if(collision   &&  this.direction !== Constants.RHINO_DIRECTIONS.CRASH) {
            skier.gameOver();
            this.setDirection(Constants.RHINO_DIRECTIONS.CRASH);
        }
    };
}