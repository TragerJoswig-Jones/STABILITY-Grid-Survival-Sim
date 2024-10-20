import { Entity } from 'engine/Entity.js';

export class Storage extends Entity {

	constructor(capacity = 100, chargeRate = 10, dischargeRate = 10, efficiency = 1) {
		let position = { x: 0, y: 0 };  //TODO: remove extends Entity for elements that do not use a position
		super(position);
		this.states = { soc: 0 };
		this.maxSOC = capacity;
		this.minSOC = 0;  // TODO: add a more sophisticated initialization so this is not large
		this.chargeRate = chargeRate;
		this.dischargeRate = dischargeRate;
		this.efficiency = efficiency;
	}

	updateStates(time, input) {
		this.states.soc += input * time.secondsPassed;
	}

	control(time, input) {
		let power = 0;
		if (input > this.dischargeRate) {
			power = this.dischargeRate;
		} else if (input < -this.chargeRate) {
			power = -this.chargeRate;
		} else {
			power = input
		}
		let energy = power * time.secondsPassed / 3600;
		if ((this.states.soc - energy) > this.maxSOC) {
			power = (this.states.soc - this.maxSOC) / time.secondsPassed;
		} else if ((this.states.soc - energy) < this.minSOC) {
			power = (this.states.soc - this.minSOC) / time.secondsPassed;
		}
		energy = power * time.secondsPassed / 3600;
		this.states.soc -= energy * this.efficiency;
		return power
	}

	update(time, input) {  //TODO: Better integrate control and updateStates functions
		this.updateStates(time, input);
	}
}
