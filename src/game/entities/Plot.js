import { FPS, SCREEN_HEIGHT, SCREEN_WIDTH } from 'game/constants/game.js';
import { Entity } from 'engine/Entity.js';

export class Plot extends Entity {
	image = document.querySelector('img#logo');

	constructor(position, size, buffer, yaxis, color, initValue, lims) {
		super(position);
		this.size = size;
		this.values = new Array(buffer).fill(initValue);  //TypedArray for fixed size?
		this.color = color;
		this.yaxis = yaxis;
		this.xaxis = [0, buffer];  // scaling needed
		this.ylabel = "x-axis";
		this.xlabel = "y-axis";
		this.lims = lims
	}

	updateValues(newValue) {
		this.values[0] = newValue
		this.values.push(this.values.shift())
	}

	update(newValue) {
		this.updateValues(newValue);
	}

	calculateCoord(x, y) {
		if (y > this.yaxis[1]) {
			y = this.yaxis[1]
		} else if (y < this.yaxis[0]) {
			y = this.yaxis[0]
		}

		let xCoord = this.position.x + this.size.width * (x / this.values.length);
		let yCoord = this.position.y + this.size.height - this.size.height * ((y - this.yaxis[0]) / (this.yaxis[1] - this.yaxis[0]));
		var coord = [xCoord, yCoord];
		return coord
	}

	draw(context) {
		context.beginPath();
		context.rect(this.position.x, this.position.y, this.size.width, this.size.height);
		context.stroke();

		context.beginPath();
		context.strokeStyle = 'grey';
		context.lineWidth = 1;
		let startCoord = this.calculateCoord(this.xaxis[0], 0.5 * (this.yaxis[1] + this.yaxis[0]))
		let endCoord = this.calculateCoord(this.xaxis[1], 0.5 * (this.yaxis[1] + this.yaxis[0]))
		context.moveTo(startCoord[0], startCoord[1]);
		context.lineTo(endCoord[0], endCoord[1]);
		context.stroke();

		for (let i = 0; i < this.lims.length; i++) {
			context.beginPath();
			context.strokeStyle = 'red';
			let startCoord = this.calculateCoord(this.xaxis[0], this.lims[i])
			let endCoord = this.calculateCoord(this.xaxis[1], this.lims[i])
			context.moveTo(startCoord[0], startCoord[1]);
			context.lineTo(endCoord[0], endCoord[1]);
			context.stroke();
		}

		context.lineWidth = 5

		for (let i = 0; i < this.values.length - 1; i++) {
			let startVal = this.values[i];
			let endVal = this.values[i + 1];
			let startCoord = this.calculateCoord(i, startVal);
			let endCoord = this.calculateCoord(i + 1, endVal);
			context.beginPath();
			context.strokeStyle = this.color;
			context.moveTo(startCoord[0], startCoord[1]);
			context.lineTo(endCoord[0], endCoord[1]);
			context.stroke();
		}
	}
}
