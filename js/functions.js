const { random } = Math

export const rand = (start, end) => ~~(random() * (end - start)) + start

export const isArrowKey = (event) => {
  return ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(
    event.code
  )
}

export const deepClone = (array) => {
  const { stringify, parse } = JSON
  return parse(stringify(array))
}
