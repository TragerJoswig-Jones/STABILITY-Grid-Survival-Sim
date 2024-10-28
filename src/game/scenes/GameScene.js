import { Scene } from 'engine/Scene.js';
import { playSound } from 'engine/soundHandler.js';
import { BAR_HEIGHT_SCALE, BAR_WIDTH_SCALE, FREQ_NOM, OMEGA_NOM, SCREEN_HEIGHT, SCREEN_WIDTH, S_BASE } from 'game/constants/game.js';
import { Plot } from 'game/entities/Plot.js';
import { LowPassFilter } from 'game/entities/LowPassFilter.js';
import { PowerBar } from 'game/entities/PowerBar.js';
import { SwingDynamics } from 'game/entities/SwingDynamics.js';
import { PIDControl } from 'game/entities/PIDControl.js';
import { Storage } from 'game/entities/Storage.js';
import { isKeyPressed, isKeyDown, whereClickLocation, getTouches } from 'engine/inputHandler.js';
import { Control } from 'game/constants/controls.js';

export class GameScene extends Scene {
  music = document.getElementById('bgm');
  button = document.getElementById("powerButton");
  lightness = 22;

  constructor() {
    super();

    // Variable init
    this.mechPowerInput = 0;
    this.load = 50;
    this.score = 0;

    // Gameplay parameters
    this.load_update_time = 5;
    this.lastStepTime = document.timeline.currentTime; // TODO: Or set to 0? Unsure how to handle game resets

    this.maxLoad = 90;
    this.minLoad = 10;
    this.maxLoadStep = 30;

    this.freqBound = 3;
    this.freqLim = [FREQ_NOM - this.freqBound, FREQ_NOM + this.freqBound]
    this.omegaMin = 2 * Math.PI * this.freqLim[0];
    this.omegaMax = 2 * Math.PI * this.freqLim[1];
    this.underFreqCount = 0;
    this.overFreqCount = 0;
    this.timeLim = 10;  // frames outside of bound before game over

    this.calcLevelDuration = (level) => level * 5 + 5;
    this.level = 1;
    this.levelEndTime = this.calcLevelDuration(this.level * 2);  // Adding in bonus time for level 1
    this.playTime = 0;
    this.bonusCounter = 0;

    let genInertia = 2;  // j
    let genMaxPower = 100;  // MW

    let storCapacity = 0.1;
    let storDischargeLim = 50;
    let storChargeLim = 50;
    let storEfficiency = 0.9;
    this.storageEnabled = true;//false;

    let kp = 0;
    let ki = 0;
    let kd = 0;
    this.pidEnabled = true;//false;

    this.pvGenLimits = false;

    // Display parameters
    let plotBound = 5;
    let plotBounds = [FREQ_NOM - plotBound, FREQ_NOM + plotBound];
    let powerBarY = SCREEN_HEIGHT * (0.4);
    let plotY = SCREEN_HEIGHT * (0.15);

    // Display entities
    this.genBar = new PowerBar({ x: SCREEN_WIDTH * (0.7), y: powerBarY }, { width: SCREEN_WIDTH * BAR_WIDTH_SCALE, height: SCREEN_HEIGHT * BAR_HEIGHT_SCALE }, 'blue', true, false, 100, { name: 'Power', unit: 'MW' }, { label: "Generation", leftSide: false, fontSize: 15 });
    this.loadBar = new PowerBar({ x: SCREEN_WIDTH * (0.3) - SCREEN_WIDTH / 10, y: powerBarY }, { width: SCREEN_WIDTH * BAR_WIDTH_SCALE, height: SCREEN_HEIGHT * BAR_HEIGHT_SCALE }, 'red', true, false, 100, { name: 'Power', unit: 'MW' }, { label: "Load", leftSide: true, fontSize: 15 });
    this.plot = new Plot({ x: SCREEN_WIDTH * (0.1), y: plotY }, { width: SCREEN_WIDTH * 0.8, height: SCREEN_HEIGHT * 0.2 }, 1000, plotBounds, 'blue', FREQ_NOM, this.freqLim, "time (s)", "frequency (Hz)", 12)

    let storBarY = powerBarY + SCREEN_HEIGHT * BAR_HEIGHT_SCALE + 40;
    let storLabel = { name: 'Energy:', unit: 'kWh' };
    this.storSOCBar = new PowerBar({ x: SCREEN_WIDTH * (0.5) - 0.5 * SCREEN_WIDTH * BAR_WIDTH_SCALE, y: storBarY }, { width: SCREEN_WIDTH * BAR_WIDTH_SCALE, height: SCREEN_HEIGHT * 0.5 * BAR_HEIGHT_SCALE },
      'green', true, false, storCapacity * 1000, storLabel);

    // Display buttons
    this.buttons = new Map();
    let powerButton = { label: "Power ↑", x: SCREEN_WIDTH * (0.7), y: SCREEN_HEIGHT * (0.7), w: SCREEN_WIDTH * (0.25), h: SCREEN_HEIGHT * (0.25), r: 10, enabled: true, held: false, path: NaN };
    let storDischargeButton = { label: "Discharge", x: SCREEN_WIDTH * (0.05), y: SCREEN_HEIGHT * (0.7), w: SCREEN_WIDTH * (0.25), h: SCREEN_HEIGHT * (0.1), r: 10, enabled: this.storageEnabled, held: false, path: NaN };
    let storChargeButton = { label: "Charge", x: SCREEN_WIDTH * (0.05), y: SCREEN_HEIGHT * (0.85), w: SCREEN_WIDTH * (0.25), h: SCREEN_HEIGHT * (0.1), r: 10, enabled: this.storageEnabled, held: false, path: NaN };

    this.buttons.set('power', powerButton);
    this.buttons.set('charge', storChargeButton);
    this.buttons.set('discharge', storDischargeButton)

    let pidPanel = { x: SCREEN_WIDTH * (0.5) - SCREEN_WIDTH * (0.25) / 2, y: powerBarY, w: SCREEN_WIDTH * (0.25), h: SCREEN_HEIGHT * BAR_HEIGHT_SCALE }
    let kpPlusPIDButton = { label: "+", x: pidPanel.x + pidPanel.w * 1 / 3, y: pidPanel.y, w: pidPanel.w / 4, h: pidPanel.h * 1 / 6, r: 10, enabled: this.pidEnabled, held: false, path: NaN };
    let kpMinusPIDButton = { label: "-", x: pidPanel.x + pidPanel.w * 2 / 3, y: pidPanel.y, w: pidPanel.w / 4, h: pidPanel.h * 1 / 6, r: 10, enabled: this.pidEnabled, held: false, path: NaN };
    let kiPlusPIDButton = { label: "+", x: pidPanel.x + pidPanel.w * 1 / 3, y: pidPanel.y + pidPanel.h * 3 / 8, w: pidPanel.w / 4, h: pidPanel.h * 1 / 6, r: 10, enabled: this.pidEnabled, held: false, path: NaN };
    let kiMinusPIDButton = { label: "-", x: pidPanel.x + pidPanel.w * 2 / 3, y: pidPanel.y + pidPanel.h * 3 / 8, w: pidPanel.w / 4, h: pidPanel.h * 1 / 6, r: 10, enabled: this.pidEnabled, held: false, path: NaN };
    let kdPlusPIDButton = { label: "+", x: pidPanel.x + pidPanel.w * 1 / 3, y: pidPanel.y + pidPanel.h * 6 / 8, w: pidPanel.w / 4, h: pidPanel.h * 1 / 6, r: 10, enabled: this.pidEnabled, held: false, path: NaN };
    let kdMinusPIDButton = { label: "-", x: pidPanel.x + pidPanel.w * 2 / 3, y: pidPanel.y + pidPanel.h * 6 / 8, w: pidPanel.w / 4, h: pidPanel.h * 1 / 6, r: 10, enabled: this.pidEnabled, held: false, path: NaN };

    this.buttons.set('kpp', kpPlusPIDButton);
    this.buttons.set('kpm', kpMinusPIDButton);
    this.buttons.set('kip', kiPlusPIDButton);
    this.buttons.set('kim', kiMinusPIDButton);
    this.buttons.set('kdp', kdPlusPIDButton);
    this.buttons.set('kdm', kdMinusPIDButton);

    // this.b1Held = false;
    // this.b2Held = false;
    // this.b3Held = false;

    // Dynamics entities
    this.systemSwing = new SwingDynamics(genInertia, genMaxPower);
    this.genMech = new LowPassFilter(0.5, 100, this.load);
    this.maxPower = this.genMech.s_rated  // The maximum available mechanical power

    this.storage = new Storage(storCapacity, storDischargeLim, storChargeLim, storEfficiency)

    this.pidController = new PIDControl(0, 0, 0)
    this.pidController.set_point = OMEGA_NOM

    this.pidController.kp = kp;
    this.pidController.ki = ki;
    this.pidController.kd = kd;

    playSound(this.music, { volume: 0.1, loop: true });
  }

