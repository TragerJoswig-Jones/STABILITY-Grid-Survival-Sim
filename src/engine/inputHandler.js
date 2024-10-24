import { GamepadThumbstick } from './constants/control.js';
import { Control } from 'game/constants/controls.js';
import { controls } from 'game/config/controls.js';
import { getContext } from './context.js';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'game/constants/game.js';


// const context = getContext('body', SCREEN_WIDTH, SCREEN_HEIGHT);
//const canvas = document.getElementById("canvas"); //Todo: Make this use getContext(selector, width, height)?

const heldKeys = new Set();
const pressedKeys = new Set();

const gamePads = new Map();
const pressedButtons = new Set();

const clickLocation = { x: NaN, y: NaN };

const ongoingTouches = [];

const mappedKeys = controls
	.map(({ keyboard }) => Object.values(keyboard))
	.flat();

function handleKeyDown(event) {
	if (!mappedKeys.includes(event.code)) return;

	event.preventDefault();
	heldKeys.add(event.code);
}

function handleKeyUp(event) {
	if (!mappedKeys.includes(event.code)) return;

	event.preventDefault();
	heldKeys.delete(event.code);
	pressedKeys.delete(event.code);
}

function handleGamepadConnected(event) {
	const { gamepad: { index, axes, buttons } } = event;

	gamePads.set(index, { axes, buttons });
}

function handleGamepadDisconnected(event) {
	const { gamepad: { index } } = event;

	gamePads.delete(index);
}

function getXY(event) { //adjust mouse click to canvas coordinates
	//const rect = context.canvas.getBoundingClientRect()
	const y = event.clientY //- rect.top
	const x = event.clientX //- rect.left
	return { x: x, y: y }
}

function handleClick(event) {
	event.preventDefault();
	const XY = getXY(event);
	//clickLocation.set('x', XY.x).set('x', XY.y)
	clickLocation.x = XY.x;
	clickLocation.y = XY.y;
}

function handleUnclick(event) {
	event.preventDefault();
	clickLocation.x = NaN;
	clickLocation.y = NaN;
}

//TODO: Add event handlers for mobile phone browsers
// https://stackoverflow.com/questions/26961140/on-click-event-for-mobile
function copyTouch({ identifier, pageX, pageY }) {
	return { identifier, pageX, pageY };
}

function ongoingTouchIndexById(idToFind) {
	for (let i = 0; i < ongoingTouches.length; i++) {
		const id = ongoingTouches[i].identifier;

		if (id === idToFind) {
			return i;
		}
	}
	return -1; // not found
}

function handleStart(event) {
	event.preventDefault();
	const touches = event.changedTouches;

	for (let i = 0; i < touches.length; i++) {
		ongoingTouches.push(copyTouch(touches[i]));
	}
}

function handleEnd(event) {
	event.preventDefault();
	const touches = event.changedTouches;

	for (let i = 0; i < touches.length; i++) {
		let idx = ongoingTouchIndexById(touches[i].identifier);
		ongoingTouches.splice(idx, 1); // remove it; we're done
	}
}

function handleMove(event) {
	event.preventDefault();
	const touches = event.changedTouches;

	for (let i = 0; i < touches.length; i++) {
		const idx = ongoingTouchIndexById(touches[i].identifier);
		ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
	}
}

function handleCancel(event) {
	event.preventDefault();
	const touches = event.changedTouches;

	for (let i = 0; i < touches.length; i++) {
		let idx = ongoingTouchIndexById(touches[i].identifier);
		ongoingTouches.splice(idx, 1); // remove it; we're done
	}
}


// Control event handlers

export function registerKeyEvents() {
	window.addEventListener('keydown', handleKeyDown);
	window.addEventListener('keyup', handleKeyUp);
}

export function registerTouchEvents() {
	window.addEventListener('touchstart', handleStart)
	window.addEventListener('touchend', handleEnd)
	window.addEventListener("touchcancel", handleCancel);
	window.addEventListener("touchmove", handleMove);
}

export function registerGamepadEvents() {
	window.addEventListener('gamepadconnected', handleGamepadConnected);
	window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);
}

export function registerClickEvents() {
	window.addEventListener('mousedown', handleClick);
	window.addEventListener('mouseup', handleUnclick);
}

export function resetOngoingTouches() {
	ongoingTouches.splice(0, ongoingTouches.length)
}

export function resetClickLocation() {
	clickLocation.x = NaN; // Reset click location in case it is held from a previous game
	clickLocation.y = NaN;
}

export function pollGamepads() {
	for (const gamePad of navigator.getGamepads()) {
		if (!gamePad) continue;

		if (gamePads.has(gamePad.index)) {
			const { index, axes, buttons } = gamePad;

			gamePads.set(index, { axes, buttons });

			for (const button in buttons) {
				const key = `${gamePad.index}-${button}`;

				if (pressedButtons.has(key) && !isButtonDown(gamePad.index, Number(button))) {
					pressedButtons.delete(key);
				}
			}
		}
	}
}

// Control helpers

export const isKeyDown = (code) => heldKeys.has(code);

export function isKeyPressed(code) {
	if (heldKeys.has(code) && !pressedKeys.has(code)) {
		pressedKeys.add(code);
		return true;
	}

	return false;
}

export const isButtonDown = (padId, button) =>
	gamePads.get(padId)?.buttons[button].pressed ?? false;

export function isButtonPressed(padId, button) {
	const key = `${padId}-${button}`;

	if (isButtonDown(padId, button) && !pressedButtons.has(key)) {
		pressedButtons.add(key);
		return true;
	}

	return false;
}

export const isAxeGreater = (padId, axe, value) =>
	gamePads.get(padId)?.axes[axe] >= value;

export const isAxeLower = (padId, axe, value) =>
	gamePads.get(padId)?.axes[axe] <= value;

export const isControlDown = (id, control) =>
	isKeyDown(controls[id].keyboard[control]) || isButtonDown(id, controls[id].gamePad[control]);

export const isControlPressed = (id, control) =>
	isKeyPressed(controls[id].keyboard[control]) || isButtonPressed(id, controls[id].gamePad[control]);

export const isLeft = (id) => isControlDown(id, Control.LEFT)
	|| isAxeLower(id,
		controls[id].gamePad[GamepadThumbstick.HORIZONTAL_AXE_ID],
		-controls[id].gamePad[GamepadThumbstick.DEAD_ZONE],
	);

export const isRight = (id) => isControlDown(id, Control.RIGHT)
	|| isAxeGreater(id,
		controls[id].gamePad[GamepadThumbstick.HORIZONTAL_AXE_ID],
		controls[id].gamePad[GamepadThumbstick.DEAD_ZONE],
	);

export const isUp = (id) => isControlDown(id, Control.UP)
	|| isAxeLower(id,
		controls[id].gamePad[GamepadThumbstick.VERTICAL_AXE_ID],
		-controls[id].gamePad[GamepadThumbstick.DEAD_ZONE],
	);

export const isDown = (id) => isControlDown(id, Control.DOWN)
	|| isAxeGreater(id,
		controls[id].gamePad[GamepadThumbstick.VERTICAL_AXE_ID],
		controls[id].gamePad[GamepadThumbstick.DEAD_ZONE],
	);

export const isIdle = (id) => !(isLeft(id) || isRight(id) || isUp(id) || isDown(id));

export const whereClickLocation = () => clickLocation;

export const getTouches = () => ongoingTouches;
