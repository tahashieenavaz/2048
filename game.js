const rand = (l, h) => ~~(l + Math.random() * (h - l))

const app = Vue.createApp({
    data() {
        return {
            nextTarget: 2048
        }
    },
    mounted() {
        const style = document.createElement('style')
        for( let i = 0; i < 4; i++) {
            for( let j = 0; j < 4; j++) {
                style.innerHTML += `.position-${i}-${j}{ transform: translate( ${j * 116 + 16}px, ${i * 116 + 16}px ) }`
            }
        }
        document.head.appendChild(style)
    }
})
app.component('tile', {
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
                128:"#edd073" ,
                256: "#edcc62",
                512: "#edc950",
                1024: "#edc53f" ,
                2048: "#edc22e",
            },
        }
    },
    template: `
        <div class="tile" :class="'position-'+i+'-'+j" :style="{background: colors[tile] }" :class="{black: [2, 4].includes(tile)}">{{tile == 0 ? '' : tile}}</div>
    `,

})
app.component('board', {
    template: `
        <header>
            <p>Donate!</p>
            <button @click="newGame">New Game</button>
        </header>
        
        <div class="board">
            <template v-for="(row, i) in boardData">
                <template v-for="(tile, j) in row">
                    <transition name="move">
                        <tile :i="i" :j="j" :tile="tile" :key="i*j" ></tile>
                    </transition>
                </template>
            </template>
        </div>
    `,
    methods: {
        newGame() {
            this.boardData = Array(4).fill().map( () => Array(4).fill(0) )
            this.firstRandomTile()
            this.randomTile()
        },
        firstRandomTile() {
            let i = rand(0,4)
            let j = rand(0,4)
            while( this.boardData[i][j] != 0 ) {
                i = rand(0,4)
                j = rand(0,4)
            }

            this.boardData[i][j] = 2
        },
        randomTile() {
            if( this.isFullyFilled ) return false;

            let i = rand(0,4)
            let j = rand(0,4)

            while( this.boardData[i][j] != 0 ) {
                i = rand(0,4)
                j = rand(0,4)
            }

            this.boardData[i][j] = rand(1,3) % 2 == 0 ? 2 : 4
        },
        moveLeft(column) {
            let previous = null
            let newColumn = Array(4).fill(0)
            let j = 0
            for( let i = 0; i < 4; i++ ) {
                if( column[i] != 0 ) {
                    if( !previous ) {
                        previous = column[i]
                    }else {
                        if( previous == column[i] ) {
                            newColumn[j] = 2 * column[i]
                            this.score += 2 * column[i]
                            j++
                            previous = null
                        }else {
                            newColumn[j] = previous
                            j++
                            previous = column[i]
                        }
                    }
                }
            }
            if(previous)
                newColumn[j] = previous

            return newColumn
        },
        rotate(target) {
            const N = target.length - 1;
            const result = target.map((row, i) =>
                row.map((val, j) => target[N - j][i])
            );
            target.length = 0;
            target.push(...result);
            return target;
        }
    },
    computed: {
      isFullyFilled() {
          return this.boardData.flat(2).filter(Boolean).length == 16
      }
    },
    data() {
        return {
            score: 0,
            colors: {
                0: "rgba(238, 228, 218, 0.35)",
                2: "#eee4da",
                4: "#eee1c9",
                8: "#f3b27a",
                16: "#f69664",
                32: "#f77c5f",
                64: "#f75f3b",
                128:"#edd073" ,
                256: "#edcc62",
                512: "#edc950",
                1024: "#edc53f" ,
                2048: "#edc22e",
            },
            boardData: Array(4).fill().map( () => Array(4).fill(0) )
        }
    },
    mounted() {

        this.firstRandomTile()
        this.randomTile()

        addEventListener('keydown', e => {
            let tempBoard = null
            let firstBoard = JSON.stringify(this.boardData)
            switch( e.code ) {
                case 'ArrowLeft':
                    for( let i = 0; i < 4; i++ ) {
                        this.boardData[i] = this.moveLeft(this.boardData[i])
                    }

                    if( firstBoard == JSON.stringify(this.boardData) && this.isFullyFilled )
                        alert('lost')

                    break
                case 'ArrowUp':
                    tempBoard = this.rotate(this.rotate(this.rotate(this.boardData)))
                    for( let i = 0; i < 4; i++ ) {
                        tempBoard[i] = this.moveLeft(tempBoard[i])
                    }
                    this.boardData = this.rotate(tempBoard)

                    if( firstBoard == JSON.stringify(this.boardData) && this.isFullyFilled )
                        alert('lost')

                    break
                case 'ArrowRight':
                    tempBoard = this.rotate(this.rotate(this.boardData))
                    for( let i = 0; i < 4; i++ ) {
                        tempBoard[i] = this.moveLeft(tempBoard[i])
                    }
                    this.boardData = this.rotate(this.rotate(tempBoard))
                    if( firstBoard == JSON.stringify(this.boardData) && this.isFullyFilled )
                        alert('lost')
                    break
                case 'ArrowDown':
                    tempBoard = this.rotate(this.boardData)
                    for( let i = 0; i < 4; i++ ) {
                        tempBoard[i] = this.moveLeft(tempBoard[i])
                    }
                    this.boardData = this.rotate(this.rotate(this.rotate(tempBoard)))
                    if( firstBoard == JSON.stringify(this.boardData) && this.isFullyFilled )
                        alert('lost')
                    break
            }

            if( ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.code) ){
                e.preventDefault()
                this.randomTile()
            }
        })
    }
})

app.mount("#app")
