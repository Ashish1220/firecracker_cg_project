class Domel {
  #el = null
  get el () { return this.#el }
  constructor(sel) {
    this.#el = document.querySelector(sel)
  }
  unhide () {
    if (this.el) {
      this.el.classList.remove('hidden')
    }
  }
  on(...args) {
    this.el.addEventListener(...args)
  }
  off(...args) {
    this.el.removeEventListener(...args)
  }
}
