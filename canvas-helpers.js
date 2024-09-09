// let getDom = (...args) => (document.querySelector(...args))
const getDom = document.querySelector.bind(document)

function canvasSetup(sel) {
  const {canvas, bb:{width: W, height: H}} = getCanvas(sel)
  canvas.width = 10
  canvas.height = 1

  setTimeout(() => {
    canvas.width = parseFloat(W)
    canvas.height = parseFloat(H)
  }, 0)
}

function getCanvas(sel, context='2d') {
  const canvas = getDom(sel)
  return {
    canvas,
    ctx: canvas.getContext(context),
    bb: canvas.getBoundingClientRect()
  }
}
