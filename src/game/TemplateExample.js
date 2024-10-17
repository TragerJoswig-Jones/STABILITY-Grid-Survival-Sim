import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'game/constants/game.js';
import { GameScene } from 'game/scenes/GameScene.js';
//import { TestScene } from 'game/scenes/TestScene.js';
import { Game } from 'engine/Game.js';

export class TemplateExample extends Game {
	scene = new GameScene(this.frameTime, this.camera);

	constructor() {
		super('body', SCREEN_WIDTH, SCREEN_HEIGHT);
	}

	render() { // Render a single frame before starting the game
		this.scene.update(this.frameTime, this.context, this.camera);
		this.scene.draw(this.context, this.camera);
	}
}
