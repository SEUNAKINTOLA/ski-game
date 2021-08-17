# Ski

Welcome to the Ski - Oluwaseun's Edition!

You can play our version here: 
https://ski.akintolaseun.com.ng/  

deploy it locally by running:
```
npm install
npm run dev
```

**UPGRADE DONE ON THIS VERSION**

* **Bug fIX:**

  * Bug caused by pressing the left arrow key after crashing into an obstacle, causing Giant blizzard and screen to turn completely white
  
* **Unit tests addeds:**

  * Tests Added:
    1. Test move Skier in unknown direction 
    2. Test move Skier to left after crash
    3. Test re-allign rhino to skier lane
  
* **Extention of existing functionality:**

  In this version, you can have the skier jump by either pressing a key or use the ramp asset to have the skier jump whenever he hits a ramp.
  * The skier jumps over some obstacles while in the air. 
    * Rocks can be jumped over
    * Trees can NOT be jumped over
   
* **New Feature:**

  * In this version, if you skied for too long, Rhino would chase you down and eat you. The Rhino appears after a set skied distance 2500 and chases the skier. If the rhino catches the skier, it's game over and the rhino eats the skier. 
  * Press the space bar to reset the game once it's over.
  * Press the space bar to pause and resume the game.

* **Code Documentation:**

  * A new class (Rhino class) was added, which extends Skier class. The Constants specific to Rhino assets were added to the Constant file and used accordingly.
  ```
  export class Rhino extends Skier 
  ```

  * As an extention of the Skier class, the Rhino, once set to move, moves in the same direction as the Skier.

  * The Rhino realligns itself to be on the same y axis as the Skier using the reAllignRhinoToSkierLane method. A future improvement to this will be to handle enough instances to make the Rhino never have cause to be forcefully realligned. 

  ```
      reAllignRhinoToSkierLane(skier){
          if(skier.direction === Constants.RHINO_DIRECTIONS.DOWN)  this.setDirection(Constants.RHINO_DIRECTIONS.DOWN);
          if(this.y > skier.y ){
              this.y = skier.y -100;
              this.x = skier.x;
          } 
      }
  ```
  * The Rhino checks continually if it has caught up with Skier using checkIfRhinoCatchSkier method, which is a clone of the checkIfSkierHitObstacle method in Skier. In this case, we use the intersectTwoRects to check if skier bound intersects the rhino's bound.

  ```
  
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
  ```

  * The Rhino class uses timer in updateAsset method to animate the eating of Skier, using the assets declared in Constants.
  ```
     async updateAsset() {
        if(this.direction === Constants.SKIER_DIRECTIONS.UP){ 
            for (const [assetId, assetName] of Object.entries(Constants.SKIER_JUMP_DIRECTION_ASSET)) {
                this.assetName =   assetName;            
                await this.timer(200);
            }
        }
        else this.assetName = Constants.SKIER_DIRECTION_ASSET[this.direction];
    }
  ```