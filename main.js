import "./style.css";

/** @type {HTMLParagraphElement} */
const out = document.querySelector('.out')
/** @type {HTMLTableElement} */
const keyboard = document.querySelector('.keyboard')

const input = [0, 0]
const dops = [0, 0]
const minus = [false, false]
let op = '?'
let state = 0

const obj = {
  '+': '+',
  '-': '-',
  '÷': '/',
  '×': '*'
}

function toPrecision(inp = 0, precision = 0) {
  const hour = 10 ** precision
  return Math.round(inp * hour) / hour
}

function render() {
  const index = state < 2 ? 0 : 1

  out.innerText = `${minus[index] ? '-' : ''}${dops[index] ? (
    input[index]
      .toFixed(dops[index])
      .slice(0, -1)
  ) : input[index]}`

  console.clear()
  console.table({
    input,
    dops,
    op,
    state,
    minus
  })
}

function inputNum(num = 0) {
  if (state == 1) {
    state = 2
    input[1] = 0
  }
  const index = state == 0 ? 0 : 1

  if (num >= 0) {
    if (!dops[index])
      input[index] = input[index] * 10 + num
    else {
      input[index] += num * Math.pow(10, -(dops[index]++))
      input[index] = toPrecision(input[index], dops[index] - 1)
    }
  } else if (!dops[index]) {
    dops[index]++
  }
}

keyboard.addEventListener('click', ({ target }) => {
  if (!(target instanceof HTMLTableCellElement))
    return

  const { innerText: value } = target

  switch (value) {
    case 'C/CE': {
      input.fill(0)
      dops.fill(0)
      minus.fill(false)
      state = 0
      op = '?'
    } break

    case '+/-': {
      const index = state == 0 ? 0 : 1
      minus[index] = !minus[index]
    } break

    case '√':
    case '%':
    case '=':
    case '+':
    case '-':
    case '÷':
    case '×': {
      const index = state == 0 ? 0 : 1
      dops[index] = 0

      input[0] = input[0] * (minus[0] ? -1 : 1)
      input[1] = input[1] * (minus[1] ? -1 : 1)
      minus.fill(false)

      if (value == '%') {
        input[1] = input[0] * (input[1] / 100)
      }

      if (state == 2 || value == '=') {
        switch (op) {
          case '+': input[0] = input[0] + input[1]; break
          case '-': input[0] = input[0] - input[1]; break
          case '/': input[0] = input[0] / input[1]; break
          case '*': input[0] = input[0] * input[1]; break
        }
      }

      if (value == '√') {
        input[0] = Math.sqrt(input[0])
      }

      if (obj[value]) {
        op = obj[value]
      }

      state = 1
    } break

    default: {
      let num = NaN;

      if (!isNaN(num = +value)) {

        console.log(value)
        inputNum(num)
      }

      if (value == '.')
        inputNum(-1)
    }
  }

  render()
})

render()