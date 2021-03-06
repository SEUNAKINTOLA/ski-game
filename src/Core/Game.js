import * as Constants from "../Constants";
import { AssetManager } from "./AssetManager";
import { Canvas } from './Canvas';
import { Skier } from "../Entities/Skier";
import { Rhino } from "../Entities/Rhino";
import { ObstacleManager } from "../Entities/Obstacles/ObstacleManager";
import { Rect } from './Utils';

export class Game {
    gameWindow = null;
    gameOnPause = false;

    constructor() {
        this.assetManager = new AssetManager();
        this.canvas = new Canvas(Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
        this.skier = new Skier(0, 0);
        this.rhino = new Rhino(0, 0);
        this.obstacleManager = new ObstacleManager();

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    reset() {       
        this.obstacleManager = new ObstacleManager();
        this.skier = new Skier(0, 0);
        this.rhino = new Rhino(0, 0);
    }

    init() {
        this.obstacleManager.placeInitialObstacles();
    }

    async load() {
        await this.assetManager.loadAssets(Constants.ASSETS);
    }

    run() {
        this.canvas.clearCanvas();

        this.updateGameWindow();
        this.drawGameWindow();

        requestAnimationFrame(this.run.bind(this));
    }

    updateGameWindow() {
        if(this.gameOnPause) return;
       this.skier.move();
       this.moveRhino();
        const previousGameWindow = this.gameWindow;
        this.calculateGameWindow();

        this.obstacleManager.placeNewObstacle(this.gameWindow, previousGameWindow);

        this.skier.checkIfSkierHitObstacle(this.obstacleManager, this.assetManager);
        this.rhino.checkIfRhinoCatchSkier(this.skier, this.assetManager);
    }

    moveRhino(){
        if(this.skier.y > Constants.RHINO_START_CHASE_DISTANCE  && !this.rhino.moving ){
            this.rhino.x= this.skier.x;
            this.rhino.y = this.skier.y - Constants.RHINO_SKIER_STARTING_GAP;
            this.rhino.move();
            }else if(this.rhino.moving ){
                this.rhino.move();
            }
    }

    drawGameWindow() {
        this.canvas.setDrawOffset(this.gameWindow.left, this.gameWindow.top);

        this.skier.draw(this.canvas, this.assetManager);
        this.rhino.draw(this.canvas, this.assetManager);        
        
        this.obstacleManager.drawObstacles(this.canvas, this.assetManager);
    }

    calculateGameWindow() {
        const skierPosition = this.skier.getPosition();
        const left = skierPosition.x - (Constants.GAME_WIDTH / 2);
        const top = skierPosition.y - (Constants.GAME_HEIGHT / 2);

        this.gameWindow = new Rect(left, top, left + Constants.GAME_WIDTH, top + Constants.GAME_HEIGHT);
    }

    handleKeyDown(event) {
        switch(event.which) {
            case Constants.KEYS.LEFT:
                this.skier.turnLeft();
                this.rhino.turnLeft();
                event.preventDefault();
                break;
            case Constants.KEYS.RIGHT:
                this.skier.turnRight();
                this.rhino.turnRight();
                event.preventDefault();
                break;
            case Constants.KEYS.UP:
                this.skier.turnUp();
                event.preventDefault();
                break;
            case Constants.KEYS.DOWN:
                this.skier.turnDown();
                this.rhino.turnDown();
                event.preventDefault();
                break;
            case Constants.KEYS.RESTART_PAUSE_PLAY:
                if(this.skier.direction === Constants.SKIER_DIRECTIONS.DISAPPEAR ){
                    this.reset();
                }else  this.gameOnPause = !this.gameOnPause;
                event.preventDefault();
                break;
        }
    }
}