<template>
    <span v-if="count">{{ hours > 0 ? hours + ":" : "" }}{{ minutes }}:{{ seconds }}</span>
</template>

<script>
export default {
    props: {
        initTime: {
            required: false,
            type: String,
            default: ""
        },
        offSet: {
            type: Number,
            required: false,
            default: 0
        },
        initWithoutWatch: {
            type: Boolean,
            defaul: false,
            required: false
        }
    },
    data() {
        return {
            minutes: 0,
            seconds: 0,
            hours: 0,
            count: false,
            init: 0
        }
    },
    methods: {
        pad(val) {
            return val > 9 ? val : "0" + val;
        },

        updateTime() {
            this.seconds = this.pad(parseInt(++this.init%60));
            this.minutes = this.pad(parseInt(this.init/60,10)%60);
            this.hours = this.pad(parseInt(this.init/3600,10));
        },
        countTime() {
            this.updateTime()

            setInterval(() => {
                this.updateTime()
            }, 1000);
        },
        initCounter(val) {
            const initTime = Math.abs(new Date() - new Date(val))
            this.init = (initTime/1000) - (this.offSet * 60 * 60)
            this.countTime()
            this.count = true
        }
    },
    watch: {
        initTime: function(val) {
            if(val) {
                this.initCounter(val)
            }
            else {
                this.count = false
            }
        }
    },
    mounted() {
        if (this.initWithoutWatch)
            this.initCounter(this.initTime)
    }
}
</script>