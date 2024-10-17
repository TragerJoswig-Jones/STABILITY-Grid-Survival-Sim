import { FPS, OMEGA_NOM, S_BASE } from 'game/constants/game.js';
import { Entity } from 'engine/Entity.js';

export class SwingDynamics extends Entity {

	constructor(j, s_rated) {
		let position = { x: 0, y: 0 };
		super(position);
		this.states = { theta: 0, omega: OMEGA_NOM };
		this.j = j;
		this.s_rated = s_rated;
		this.h = this.j * OMEGA_NOM * OMEGA_NOM / (2 * this.s_rated);
	}

	updateStates(time, power) {
		let theta_dot = this.states.omega;
		let omega_dot = 1 / (2 * this.h / OMEGA_NOM) * power;
		this.states.theta += theta_dot * time.secondsPassed;
		if (this.states.theta > 2 * Math.PI) {
			this.states.theta -= 2 * Math.PI * Math.floor(this.states.theta / (2 * Math.PI));
		}
		this.states.omega += omega_dot * time.secondsPassed;
		if (this.states.omega < 0) {
			this.states.omega = 0;
		}
	}

	update(time, power) {
		this.updateStates(time, power);
	}
}
