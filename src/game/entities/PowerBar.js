import { FPS, SCREEN_HEIGHT, SCREEN_WIDTH } from 'game/constants/game.js';
import { Entity } from 'engine/Entity.js';

export class PowerBar extends Entity {
	image = document.querySelector('img#logo');

	constructor(position, size, color) {
		super(position);
		this.size = size;
		this.percent = 0;
		this.color = color;
	}

	updatePercent(newPercent) {
		if (newPercent > 1) {
			newPercent = 1;
		}
		if (newPercent < 0) {
			newPercent = 0;
		}
		this.percent = newPercent;
	}

	update(newPercent) {
		this.updatePercent(newPercent);
	}

	draw(context) {
		context.beginPath();
		context.rect(this.position.x, this.position.y, this.size.width, this.size.height);
		context.fillStyle = this.color;
		context.fillRect(this.position.x, this.position.y + (this.size.height * (1 - this.percent)), this.size.width, this.size.height * this.percent);
		context.stroke();
	}
}