  handleBorderFlash = () => {
    this.lightness = 100;
  };

  drawButton(context, button) {
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillStyle = 'white';

    if (button.held) {
      context.strokeStyle = 'blue';
    } else {
      context.strokeStyle = `hsl(134 90% ${this.lightness}%)`;
    }
    let b = new Path2D();
    //b.rect(button.x, button.y, button.w, button.h)
    b.roundRect(button.x, button.y, button.w, button.h, button.r)
    b.closePath()
    context.stroke(b);
    context.font = 'normal 10px Nunito Sans';
    context.fillText(button.label, button.x + Math.floor(button.w / 2), button.y + Math.floor(button.h / 2));
    return b
  }


  drawButtons(context) {
    context.lineWidth = 4;
    context.strokeStyle = `hsl(134 90% ${this.lightness}%)`;

    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillStyle = 'white';

    for (const key of this.buttons.keys()) {
      if (this.buttons.get(key).enabled) {
        this.buttons.get(key).path = this.drawButton(context, this.buttons.get(key));
      }
    }
    context.strokeStyle = `hsl(134 90% ${this.lightness}%)`;  // reset stroke color
  }

  drawBorder(context) {
    context.lineWidth = 4;
    context.strokeStyle = `hsl(134 90% ${this.lightness}%)`;
    this.border = new Path2D();
    this.border.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    this.border.closePath()
    // context.beginPath();
    // context.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    context.stroke(this.border);
  }

