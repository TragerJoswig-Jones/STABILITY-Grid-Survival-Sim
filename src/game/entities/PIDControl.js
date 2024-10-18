import { FPS, OMEGA_NOM } from 'game/constants/game.js';
import { Entity } from 'engine/Entity.js';

export class PIDControl extends Entity {

	constructor(kp, ki, kd) {
		let position = { x: 0, y: 0 };  //TODO: remove extends Entity for elements that do not use a position
		super(position);
		this.states = { integral: 0, derivative: 0 };
		this.set_point = 0;
		this.prev_input = 0;  // TODO: add a more sophisticated initialization so this is not large
		this.kp = kp;
		this.ki = ki;
		this.kd = kd;
	}

	updateStates(time, input) {
		let x_dot = (input - this.set_point);
		this.states.integral += x_dot * time.secondsPassed;
		if (time.secondsPassed > 0) {
			this.states.derivative = (input - this.prev_input) / time.secondsPassed;
		}
	}

	control() {
		let err = this.prev_input - this.set_point;
		let ctrl = -(this.kp * err + this.ki * this.states.integral + this.kd * this.states.derivative);
		return ctrl
	}

	update(time, input) {
		this.updateStates(time, input);
		this.prev_input = input;
	}
}
