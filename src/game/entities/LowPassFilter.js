import { FPS, OMEGA_NOM } from 'game/constants/game.js';
import { Entity } from 'engine/Entity.js';

export class LowPassFilter extends Entity {

	constructor(omega_filt, s_rated, init_x) {
		let position = { x: 0, y: 0 };
		super(position);
		this.states = { filter: init_x };
		this.omega_filt = omega_filt;
		this.s_rated = s_rated;
	}

	updateStates(time, filterInput) {
		let x_dot = this.omega_filt * (filterInput - this.states.filter);
		this.states.filter += x_dot * time.secondsPassed;
	}

	update(time, filterInput) {
		this.updateStates(time, filterInput);
	}
}
