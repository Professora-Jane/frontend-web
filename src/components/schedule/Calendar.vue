<template>
    <v-calendar
        v-bind="{...$props, ...$attrs}"
        id="table"
        v-on="$listeners"
        ref="calendar"
        v-model="value"
        :weekdays="$attrs['weekdays'] || weekday"
        :type="$attrs['type'] || type"
        :events="classes"
        :event-start="$attrs['event-start'] || 'startTime'"
        :event-end="$attrs['event-end'] || 'endTime'"
        :interval-format="intervalFormat"
        :first-interval="firstInterval"
        @mouseenter:event="highlightClass"
        @mouseleave:event="unhighlightClass"
        :interval-count="$attrs['interval-count'] || 17">
        <template v-slot:day-body="{ date, week }">
            <div
                class="v-current-time"
                :class="{ first: date === week[0].date }"
                :style="{ top: nowY }" />
        </template>
        <template 
            v-for="(_, slot) of $scopedSlots"
            v-slot:[slot]="scope">
            <slot 
                :name="slot" 
                v-bind="scope" />
        </template>
    </v-calendar>
</template>

<script>
export default {
    props: {
        events: {
            type: Array,
            required: true
        },
    },
    data() {
        return {
            value: "",
            ready: false,
            type: 'week',
            mode: 'stack',
            weekday: [0, 1, 2, 3, 4, 5, 6],
            firstInterval: 6,
            updatedEvents: []
        }
    },
    computed: {
        cal () {
            return this.ready ? this.$refs.calendar : null
        },
        nowY () {
            return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
        },
        classes: {
            get() {
                return this.updatedEvents
            },
            set(newValue) {
                this.updatedEvents = newValue
            }
        }
    },
    methods: {
        intervalFormat(interval) {
            return interval.time
        },
        highlightClass({ event }) {
            this.classes = this.classes.map(item => {
                if (item.id === event.id)
                    item.color = "orange" 
                return item
            })
        },
        unhighlightClass({ event }) {
            this.classes = this.classes.map(item => {
                if (item.id === event.id)
                    item.color = undefined 
                return item
            })
        },
        getExpectedVCalendarTime(time) {
            const date = time.toLocaleString().substring(0,10).split("/")
            const hours = time.getMinutes() > 9 ? toString(time.getMinutes()) : "0" + time.getMinutes()
            return `${date[2]}-${date[1]}-${date[0]} ${time.getHours()}:${hours}`
        },
        updateClasses() {
            this.updatedEvents = (this.events && this.events.length)? this.events.map(item => {
                item.startTime = this.getExpectedVCalendarTime(new Date(item.startTime))
                item.endTime = this.getExpectedVCalendarTime(new Date(item.endTime))

                return item
            }) : []
        }
    },
    mounted () {
        this.ready = true
    },
    watch: {
        events: function() {
            this.updateClasses()
        }
    }
}
</script>

<style lang="scss">
.v-current-time {
    height: 2px;
    background-color: #ea4335;
    position: absolute;
    left: -1px;
    right: 0;
    pointer-events: none;

    &.first::before {
        content: '';
        position: absolute;
        background-color: #ea4335;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-top: -5px;
        margin-left: -6.5px;
    }
}
</style>