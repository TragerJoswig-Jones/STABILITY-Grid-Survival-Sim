import { Scene } from 'engine/Scene.js';
import { playSound } from 'engine/soundHandler.js';
import { BAR_HEIGHT_SCALE, BAR_WIDTH_SCALE, FREQ_NOM, OMEGA_NOM, SCREEN_HEIGHT, SCREEN_WIDTH, S_BASE } from 'game/constants/game.js';
import { Plot } from 'game/entities/Plot.js';
import { LowPassFilter } from 'game/entities/LowPassFilter.js';
import { PowerBar } from 'game/entities/PowerBar.js';
import { SwingDynamics } from 'game/entities/SwingDynamics.js';
import { PIDControl } from 'game/entities/PIDControl.js';
import { Storage } from 'game/entities/Storage.js';
import { isKeyPressed, isKeyDown, whereClickLocation } from 'engine/inputHandler.js';
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

    this.freqBound = 3;
    this.freqLim = [FREQ_NOM - this.freqBound, FREQ_NOM + this.freqBound]
    this.omegaMin = 2 * Math.PI * this.freqLim[0];
    this.omegaMax = 2 * Math.PI * this.freqLim[1];
    this.underFreqCount = 0;
    this.overFreqCount = 0;
    this.timeLim = 10;  // frames outside of bound before game over

    this.calcLevelDuration = (level) => 10; //level * 10;
    this.level = 1;
    this.levelEndTime = this.calcLevelDuration(this.level)

    let genInertia = 2;  // j
    let genMaxPower = 100;  // MW

    let storCapacity = 0.1;
    let storDischargeLim = 50;
    let storChargeLim = 50;
    let storEfficiency = 0.9;
    this.storageEnabled = true; //false;

    let kp = 0;
    let ki = 0;
    let kd = 0;
    this.pidEnabled = false;

    this.pvGenLimits = false;

    // Display parameters
    let plotBound = 5;
    let plotBounds = [FREQ_NOM - plotBound, FREQ_NOM + plotBound];
    let powerBarY = SCREEN_HEIGHT * (0.4);
    let plotY = SCREEN_HEIGHT * (0.15);

    // Display entities
    this.genBar = new PowerBar({ x: SCREEN_WIDTH * (0.7), y: powerBarY }, { width: SCREEN_WIDTH * BAR_WIDTH_SCALE, height: SCREEN_HEIGHT * BAR_HEIGHT_SCALE }, 'blue', true, false, 100);
    this.loadBar = new PowerBar({ x: SCREEN_WIDTH * (0.3) - SCREEN_WIDTH / 10, y: powerBarY }, { width: SCREEN_WIDTH * BAR_WIDTH_SCALE, height: SCREEN_HEIGHT * BAR_HEIGHT_SCALE }, 'red', true, false, 100);
    this.plot = new Plot({ x: SCREEN_WIDTH * (0.1), y: plotY }, { width: SCREEN_WIDTH * 0.8, height: SCREEN_HEIGHT * 0.2 }, 1000, plotBounds, 'blue', FREQ_NOM, this.freqLim)

    let storBarY = powerBarY + SCREEN_HEIGHT * BAR_HEIGHT_SCALE + 40;
    let storLabel = { name: 'Energy:', unit: 'kWh' };
    this.storSOCBar = new PowerBar({ x: SCREEN_WIDTH * (0.5) - 0.5 * SCREEN_WIDTH * BAR_WIDTH_SCALE, y: storBarY }, { width: SCREEN_WIDTH * BAR_WIDTH_SCALE, height: SCREEN_HEIGHT * 0.5 * BAR_HEIGHT_SCALE },
      'green', true, false, storCapacity * 1000, storLabel);

    // Display buttons
    this.powerButton = { x: SCREEN_WIDTH * (0.8), y: SCREEN_HEIGHT * (0.8), w: 50, h: 50 };
    this.storChargeButton = { x: SCREEN_WIDTH * (0.1), y: SCREEN_HEIGHT * (0.8), w: 50, h: 25 };
    this.storDischargeButton = { x: SCREEN_WIDTH * (0.1), y: SCREEN_HEIGHT * (0.85), w: 50, h: 25 };

    this.b1Held = false;
    this.b2Held = false;
    this.b3Held = false;

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

  drawButtons(context) {
    context.lineWidth = 4;
    context.strokeStyle = `hsl(134 90% ${this.lightness}%)`;

    /* Power button */
    if (this.b1Held) {
      context.strokeStyle = 'blue';
    } else {
      context.strokeStyle = `hsl(134 90% ${this.lightness}%)`;
    }
    this.b1 = new Path2D();
    this.b1.rect(this.powerButton.x, this.powerButton.y, this.powerButton.w, this.powerButton.h)
    this.b1.closePath()
    context.stroke(this.b1);

    if (this.storageEnabled) {
      /* Charge button */
      if (this.b2Held) {
        context.strokeStyle = 'blue';
      } else {
        context.strokeStyle = `hsl(134 90% ${this.lightness}%)`;
      }
      this.b2 = new Path2D();
      this.b2.rect(this.storChargeButton.x, this.storChargeButton.y, this.storChargeButton.w, this.storChargeButton.h)
      this.b2.closePath()
      context.stroke(this.b2);

      /* Discharge button */
      if (this.b3Held) {
        context.strokeStyle = 'blue';
      } else {
        context.strokeStyle = `hsl(134 90% ${this.lightness}%)`;
      }
      this.b3 = new Path2D();
      this.b3.rect(this.storDischargeButton.x, this.storDischargeButton.y, this.storDischargeButton.w, this.storDischargeButton.h)
      this.b3.closePath()
      context.stroke(this.b3);
    }
    context.strokeStyle = `hsl(134 90% ${this.lightness}%)`;
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

    /* Difficulty progression */
    if ((time.previous - time.startTime) / 1000 > this.levelEndTime) {
      this.level += 1;
      this.levelEndTime += this.calcLevelDuration(this.level);

      if (this.level == 2) {  // Turns off high-inertia/slow-mode at level 2
        this.systemSwing.updateH(1)
      } else if (this.level > 2 && this.systemSwing.j > 0.5) {  // Decreases inertia each level until j = 0.5
        this.systemSwing.updateH(this.systemSwing.j -= 0.1)
      }

      if (this.level == 5) {  // Unlocks storage at level 5
        this.storageEnabled = true;
      }

      if (this.level == 10) {  // Unlocks storage at level 5
        this.pidEnabled = true;
      }

      if (this.level == 7) {
        this.pvGenLimits = true;
        this.genBar.lim_display = true;
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
      //let loadStep = 50 * (Math.random() - (this.load / this.maxLoad));
      let loadStep = 100 * (Math.random() - 0.5);
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

      if (this.pvGenLimits) {
        this.maxPower = this.genMech.s_rated * (1 - 0.5 * Math.random());
      }
    }
    this.loadBar.update(this.load / S_BASE);
    this.genMech.max_input = this.maxPower;

    this.pidController.update(time, this.systemSwing.states.omega);
    let mechPowerCtrl = this.pidController.control();
    this.genMech.update(time, this.mechPowerInput + mechPowerCtrl);  //TODO: Add in hard limits on the power from genMech in case I switch this to not be a lowpass filter in the future or add in temporary power output limits.

    let clickLocation = whereClickLocation();
    let canvasXY = { x: NaN, y: NaN };
    if (!(isNaN(clickLocation.x) && isNaN(clickLocation.y))) {
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
      let y_top = Math.floor((screenHeight - canvasHeight) / 2);  //TODO: FIX THE TOP NOT ALIGNING PROPERLY HERE

      canvasXY.x = Math.floor((clickLocation.x - x_left) * widthScale);
      canvasXY.y = Math.floor((clickLocation.y - y_top) * heightScale);

      try {
        this.b1Held = context.isPointInPath(this.b1, canvasXY.x, canvasXY.y);
        this.b2Held = context.isPointInPath(this.b2, canvasXY.x, canvasXY.y);
        this.b3Held = context.isPointInPath(this.b3, canvasXY.x, canvasXY.y);
      } catch (TypeError) {  // Error when button is held down and game resets until new click
        this.b1Held = false;
        this.b2Held = false;
        this.b3Held = false;
      }
    } else {
      this.b1Held = false;
      this.b2Held = false;
      this.b3Held = false;
    }

    if (this.b1Held || isKeyDown("Space")) {
      //alert("Click in path")
      this.mechPowerInput = this.maxPower;
    } else {
      this.mechPowerInput = 0;
    }


    // if (isKeyDown("Space")) {
    //   this.mechPowerInput = this.maxPower;
    // } else {
    //   this.mechPowerInput = 0;
    // }
    // if (isKeyPressed("Space")) {
    //   this.mechPowerInput = this.genMech.s_rated * 1.05;
    // } else {
    //   this.mechPowerInput = this.mechPowerInput * 0.95;
    // }

    let storagePower = 0;
    if (this.storageEnabled) {
      let storageDispatch = 0;
      if (isKeyDown("ArrowUp") || this.b2Held) {
        storageDispatch = this.storage.dischargeRate;
      } else if (isKeyDown("ArrowDown") || this.b3Held) {
        storageDispatch = -this.storage.chargeRate;
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
