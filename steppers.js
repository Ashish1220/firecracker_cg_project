const stepperOneState = {
  message: "empty",
  N: 100,
  prevRefreshTimestamp:  null,
  timestamps:  [],
  runningFillDurationAverage: 0.0,
  runningAvgFactor: 0.05,
  fillDuration: 0.0,
  fps: 0.0,
}

const stepperTwoState = {
  message: "empty",
  start: document.timeline.currentTime,
  angularSpeedRpm: 30,
}
class Stepper {
  #startMs = null
  rotr = null
  fps = null

  constructor(angularSpeedRpm, phase=0.0) {
    this.rotr = new Rotr(angularSpeedRpm, phase)
    this.fps = new Fps(100, 0.05)
  }

  start() {
    this.#startMs = document.timeline.currentTime
  }

  step (ms) {
    const radians = this.rotr.radians(ms - this.#startMs)
    const fps = this.fps.getFps(ms - this.#startMs)
    return {radians, fps}
  }

  get isActive() {
    return this.#startMs !== null
  }
}

class Rotr {
  rpm
  phase
  #timePeriod

  constructor(rpm, phase = 0.0) {
    this.rpm = rpm
    this.phase = phase
    this.#timePeriod = (60000 / this.rpm)
  }

  rotations(ms) {
    const T = this.#timePeriod
    return ((ms % T) / T + this.phase) % 1
  }

  radians(ms) {
    return 2 * Math.PI * this.rotations(ms)
  }

}

class Fps {
  N = 100
  runningAvgFactor = 0.05

  #timestamps = []
  #runningFillDurationAverage = 0.0
  #prevRefreshTimestamp = 0.0
  #fps

  constructor(
    N = 100,
    runningAvgFactor = 0.05,
  ) {
    this.N				= N
    this.runningAvgFactor		= runningAvgFactor

    this.#runningFillDurationAverage	= 0.0
    this.#timestamps = []
    this.#prevRefreshTimestamp = 0.0

  }

  getFps(msSinceStart) {
    let fillDurationMs = 0.0

    // Push timestamp to stack
    this.#timestamps.push(msSinceStart)

    // If stack full, refresh state
    if (this.N <= this.#timestamps.length) {
      fillDurationMs = msSinceStart - this.#prevRefreshTimestamp
      this.#prevRefreshTimestamp = msSinceStart
      this.#timestamps.splice(0)

      this.#fps = 1000 / (fillDurationMs / this.N)
    }

    return Math.floor(this.#fps)
  }
}

class StepperThree extends Stepper {
  domEl = null

  constructor(sel, angularSpeedRpm, phase=0.0) {
    super(angularSpeedRpm, phase)
    this.domEl = document.querySelector(sel)
  }

  step(ms) {
    this.domEl.textContent = JSON.stringify(
      super.step(ms), null, 2
    )
  }
}


function stepperOne(ts) {
  // De structure the global state
  const S = stepperOneState

  // Initialise the global state if starting
  if (S.prevRefreshTimestamp == null) {
    S.prevRefreshTimestamp = ts
    console.log({
      prevRefreshTimestamp: S.prevRefreshTimestamp
    })

    setDomText('#valueFromStepperOne',
	       JSON.stringify({message: S.message}, null, 2))

    // Request again
    window.requestAnimationFrame(stepperOne)

    return
  }

  // Or else, Process the stack.

  // Push timestamp to stack
  S.timestamps.push(ts)

  // If stack full, refresh state
  if (S.N <= S.timestamps.length) {
    S.fillDuration = ts - S.prevRefreshTimestamp
    S.prevRefreshTimestamp = ts
    if (0.0 < S.runningFillDurationAverage) {
      // This is not the first refresh, start
      // accumulating the averages
      S.runningFillDurationAverage *= 1 - S.runningAvgFactor
      S.runningFillDurationAverage += S.fillDuration * S.runningAvgFactor
    } else {
      S.runningFillDurationAverage = S.fillDuration
    }
    S.fps = 1000 * S.N / S.fillDuration

    if (0 < S.fillDuration) {
      S.message = {
	fillDuration: S.fillDuration.toFixed(4),
	runningAverage: S
	  .runningFillDurationAverage.toFixed(4),
	fps: Math.floor(S.fps),
      }

      setDomText('#valueFromStepperOne',
		 JSON.stringify({message: S.message}, null, 2))

    }

    S.timestamps.splice(0)

    
  }

  // Request again
  window.requestAnimationFrame(stepperOne)

}

function setDomText(sel, txt) {
  const domEl = document.querySelector(sel)
  domEl.textContent = txt
}

function stepperTwo(ts) {
  const S = stepperTwoState

  if (!S.tp)
    S.tp = 60000/S.angularSpeedRpm

  S.message = {
    rotation: ((ts - S.start) / S.tp) % 1
  }  

  setDomText('#valueFromStepperTwo',
	     JSON.stringify(S.message, null, 2))

  window.requestAnimationFrame(stepperTwo)
}