  drawMessage(context) {
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillStyle = 'white';

    context.font = 'normal 30px Nunito Sans';
    context.fillText('STABILITY', SCREEN_WIDTH / 2, -15 + SCREEN_HEIGHT / 10);

    context.textAlign = 'left';
    context.font = 'normal 20px Nunito Sans';
    context.fillText('Score: ' + this.score.toFixed(2) + ' MWh', SCREEN_WIDTH * 1 / 10, 15 + SCREEN_HEIGHT / 10);

    context.textAlign = 'right';
    context.font = 'normal 15px Nunito Sans';
    context.fillText('Level: ' + this.level.toFixed(0), SCREEN_WIDTH * 9 / 10, 17 + SCREEN_HEIGHT / 10);

    //TODO: add display for CO2 emissions in Mt (Megatonnes) This will be an end game goal to make this zero?
  }

  checkGameOver() {
    if (this.underFreqCount > this.timeLim) {
      //alert("Under frequency limit exceeded!") // And set game loss trigger to True
      return true;
    } else if (this.overFreqCount > this.timeLim) {
      //alert("Over frequency limit exceeded!")
      return true;
    } else {
      return false;
    }
  }

  update(time, context, camera) {

    //Todo: Split this up into different functions of the Game Scene and rename the game scheme.

    camera.update(time);
    if (time.secondsPassed > 0.1) {
      time.secondsPassed = 0.1;
    }

    /* Score update */
    this.score += time.secondsPassed / (60 * 60) * this.genMech.states.filter; //Update this to be energy transfered? and add a current power transfering display

    /* Level progression bonus */
    let freqError = Math.abs(this.systemSwing.states.omega - OMEGA_NOM) / (2 * Math.PI)
    if (freqError < this.freqBound * 0.1) {
      this.bonusCounter += time.secondsPassed;
    } else if (this.bonusCounter > 0) {
      this.bonusCounter -= 2 * time.secondsPassed;
    }

    let bonusMultiplier = 1;
    if (this.bonusCounter > 1) {
      bonusMultiplier = 3;
    }
    let bonusTime = time.secondsPassed * bonusMultiplier;

    /* Difficulty progression */
    this.playTime += time.secondsPassed + bonusTime;
    if (this.playTime > this.levelEndTime) {
      this.level += 1;
      this.levelEndTime += this.calcLevelDuration(this.level);

      if (this.level == 2) {  // Turns off high-inertia/slow-mode at level 2
        this.systemSwing.updateH(1)
      } else if (this.level > 2 && this.systemSwing.j > 0.5) {  // Decreases inertia each level until j = 0.5
        this.systemSwing.updateH(this.systemSwing.j -= 0.05)  // Decreases to 0.5 in 10 levels
      }

      if (this.level > 3 && this.maxLoadStep < 50) {
        this.maxLoadStep += 10;
      }

      if (this.level == 5) {  // Unlocks storage at level 5
        this.storageEnabled = true;
      }

      if (this.level == 10) {  // Unlocks pid control at level 10
        this.pidEnabled = true;
      }

      if (this.level == 7) {
        this.pvGenLimits = true;
        this.genBar.lim_display = true;
      }

      if (this.level == 12) {  // Increase power levels to give higher rewards for harder levels
        this.genMech.s_rated += 100;
        this.loadBar.value += 100;
        this.genBar.value += 100;
      }
    }

    /* Game loss counter */
    if (this.systemSwing.states.omega < this.omegaMin) {
      this.underFreqCount += 1;
    } else if (this.systemSwing.states.omega > this.omegaMax) {
      this.overFreqCount += 1;
    } else {
      this.overFreqCount = 0;
      this.overFreqCount = 0;
    }

    /* Load steps / disturbances */
    if ((time.previous - this.lastStepTime) / 1000 > this.load_update_time) {
      let loadStep = 2 * this.maxLoadStep * (Math.random() - 0.5);
      // if (this.loadStep > this.maxLoadStep) {
      //   this.loadStep = this.maxLoadStep;
      // } else if (this.loadStep < -this.maxLoadStep) {
      //   this.loadStep = -this.maxLoadStep;
      // }
      this.load += loadStep;
      if (this.load > this.maxLoad) {
        //this.load = this.maxLoad;
        //this.load -= 1 * loadStep;
        this.load = (this.maxLoad - this.minLoad) / 2;
      } else if (this.load < this.minLoad) {
        //this.load = this.minLoad
        //this.load -= 1 * loadStep;
        this.load = (this.maxLoad - this.minLoad) / 2;
      }
      this.lastStepTime = time.previous;

      if (this.pvGenLimits) {  //TODO: Make limits not impossible to achieve is terms of energy storage. Make it so that the energy defecit over some time interval is less than the available storage capacity * difficult_scaling_factor [0,1].
        this.maxPower = this.genMech.s_rated * (1 - 0.5 * Math.random());
      }
    }
    this.loadBar.update(this.load / S_BASE);
    this.genMech.max_input = this.maxPower;

    let touches = [...getTouches()];  // Shallow copy of the array so that we can append a click location

    let clickLocation = whereClickLocation();
    if (!(isNaN(clickLocation.x) && isNaN(clickLocation.y))) {
      touches.push({ identifier: -1, pageX: clickLocation.x, pageY: clickLocation.y });  // Add the click event to the list of ongoing touches  TODO: Make the game check if the device is touch capable first?
    }

    if (touches.length > 0) {
      // const rect = context.canvas.getBoundingClientRect()
      // let canvasXY = { x: clickLocation.x - rect.top, y: clickLocation.y - rect.left };
      // let xy_left = (context.canvas.clientLeft + context.canvas.offsetLeft);
      // let xy_top = (context.canvas.clientTop + context.canvas.offsetTop);
      /* https://stackoverflow.com/questions/9880279/how-do-i-add-a-simple-onclick-event-handler-to-a-canvas-element
      This should work but the location of the offsets are incorrect */

      // Manually determining screen position of the game view port
      let screenWidth = context.canvas.clientWidth;  // dimensions of the window view
      let screenHeight = context.canvas.clientHeight;
      let widthRatio = screenWidth / context.canvas.width;  // determining how the viewport is scaled within the window
      let heightRatio = screenHeight / context.canvas.height;
      let canvasWidth = 0;
      let canvasHeight = 0;
      if (heightRatio < widthRatio) {  // getting the actual height and width of the viewport
        canvasWidth = context.canvas.width * heightRatio;
        canvasHeight = screenHeight
      } else {
        canvasHeight = context.canvas.height * widthRatio;
        canvasWidth = screenWidth
      }

      let widthScale = context.canvas.width / canvasWidth;
      let heightScale = context.canvas.height / canvasHeight;

      let x_left = Math.floor((screenWidth - canvasWidth) / 2);
      let y_top = Math.floor((screenHeight - canvasHeight) / 2);

      for (const key of this.buttons.keys()) this.buttons.get(key).held = false;

      for (let i = 0; i < touches.length; i++) {
        let x = Math.floor((touches[i].pageX - x_left) * widthScale);
        let y = Math.floor((touches[i].pageY - y_top) * heightScale);

        try {  //TODO: Make this use a for loop over a list of buttons
          for (const key of this.buttons.keys()) {
            let button = this.buttons.get(key);
            if (button.enabled) {
              button.held = (button.held || context.isPointInPath(button.path, x, y));
            }
          }
        } catch (TypeError) {  // Error when button is held down and game resets until new click
          for (const key of this.buttons.keys()) this.buttons.get(key).held = false;
        }
      }
    } else {
      for (const key of this.buttons.keys()) this.buttons.get(key).held = false;
    }

    if (isKeyDown("Space")) {  // TODO: Add a mapping from keys to buttons in the button fields?
      this.buttons.get('power').held = true;
    }
    if (isKeyDown("ArrowDown")) {  // Charging
      this.buttons.get('charge').held = true;
    } else if (isKeyDown("ArrowUp")) {  // Discharging
      this.buttons.get('discharge').held = true;
    }

    if (this.buttons.get('power').held) {  // TODO: Make this inherent to the button object or add a mapping object to make it more clear
      this.mechPowerInput = this.maxPower;
    } else {
      this.mechPowerInput = 0;
    }

    if (this.buttons.get('kpp').held) {
      this.pidController.kp += 1;
    } else if (this.buttons.get('kpm').held) {
      this.pidController.kp -= 1;
    }
    this.pidController.update(time, this.systemSwing.states.omega);
    let mechPowerCtrl = this.pidController.control();
    this.genMech.update(time, this.mechPowerInput + mechPowerCtrl);  //TODO: Add in hard limits on the power from genMech in case I switch this to not be a lowpass filter in the future or add in temporary power output limits.

    // if (isKeyDown("Space")) {
    //   this.mechPowerInput = this.maxPower;
    // } else {
    //   this.mechPowerInput = 0;
    // }

    let storagePower = 0;
    if (this.storageEnabled) {
      let storageDispatch = 0;
      if (this.buttons.get('charge').held) {
        storageDispatch = -this.storage.chargeRate;
      } else if (this.buttons.get('discharge').held) {
        storageDispatch = this.storage.dischargeRate;
      }

      storagePower = this.storage.control(time, storageDispatch)
      let storageSOC = this.storage.states.soc;
      this.storSOCBar.update(storageSOC / this.storage.maxSOC);
    }

    this.genBar.max_percent = this.maxPower / this.genMech.s_rated;
    this.genBar.update(this.genMech.states.filter / S_BASE);
    let genPower = this.genMech.states.filter

    let net_power = genPower - this.load + storagePower;
    this.systemSwing.update(time, net_power);

    this.plot.update(this.systemSwing.states.omega / (2 * Math.PI))

    if (this.lightness > 22) this.lightness -= 200 * time.secondsPassed;
  }

  draw(context) {
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    this.genBar.draw(context);
    this.loadBar.draw(context);
    if (this.storageEnabled) {
      this.storSOCBar.draw(context);
    }
    this.plot.draw(context);
    this.drawBorder(context);
    this.drawMessage(context);
    this.drawButtons(context);
  }
}
