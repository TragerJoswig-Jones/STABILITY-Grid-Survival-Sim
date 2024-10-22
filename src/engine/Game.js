import { pollGamepads, registerGamepadEvents, registerKeyEvents, registerClickEvents } from './inputHandler.js';
import { getContext } from './context.js';
import { Camera } from './Camera.js';
import { GameScene } from 'game/scenes/GameScene.js';

/**
 * Game time object to hold previous frames time information.
 * @typedef {Object} GameTime
 * @property {number} previous holds the previous game time.
 * @property {number} secondsPassed holds the the amount of seconds passed between this frame and the last.
 */

/**
 * Base game class that sets up and configures "all the things" for your game project
 * @abstract
 */
export class Game {
	scene;
	camera = new Camera(0, 0);

	/**
	 * @type {GameTime}
	 */
	frameTime = {
		previous: 0,
		secondsPassed: 0,
		startTime: 0
	};

	/**
	 *
	 * @param {string} selector the parent element the canvas will be a child of
	 * @param {number} width desired width of the canvas
	 * @param {number} height desired height of the canvas
	 */
	constructor(selector, width, height) {
		this.context = getContext(selector, width, height);
		this.camera.setDimensions(width, height);
	}

	/**
	 * The main loop (used for each "frame" of your game)
	 * @param {DOMHighResTimeStamp} time
	 */
	frame = (time) => {
		if (!this.scene.checkGameOver()) {
			window.requestAnimationFrame(this.frame);
		} else {
			alert("GAME OVER \n score: " + this.scene.score.toFixed(2) + ' MWh')
			this.resetGame()
			this.start()
		}

		this.frameTime.secondsPassed = (time - this.frameTime.previous) / 1000;
		this.frameTime.previous = time;

		pollGamepads();
		this.scene.update(this.frameTime, this.context, this.camera);
		this.scene.draw(this.context, this.camera);
	};

	resetGame() {
		this.frameTime = {
			previous: document.timeline.currentTime,
			secondsPassed: 0,
			startTime: document.timeline.currentTime
		};
		this.scene = new GameScene(this.frameTime, this.camera)
	}

	start() {
		registerKeyEvents();
		registerGamepadEvents();
		registerClickEvents();

		alert("Use the space bar to increase power output. Click to start!")
		window.requestAnimationFrame(this.frame);
	}
}
