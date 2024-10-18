import { Scene } from 'engine/Scene.js';
import { playSound } from 'engine/soundHandler.js';
import { BAR_HEIGHT_SCALE, BAR_WIDTH_SCALE, FREQ_NOM, OMEGA_NOM, SCREEN_HEIGHT, SCREEN_WIDTH, S_BASE } from 'game/constants/game.js';
import { Plot } from 'game/entities/Plot.js';
import { LowPassFilter } from 'game/entities/LowPassFilter.js';
import { PowerBar } from 'game/entities/PowerBar.js';
import { SwingDynamics } from 'game/entities/SwingDynamics.js';
import { PIDControl } from 'game/entities/PIDControl.js';
import { isKeyPressed, isKeyDown } from 'engine/inputHandler.js';
import { Control } from 'game/constants/controls.js';

export class GameScene extends Scene {
  music = document.getElementById('bgm');
  button = document.getElementById("powerButton");
  lightness = 22;

  constructor() {
    super();

    this.score = 0;
    this.load_update_time = 5;
    this.mechPowerInput = 0;
    this.load = 50;
    this.maxLoad = 90;
    this.minLoad = 10;
    this.lastStepTime = 0;
    this.freqBound = 3;
    this.freqLim = [FREQ_NOM - this.freqBound, FREQ_NOM + this.freqBound]
    this.omegaMin = 2 * Math.PI * this.freqLim[0];
    this.omegaMax = 2 * Math.PI * this.freqLim[1];
    this.underFreqCount = 0;
    this.overFreqCount = 0;
    this.timeLim = 10;  // frames outside of bound before game over
    let plotBound = 5;
    let plotBounds = [FREQ_NOM - plotBound, FREQ_NOM + plotBound];

    this.genBar = new PowerBar({ x: SCREEN_WIDTH * (0.7), y: SCREEN_HEIGHT * (0.6) }, { width: SCREEN_WIDTH * BAR_WIDTH_SCALE, height: SCREEN_HEIGHT * BAR_HEIGHT_SCALE }, 'blue', true, true, 100);
    this.loadBar = new PowerBar({ x: SCREEN_WIDTH * (0.3) - SCREEN_WIDTH / 10, y: SCREEN_HEIGHT * (0.6) }, { width: SCREEN_WIDTH * BAR_WIDTH_SCALE, height: SCREEN_HEIGHT * BAR_HEIGHT_SCALE }, 'red', true, false, 100);
    this.plot = new Plot({ x: SCREEN_WIDTH * (0.1), y: SCREEN_HEIGHT * (0.2) }, { width: SCREEN_WIDTH * 0.8, height: SCREEN_HEIGHT * 0.2 }, 1000, plotBounds, 'blue', FREQ_NOM, this.freqLim)
    this.systemSwing = new SwingDynamics(1, 100);
    this.genMech = new LowPassFilter(0.5, 100, this.load);
    this.maxPower = this.genMech.s_rated  // The maximum available mechanical power

    this.pidController = new PIDControl(0, 0, 0)
    this.pidController.set_point = OMEGA_NOM

    this.pidController.kp = 5;
    this.pidController.ki = 1;
    this.pidController.kd = .1;

    playSound(this.music);
  }

  handleBorderFlash = () => {
    this.lightness = 100;
  };

  drawBorder(context) {
    context.lineWidth = 4;
    context.strokeStyle = `hsl(134 90% ${this.lightness}%)`;
    context.beginPath();
    context.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    context.stroke();
  }

  drawMessage(context, score) {
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillStyle = 'white';

    context.font = 'normal 30px Nunito Sans';
    context.fillText('STABILITY', SCREEN_WIDTH / 2, -15 + SCREEN_HEIGHT / 10);

    context.font = 'normal 20px Nunito Sans';
    context.fillText('Score: ' + score.toFixed(2) + ' MWh', SCREEN_WIDTH / 2, 15 + SCREEN_HEIGHT / 10);

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

  update(time, _, camera) {
    camera.update(time);
    if (time.secondsPassed > 0.1) {
      time.secondsPassed = 0.1;
    }
    this.score += time.secondsPassed / (60 * 60) * this.genMech.states.filter; //Update this to be energy transfered? and add a current power transfering display

    if (this.systemSwing.states.omega < this.omegaMin) {
      this.underFreqCount += 1;
    } else if (this.systemSwing.states.omega > this.omegaMax) {
      this.overFreqCount += 1;
    } else {
      this.overFreqCount = 0;
      this.overFreqCount = 0;
    }

    if ((time.previous - this.lastStepTime) / 1000 > this.load_update_time) {
      let loadStep = 100 * (Math.random() - 0.5);
      this.load += loadStep;
      if (this.load > this.maxLoad) {
        //this.load = this.maxLoad;
        this.load -= loadStep;
      } else if (this.load < this.minLoad) {
        //this.load = this.minLoad
        this.load -= loadStep;
      }
      this.lastStepTime = time.previous;

      this.maxPower = this.genMech.s_rated * (1 - 0.2 * Math.random());
    }
    this.loadBar.update(this.load / S_BASE);
    this.genMech.max_input = this.maxPower;

    this.pidController.update(time, this.systemSwing.states.omega);
    let mechPowerCtrl = this.pidController.control();
    this.genMech.update(time, this.mechPowerInput + mechPowerCtrl);  //TODO: Add in hard limits on the power from genMech in case I switch this to not be a lowpass filter in the future or add in temporary power output limits.

    if (isKeyDown("Space")) {
      this.mechPowerInput = this.maxPower;
    } else {
      this.mechPowerInput = 0;
    }
    // if (isKeyPressed("Space")) {
    //   this.mechPowerInput = this.genMech.s_rated * 1.05;
    // } else {
    //   this.mechPowerInput = this.mechPowerInput * 0.95;
    // }

    this.genBar.max_percent = this.maxPower / this.genMech.s_rated;
    this.genBar.update(this.genMech.states.filter / S_BASE);
    let net_power = this.genMech.states.filter - this.load;
    this.systemSwing.update(time, net_power);

    this.plot.update(this.systemSwing.states.omega / (2 * Math.PI))

    if (this.lightness > 22) this.lightness -= 200 * time.secondsPassed;
  }

  draw(context) {
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    this.genBar.draw(context);
    this.loadBar.draw(context);
    this.plot.draw(context);
    this.drawBorder(context);
    this.drawMessage(context, this.score);
  }
}
