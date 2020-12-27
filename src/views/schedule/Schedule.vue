<template>
    <div id="schedule">
        <v-calendar
            ref="calendar"
            v-model="value"
            :weekdays="weekday"
            :type="type"
            hide-header
            :interval-format="intervalFormat"
            :first-interval="firstInterval"
            :interval-count="15" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: undefined,
            type: 'week',
            mode: 'stack',
            weekday: [0, 1, 2, 3, 4, 5, 6],
            events: [],
            firstInterval: 6
        }
    },
    methods: {
        intervalFormat(interval) {
            return interval.time
        }
    }
}
</script>