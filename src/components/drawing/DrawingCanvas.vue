<template>
    <v-card
        id="drawing"
        outlined
        elevation="0"
        :style="`height: ${height} !important;`">
        <div 
            v-if="isCanvasAdmin"
            class="drawing__controls">
            <div class="d-flex">
                <v-menu 
                    attach="#drawing"
                    :close-on-content-click="false"
                    @update:return-value="setLineWidth"
                    content-class="user-settings"
                    right
                    offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            depressed
                            v-bind="attrs"
                            v-on="on"
                            icon>
                            <v-icon>mdi-resize</v-icon>
                        </v-btn>
                    </template>
                    <div class="d-flex lineWidth">
                        <p 
                            class="mb-0 mr-2">
                            {{ lineWidth }} 
                        </p>
                        <v-slider
                            v-model="lineWidth"
                            max="10"
                            min="1"
                            hide-details=""
                            ticks />
                    </div>
                </v-menu>
                <v-btn
                    @click="toggleBucketTool"
                    :color="bucktetTool? 'success': ''"
                    icon>
                    <v-icon>mdi-format-color-fill</v-icon>
                </v-btn>
            </div>
            <div class="d-flex">
                <v-btn
                    @click="undo"
                    icon>
                    <v-icon>mdi-undo</v-icon>
                </v-btn>
                <v-btn
                    @click="redo"
                    icon>
                    <v-icon>mdi-redo</v-icon>
                </v-btn>
            </div>
            <div class="d-flex">
                <v-btn
                    @click="clear"
                    icon>
                    <v-icon>mdi-delete-empty</v-icon>
                </v-btn>
            </div>
            <v-menu 
                @update:return-value="setDrawingColor"
                attach="#drawing"
                content-class="user-settings"
                right
                offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        depressed
                        class="mt-auto"
                        :color="selectedColor.hex"
                        v-bind="attrs"
                        v-on="on" />
                </template>
                <v-color-picker
                    v-model="selectedColor" />
            </v-menu>
        </div>
        <canvas 
            width="100%"
            id="drawing-canvas"
            :class="{
                'bucktetTool': bucktetTool,
                'filling': filling
            }" />
    </v-card>
</template>

<script>
import CanvasFreeDrawing from "canvas-free-drawing"

export default {
    props: {
        initCanvasOnMounted: {
            type: Boolean,
            required: false,
            default: true
        },
        isCanvasAdmin: {
            type: Boolean,
            required: false,
            default: false
        },
        height: {
            type: String,
            required: false,
            default: '500px'
        }
    },
    data() {
        return {
            /**
             * @type { CanvasFreeDrawing }
             */
            canvas: undefined,
            selectedColor: {
                hex: "#000"
            },
            lineWidth: 5,
            bucktetTool: false,
            filling: false
        }
    },
    methods: {
        setHandlers() {
            this.canvas.on({ event: 'mouseup' }, () => {
                this.emitCanvasData()
            });
            this.canvas.on({ event: 'fill' }, () => {
                this.filling = false
            });
            this.canvas.on({ event: 'mousedown' }, () => {
                if (this.bucktetTool)
                    this.filling = true
            });
            
        },
        emitCanvasData() {
            this.$emit('canvasData', {
                data: this.getData()
            })
        },
        initCanvas() {
            this.canvas = new CanvasFreeDrawing({
                elementId: "drawing-canvas",
                width: document.getElementById("drawing-canvas").offsetWidth,
                height: parseInt(this.height.replace(/(px|%|\s)+/g, "")),
                disabled: !this.isCanvasAdmin,
                lineWidth: this.lineWidth
            })
            this.setHandlers()
        },
        getData() {
            return this.canvas.save()
        },
        clear() {
            this.canvas.clear()
            this.emitCanvasData()
        },
        undo() {
            this.canvas.undo()
            this.emitCanvasData()
        },
        redo() {
            this.canvas.redo()
            this.emitCanvasData()
        },
        restoreData(data) {
            this.canvas.restore(data)
        },
        setLineWidth() {
            this.canvas.setLineWidth(this.lineWidth)
        },
        setDrawingColor() {
            this.canvas.setDrawingColor([this.selectedColor.rgba.r, this.selectedColor.rgba.g, this.selectedColor.rgba.b])
        },
        toggleBucketTool() {
            this.bucktetTool = this.canvas.toggleBucketTool()
        },
    },
    mounted() {
        const drawingCanvas = document.getElementById("drawing-canvas")
            
        new ResizeObserver(() => {
            const data = this.getData()
            drawingCanvas.width = drawingCanvas.offsetWidth
            this.canvas.width = drawingCanvas.offsetWidth
            this.restoreData(data)
        })
        .observe(drawingCanvas)

        if (this.initCanvasOnMounted)
            this.initCanvas()
    }
}
</script>

<style lang="scss">
#drawing {
    display: flex;

    #drawing-canvas {
        width: 100%;
        display: block;

        &.bucktetTool {
            cursor: url("~@/assets/images/format-color-fill.svg") 24 24, auto !important;
        }

        &.filling {
            cursor: wait;
        }
    }

    .drawing__controls {
        padding: 5px;
        display: flex;
        flex-direction: column;
        border-right: thin solid rgba(0, 0, 0, 0.12);

    }
    .lineWidth {
        min-width: 200px;
        background: white;
        padding: 0 20px;
        align-items: center;
        height: 60px;
    }

}
</style>