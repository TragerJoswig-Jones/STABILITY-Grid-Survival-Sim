import { Scene } from 'engine/Scene.js';
import { playSound } from 'engine/soundHandler.js';
import { BAR_HEIGHT_SCALE, BAR_WIDTH_SCALE, FREQ_NOM, OMEGA_NOM, SCREEN_HEIGHT, SCREEN_WIDTH, S_BASE } from 'game/constants/game.js';
import { Plot } from 'game/entities/Plot.js';
import { LowPassFilter } from 'game/entities/LowPassFilter.js';
import { PowerBar } from 'game/entities/PowerBar.js';
import { SwingDynamics } from 'game/entities/SwingDynamics.js';
import { PIDControl } from 'game/entities/PIDControl.js';
import { Storage } from 'game/entities/Storage.js';
import { GenSymbol } from 'game/entities/GeneratorSymbol.js';
import { isKeyPressed, isKeyDown, whereClickLocation, getTouches } from 'engine/inputHandler.js';
import { Control } from 'game/constants/controls.js';
import { LOAD_CURVE } from 'game/constants/load.js';

export class GameScene extends Scene {
  music = document.getElementById('bgm');
  button = document.getElementById("powerButton");
  lightness = 22;

  constructor() {
    super();

    // Variable init
    this.mechPowerInput = 0;
    this.score = 0;
    this.iMinute = Math.floor(LOAD_CURVE.length / 4);  // minute index for load curve: Starts at 6am
    this.loadStep = 0;

    // Gameplay parameters
    this.sNominal = S_BASE;

    this.loadUpdateTime = 10;
    this.lastStepTime = document.timeline.currentTime; // TODO: Or set to 0? Unsure how to handle game resets
    this.minuteUpdateTime = 1 / 60;  // 1 second in game corresponds to 1 hour of load data.
    this.lastMinuteStep = document.timeline.currentTime;
    this.genLimUpdateTime = 5;
    this.lastgenLimStep = document.timeline.currentTime; // TODO: Or set to 0? Unsure how to handle game resets

    this.maxloadCurve = 0.8;  // in per unit
    this.minloadCurve = 0.2;
    this.maxLoad = 90;  // TODO: Change this to per unit
    this.minLoad = 10;
    this.maxLoadStep = 0;
    this.load = ((this.maxloadCurve - this.minloadCurve) * LOAD_CURVE[this.iMinute % LOAD_CURVE.length] + this.minloadCurve) * this.sNominal;

    this.freqBound = FREQ_NOM * 3 / 4 //3 / 60 * FREQ_NOM;
    this.freqLim = [FREQ_NOM - this.freqBound, FREQ_NOM + this.freqBound]
    this.omegaMin = 2 * Math.PI * this.freqLim[0];
    this.omegaMax = 2 * Math.PI * this.freqLim[1];
    this.underFreqCount = 0;
    this.overFreqCount = 0;
    this.timeLim = 10;  // frames outside of bound before game over

    this.calcLevelDuration = (level) => level * 6 + 14;
    this.level = 1;
    this.levelEndTime = this.calcLevelDuration(this.level * 2);  // Adding in bonus time for level 1
    this.playTime = 0;
    this.bonusCounter = 0;
    this.bonusMultiplier = 5;
    this.minTimeForBonus = 1;

    let omegaFilt = 0.3;  // Gen Low-pass filter frequency (rad/s)
    let genInertia = 0.8; //5;  // H (p.u.)
    let genMaxPower = 100;  // MW

    let storCapacity = 0.1;  // MW
    let storDischargeLim = 50;  // MW
    let storChargeLim = 50;  // MW
    let storEfficiency = 0.9;
    this.storageEnabled = false;

    let kp = 0;
    let ki = 0;
    let kd = 0;
    this.kpLim = 99;
    this.kiLim = 20;
    this.kdLim = 20;
    let integralLimit = genMaxPower;
    this.pidEnabled = false;

    this.genLimitsEnabled = false;
    this.maxGenLimit = 0.5;  // p.u.

    this.pvGenLimitsEnabled = false;

    // Display parameters
    let plotBound = FREQ_NOM * 10 / 8 //5 / 60 * FREQ_NOM;;
    let plotBounds = [FREQ_NOM - plotBound, FREQ_NOM + plotBound];
    let powerBarY = SCREEN_HEIGHT * (0.4);
    let plotY = SCREEN_HEIGHT * (0.15);

    let wavePlotBounds = [-1.1, 1.1];

    // Display entities
    this.genBar = new PowerBar({ x: SCREEN_WIDTH * (0.75), y: powerBarY }, { width: SCREEN_WIDTH * BAR_WIDTH_SCALE, height: SCREEN_HEIGHT * BAR_HEIGHT_SCALE }, 'blue', true, false, this.sNominal, { name: 'Power', unit: 'MW' }, { label: "Generation", leftSide: false, fontSize: 15 });
    this.loadBar = new PowerBar({ x: SCREEN_WIDTH * (0.25) - SCREEN_WIDTH * BAR_WIDTH_SCALE, y: powerBarY }, { width: SCREEN_WIDTH * BAR_WIDTH_SCALE, height: SCREEN_HEIGHT * BAR_HEIGHT_SCALE }, 'red', true, false, this.sNominal, { name: 'Power', unit: 'MW' }, { label: "Load", leftSide: true, fontSize: 15 });
    this.plot = new Plot({ x: SCREEN_WIDTH * (0.1), y: plotY }, { width: SCREEN_WIDTH * 0.8, height: SCREEN_HEIGHT * 0.2 }, 1000, plotBounds, 'blue', FREQ_NOM, this.freqLim, "time (s)", "frequency (Hz)", 12)

    //TODO: Automatically shift things here based on the generator image sizes
    this.wavePlot = new Plot({ x: SCREEN_WIDTH * (0.4), y: plotY + SCREEN_HEIGHT * 0.23 + 95 }, { width: SCREEN_WIDTH * 0.2, height: SCREEN_HEIGHT * 0.075 }, 200, wavePlotBounds, 'blue', 0, [], "time (s)", "current (A)", 12)
    this.genDiagram = new GenSymbol({ x: SCREEN_WIDTH * (0.5) - 45, y: plotY + SCREEN_HEIGHT * 0.23 }, 0.9)

    let storBarY = SCREEN_HEIGHT * (0.7); //powerBarY + SCREEN_HEIGHT * BAR_HEIGHT_SCALE + 40;
    let storLabel = { name: 'Energy:', unit: 'kWh' };
    this.storSOCBar = new PowerBar({ x: SCREEN_WIDTH * (0.5) - 0.5 * SCREEN_WIDTH * BAR_WIDTH_SCALE, y: storBarY + SCREEN_HEIGHT * 0.05 }, { width: SCREEN_WIDTH * BAR_WIDTH_SCALE, height: SCREEN_HEIGHT * 0.5 * BAR_HEIGHT_SCALE },
      'green', true, false, storCapacity * 1000, storLabel);

    // Display buttons
    this.buttons = new Map();
    let powerButton = { label: "Power ↑", x: SCREEN_WIDTH * (0.7), y: SCREEN_HEIGHT * (0.7), w: SCREEN_WIDTH * (0.25), h: SCREEN_HEIGHT * (0.25), r: 10, enabled: true, held: false, path: NaN };
    let storDischargeButton = { label: "Discharge", x: SCREEN_WIDTH * (0.05), y: SCREEN_HEIGHT * (0.7), w: SCREEN_WIDTH * (0.25), h: SCREEN_HEIGHT * (0.1), r: 10, enabled: this.storageEnabled, held: false, path: NaN };
    let storChargeButton = { label: "Charge", x: SCREEN_WIDTH * (0.05), y: SCREEN_HEIGHT * (0.85), w: SCREEN_WIDTH * (0.25), h: SCREEN_HEIGHT * (0.1), r: 10, enabled: this.storageEnabled, held: false, path: NaN };

    this.buttons.set('power', powerButton);
    this.buttons.set('charge', storChargeButton);
    this.buttons.set('discharge', storDischargeButton)

    //TODO: Set button width and height based on the screen width and height. Remove magic numbers here
    let pidPanel = { x: 0.1 * SCREEN_WIDTH, y: powerBarY + SCREEN_HEIGHT * BAR_HEIGHT_SCALE + 30, w: SCREEN_WIDTH * (0.8), h: SCREEN_HEIGHT * BAR_HEIGHT_SCALE * 1 / 6 }
    let kpPlusPIDButton = { label: "+", x: pidPanel.x + pidPanel.w * 1 / 11, y: pidPanel.y, w: 20, h: 20, r: 10, enabled: this.pidEnabled, held: false, path: NaN };
    let kpMinusPIDButton = { label: "-", x: pidPanel.x + pidPanel.w * 2 / 11, y: pidPanel.y, w: 20, h: 20, r: 10, enabled: this.pidEnabled, held: false, path: NaN };
    let kiPlusPIDButton = { label: "+", x: pidPanel.x + pidPanel.w * 5 / 11, y: pidPanel.y, w: 20, h: 20, r: 10, enabled: this.pidEnabled, held: false, path: NaN };
    let kiMinusPIDButton = { label: "-", x: pidPanel.x + pidPanel.w * 6 / 11, y: pidPanel.y, w: 20, h: 20, r: 10, enabled: this.pidEnabled, held: false, path: NaN };
    let kdPlusPIDButton = { label: "+", x: pidPanel.x + pidPanel.w * 9 / 11, y: pidPanel.y, w: 20, h: 20, r: 10, enabled: this.pidEnabled, held: false, path: NaN };
    let kdMinusPIDButton = { label: "-", x: pidPanel.x + pidPanel.w * 10 / 11, y: pidPanel.y, w: 20, h: 20, r: 10, enabled: this.pidEnabled, held: false, path: NaN };

    this.buttons.set('kpp', kpPlusPIDButton);
    this.buttons.set('kpm', kpMinusPIDButton);
    this.buttons.set('kip', kiPlusPIDButton);
    this.buttons.set('kim', kiMinusPIDButton);
    this.buttons.set('kdp', kdPlusPIDButton);
    this.buttons.set('kdm', kdMinusPIDButton);
    this.pidPanel = pidPanel

    // Dynamics entities
    this.systemSwing = new SwingDynamics(genInertia, genMaxPower);
    this.genMech = new LowPassFilter(omegaFilt, this.sNominal, this.load);
    this.maxPower = this.genMech.s_rated  // The maximum available mechanical power

    this.storage = new Storage(storCapacity, storDischargeLim, storChargeLim, storEfficiency)

    this.pidController = new PIDControl(0, 0, 0, integralLimit)
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

    if (this.pidEnabled) {
      context.textAlign = 'right';
      context.font = 'normal 12px Nunito Sans';
      context.fillText('kp: ' + this.pidController.kp.toFixed(1), this.buttons.get('kpp').x - 10, this.buttons.get('kpp').y + 15);
      context.fillText('ki: ' + this.pidController.ki.toFixed(1), this.buttons.get('kip').x - 10, this.buttons.get('kip').y + 15);
      context.fillText('kd: ' + this.pidController.kd.toFixed(1), this.buttons.get('kdp').x - 10, this.buttons.get('kdp').y + 15);
    }

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

    let timeMultiplier = 1;
    if (this.bonusCounter > this.minTimeForBonus) {
      timeMultiplier = this.bonusMultiplier;
    }
    let bonus = time.secondsPassed * timeMultiplier;

    /* Difficulty progression */
    this.playTime += time.secondsPassed + bonus;
    if (this.playTime > this.levelEndTime) {
      this.level += 1;
      this.levelEndTime += this.calcLevelDuration(this.level);

      if (this.level == 2) {  // Turns off high-inertia/slow-mode at level 2
        this.systemSwing.h = 0.6//5;
      } else if (this.level > 2 && this.systemSwing.h > 0.1) {//3) {  // Decreases inertia each level until j = 0.5
        this.systemSwing.h -= 0.05; //0.1;  // Decreases to 1 in 10 levels
        //this.systemSwing.updateH(this.systemSwing.j)  // Decreases to 0.5 in 10 levels
      }

      if (this.level > 1 && this.genMech.omega_filt < 0.5) {
        this.genMech.omega_filt += 0.05  // Increase filter frequency to quicken response
      }

      if (this.level > 5 && this.maxLoadStep < 50) {
        this.maxLoadStep += 5;
      }
      if (this.level > 15 && this.maxLoadStep < 80) {
        this.maxLoadStep += 5;
      }

      if (this.level > 5 && this.loadUpdateTime > 5) {
        this.loadUpdateTime -= 1;
      }
      if (this.level > 15 && this.loadUpdateTime > 2) {
        this.loadUpdateTime -= 0.5;
      }

      if (this.level == 5) {  // Unlocks storage at level 5
        this.storageEnabled = true;
        this.buttons.get("charge").enabled = true;
        this.buttons.get("discharge").enabled = true;
      }

      if (this.level == 15) {  // Unlocks pid control at level 10
        this.pidEnabled = true;
        this.buttons.get('kpp').enabled = true;
        this.buttons.get('kpm').enabled = true;
        this.buttons.get('kip').enabled = true;
        this.buttons.get('kim').enabled = true;
        this.buttons.get('kdp').enabled = true;
        this.buttons.get('kdm').enabled = true;
      }

      if (this.level == 12) {
        this.genLimitsEnabled = true;
        this.genBar.lim_display = true;
      }

      if (this.level == 10) {  // Increase power levels to give higher rewards for harder levels
        //TODO: Make this a function or functions of these objects to change their sRated values
        let powerIncrease = 100;
        this.sNominal = this.sNominal + powerIncrease;
        let percentIncrease = (1 + powerIncrease / this.genMech.s_rated);

        this.systemSwing.s_rated += powerIncrease;
        //this.systemSwing.h = this.systemSwing.h * percentIncrease  // Increase inertia to keep the difficulty the same

        this.genMech.omega_filt = this.genMech.omega_filt * percentIncrease;
        this.genMech.s_rated += powerIncrease;  //TODO: Make a single variable for power level and update all of these to match it.
        this.genMech.max_input += powerIncrease;
        this.maxPower += powerIncrease;

        this.loadBar.value += powerIncrease;
        this.genBar.value += powerIncrease;

        this.maxLoadStep = this.maxLoadStep * percentIncrease;
        this.maxLoad = this.maxLoad * percentIncrease;
        this.minLoad = this.minLoad * percentIncrease;

        this.pidController.integralLimit *= percentIncrease
      }

      if (this.level == 12) {  // Increase size of the storage to handle longer durations of power shortfall
        let scalePercent = 2;
        this.storage.maxEnergy *= scalePercent;

        this.storage.dischargeRate *= scalePercent;
        this.storage.chargeRate *= scalePercent;

        this.storSOCBar.value *= scalePercent;
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
    if ((time.previous - this.lastMinuteStep) / 1000 > this.minuteUpdateTime) {
      this.lastMinuteStep = time.previous;
      this.iMinute += 1;
    }
    this.load = ((this.maxloadCurve - this.minloadCurve) * LOAD_CURVE[this.iMinute % LOAD_CURVE.length] + this.minloadCurve) * this.sNominal;
    if ((time.previous - this.lastStepTime) / 1000 > this.loadUpdateTime) {
      this.lastStepTime = time.previous;

      if (this.loadStep != 0) {
        this.loadStep = 0;
      } else {
        this.loadStep = 2 * this.maxLoadStep * (Math.random() - 0.5);
      }


    }
    if ((time.previous - this.lastgenLimStep) / 1000 > this.genLimUpdateTime) {
      this.lastgenLimStep = time.previous;

      if (this.genLimitsEnabled) {  //TODO: Make limits not impossible to achieve is terms of energy storage. Make it so that the energy defecit over some time interval is less than the available storage capacity * difficult_scaling_factor [0,1].
        this.maxPower = this.genMech.s_rated * (1 - (this.maxGenLimit * Math.random()));
      }
    }

    this.load += this.loadStep;
    if (this.load > this.maxLoad) {
      this.load = this.maxLoad;
      //this.load = (this.maxLoad - this.minLoad) / 2;
    } else if (this.load < this.minLoad) {
      this.load = this.minLoad
      //this.load = (this.maxLoad - this.minLoad) / 2;
    }

    this.loadBar.update(this.load / this.loadBar.value);
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
    if (this.buttons.get('kip').held) {
      this.pidController.ki += 0.1;

    } else if (this.buttons.get('kim').held) {
      this.pidController.ki -= 0.1;
    }
    if (this.buttons.get('kdp').held) {
      this.pidController.kd += 0.1;
    } else if (this.buttons.get('kdm').held) {
      this.pidController.kd -= 0.1;
    }

    if (this.pidController.kp > this.kpLim) {
      this.pidController.kp = this.kpLim
    } else if (this.pidController.kp < -this.kpLim) {
      this.pidController.kp = -this.kpLim
    }
    if (this.pidController.ki > this.kiLim) {
      this.pidController.ki = this.kiLim
    } else if (this.pidController.kp < -this.kiLim) {
      this.pidController.ki = -this.kiLim
    }
    if (this.pidController.kd > this.kdLim) {
      this.pidController.kd = this.kdLim
    } else if (this.pidController.kd < -this.kdLim) {
      this.pidController.kd = -this.kdLim
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
      let storageEnergy = this.storage.states.energy;
      this.storSOCBar.update(storageEnergy / this.storage.maxEnergy);
    }

    this.genBar.max_percent = this.maxPower / this.genMech.s_rated;
    this.genBar.update(this.genMech.states.filter / this.genMech.s_rated);
    let genPower = this.genMech.states.filter

    let net_power = genPower - this.load + storagePower;
    this.systemSwing.update(time, net_power);

    this.plot.update(this.systemSwing.states.omega / (2 * Math.PI))

    this.wavePlot.update(this.loadBar.percent * Math.sin(this.systemSwing.states.theta))

    this.genDiagram.update(this.systemSwing.states.theta)

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
    context.strokeStyle = `hsl(134 90% ${this.lightness}%)`;
    this.wavePlot.draw(context);
    this.genDiagram.draw(context)
    this.drawBorder(context);
    this.drawMessage(context);
    this.drawButtons(context);
  }
}
