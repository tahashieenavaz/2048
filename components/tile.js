app.component("tile", {
  props: {
    tile: String,
    i: Number,
    j: Number,
  },
  data() {
    return {
      colors: {
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
      },
    };
  },
  template: `
        <div class="tile" :class="'position-'+i+'-'+j" :style="{background: colors[tile] }" :class="{black: [2, 4].includes(tile)}">{{tile == 0 ? '' : tile}}</div>
    `,
});
