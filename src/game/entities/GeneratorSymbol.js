import { FPS, SCREEN_HEIGHT, SCREEN_WIDTH } from 'game/constants/game.js';
import { Entity } from 'engine/Entity.js';

export class GenSymbol extends Entity {
	statorImage = document.querySelector('img#stator');
	rotorImage = document.querySelector('img#rotor');

	constructor(position, scale) {
		super(position);
		this.height = 100; //TODO: Determine how to get the image source size
		this.width = 100;
		this.scale = scale;
		this.theta = 0;
	}

	update(theta) {
		this.theta = theta;
	}

	draw(context) {

		context.drawImage(this.statorImage, Math.floor(this.position.x), this.position.y, this.width * this.scale, this.height * this.scale);


		context.save();
		context.translate(this.position.x + this.width * this.scale / 2, this.position.y + this.height * this.scale / 2);
		context.rotate(this.theta);

		context.drawImage(this.rotorImage, -this.width * this.scale / 2, -this.height * this.scale / 2, this.width * this.scale, this.height * this.scale);
		context.restore();


	}
}
