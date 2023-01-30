import { rand, isArrowKey } from "./functions.js"
import { colors } from "./data.js"

const { createApp, reactive, ref, computed, onMounted } = Vue

const app = createApp({
  setup() {
    const score = ref(0)
    const best = computed(() => {
      const storedBestScore = Number(localStorage.getItem("score")) || 0

      if (score.value > storedBestScore) {
        localStorage.setItem("score", score.value)
        return score
      }

      return storedBestScore
    })
    const board = reactive([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])

    const getColor = (cell) => colors[cell]
    const randomCell = (first = false) => {
      if (board.flat().every((i) => i != 0)) return false

      let i = rand(0, 4)
      let p = rand(0, 4)

      while (board[i][p] != 0) {
        i = rand(0, 4)
        p = rand(0, 4)
      }

      if (first) {
        return (board[i][p] = 2)
      }

      return (board[i][p] = rand(0, 500) % 2 === 0 ? 2 : 4)
    }
    const newGame = () => {
      for (let i = 0; i < 4; i++) for (let p = 0; p < 4; p++) board[i][p] = 0
      randomCell(true)
      randomCell(false)
      document.querySelector(".finished").classList?.add("hide")
      score.value = 0
    }

    const moveRight = (board) => {
      for (let p = 0; p < 4; p++) {
        board.forEach((row) => {
          for (let i = row.length - 1; i > 0; i--) {
            if (row[i] === row[i - 1]) {
              row[i] = row[i] * 2
              score.value += row[i] * 2
              row[i - 1] = 0
            } else if (row[i] === 0 && row[i - 1] != 0) {
              row[i] = row[i - 1]
              row[i - 1] = 0
            }
          }
        })
      }

      return board
    }
    const moveUp = (board) => {
      rotateBoard(board, 1)
      moveRight(board)
      rotateBoard(board, 3)

      return board
    }
    const moveLeft = (board) => {
      rotateBoard(board, 2)
      moveRight(board)
      rotateBoard(board, 2)

      return board
    }
    const moveDown = (board) => {
      rotateBoard(board, 3)
      moveRight(board)
      rotateBoard(board, 1)

      return board
    }
    const calculateRotatedBoard = (board) => {
      return board[0].map((_, index) =>
        board.map((row) => row[index]).reverse()
      )
    }
    const rotateBoard = (board, count = 1) => {
      for (let counter = 0; counter < count; counter++) {
        const rotatedBoard = calculateRotatedBoard(board)
        rotatedBoard.forEach((row, i) =>
          row.forEach((cell, p) => (board[i][p] = cell))
        )
      }
    }
    const calculateIsFinished = () => {
      const boardSnapshot = structuredClone(board)
      const resultsSet = new Set([boardSnapshot])

      resultsSet.add(JSON.stringify(moveLeft(boardSnapshot)))
      resultsSet.add(JSON.stringify(moveRight(boardSnapshot)))
      resultsSet.add(JSON.stringify(moveDown(boardSnapshot)))
      resultsSet.add(JSON.stringify(moveUp(boardSnapshot)))

      return resultsSet.size === 2
    }

    onMounted(() => {
      randomCell(true)
      randomCell(false)

      addEventListener("keydown", (e) => {
        if (!isArrowKey(e)) return false

        if (e.code === "ArrowRight") moveRight(board)
        if (e.code === "ArrowUp") moveUp(board)
        if (e.code === "ArrowLeft") moveLeft(board)
        if (e.code === "ArrowDown") moveDown(board)

        if (calculateIsFinished()) {
          document.querySelector(".finished").classList?.remove("hide")
          return console.log("finish")
        }

        return randomCell()
      })
    })

    return { best, score, board, getColor, newGame }
  },
})

app.mount("#app")
