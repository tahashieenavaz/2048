const { createApp, reactive, ref, computed, onMounted } = Vue;
const { random } = Math;

const rand = (start, end) => ~~(random() * (end - start)) + start;

const colors = {
  0: "rgba(238, 228, 218, 0.35)",
  2: "#eee4da",
  4: "#eee1c9",
  8: "#f3b27a",
  16: "#f69664",
  32: "#f77c5f",
  64: "#f75f3b",
  128: "#edd073",
  256: "#edcc62",
  512: "#edc950",
  1024: "#edc53f",
  2048: "#edc22e",
};

const app = createApp({
  setup() {
    const score = ref(0);
    const best = computed(() => {
      const storedBestScore = Number(localStorage.getItem("score")) || 0;
      if (score.value > storedBestScore) {
        localStorage.setItem("score", score.value);
        return score;
      }

      return storedBestScore;
    });
    const board = reactive([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    const getColor = (cell) => colors[cell];

    const randomCell = (first = false) => {
      let i = rand(0, 4);
      let p = rand(0, 4);

      while (board[i][p] != 0) {
        i = rand(0, 4);
        p = rand(0, 4);
      }

      if (first) {
        return (board[i][p] = 2);
      }

      return (board[i][p] = rand(0, 500) % 2 === 0 ? 2 : 4);
    };

    const newGame = () => {
      for (let i = 0; i < 4; i++) {
        for (let p = 0; p < 4; p++) {
          board[i][p] = 0;
        }
      }

      randomCell(true);
      randomCell(false);
    };

    const moveRight = () => {
      for (let p = 0; p < 4; p++) {
        board.forEach((row) => {
          for (let i = row.length - 1; i > 0; i--) {
            if (row[i] === row[i - 1]) {
              row[i] = row[i] * 2;
              score.value += row[i] * 2;
              row[i - 1] = 0;
            } else if (row[i] === 0 && row[i - 1] != 0) {
              row[i] = row[i - 1];
              row[i - 1] = 0;
            }
          }
        });
      }
    };

    const rotateBoard = (count = 1) => {
      for (let counter = 0; counter < count; counter++) {
        const rotatedBoard = board[0].map((val, index) =>
          board.map((row) => row[index]).reverse()
        );

        rotatedBoard.forEach((row, i) =>
          row.forEach((cell, p) => (board[i][p] = cell))
        );
      }
    };

    onMounted(() => {
      randomCell(true);
      randomCell(false);

      addEventListener("keydown", (e) => {
        if (!isArrowKey(e)) return false;

        const beforeSnapshot = JSON.stringify(board);

        if (e.code === "ArrowRight") moveRight();
        if (e.code === "ArrowUp") {
          rotateBoard(1);
          moveRight();
          rotateBoard(3);
        }
        if (e.code === "ArrowLeft") {
          rotateBoard(2);
          moveRight();
          rotateBoard(2);
        }

        if (e.code === "ArrowDown") {
          rotateBoard(3);
          moveRight();
          rotateBoard(1);
        }

        const afterSnapshot = JSON.stringify(board);

        if (
          beforeSnapshot === afterSnapshot &&
          board.flat().every((cell) => cell != 0)
        ) {
          return console.log("lost");
        }

        return randomCell();
      });
    });

    return { best, score, board, getColor, newGame };
  },
});

app.mount("#app");

function isArrowKey(event) {
  return ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(
    event.code
  );
}
