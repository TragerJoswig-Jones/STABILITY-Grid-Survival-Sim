import { FPS, SCREEN_HEIGHT, SCREEN_WIDTH } from 'game/constants/game.js';
import { Entity } from 'engine/Entity.js';

export class PowerBar extends Entity {
	image = document.querySelector('img#logo');

	constructor(position, size, color, num_display, lim_display, value) {
		super(position);
		this.size = size;
		this.percent = 0;
		this.color = color;
		this.num_display = num_display;
		this.lim_display = lim_display;
		this.font_size = 10
		this.value = value
		this.max_percent = 1.0
		this.bar_height = 2
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
		if (this.num_display) {
			// Current power display
			context.font = 'normal ' + this.font_size.toString() + 'px Nunito Sans';
			context.fillText('Power: ' + (this.percent * this.value).toFixed(0) + ' MW', this.position.x + this.size.width / 2, this.position.y + this.size.height + this.font_size * 1.2);
		}
		if (this.lim_display) {
			// Power bar limit
			context.fillStyle = 'grey';
			context.fillRect(this.position.x, this.position.y + (this.size.height * (1 - this.max_percent)) + this.bar_height, this.size.width, this.bar_height);

			context.font = 'normal ' + this.font_size.toString() + 'px Nunito Sans';
			context.fillText('Limit: ' + (this.max_percent * this.value).toFixed(0) + ' MW', this.position.x + this.size.width / 2, this.position.y - this.font_size * 1.2);
		}
	}
}
