<template>
    <span v-if="count">{{ hours > 0 ? hours + ":" : "" }}{{ minutes }}:{{ seconds }}</span>
</template>

<script>
export default {
    props: {
        initTime: {
            required: false,
            type: Number,
            default: -1
        },
        offSet: {
            type: Number,
            required: false,
            default: 0
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
        countTime() {
            function pad ( val ) { return val > 9 ? val : "0" + val; }
            setInterval(() => {
                this.seconds = pad(parseInt(++this.init%60));
                this.minutes = pad(parseInt(this.init/60,10)%60);
                this.hours = pad(parseInt(this.init/3600,10));
            }, 1000);
        }
    },
    watch: {
        initTime: function(val) {
            if(val) {
                console.log(val)
                this.countTime()
                this.count = true
                this.init = (val/1000) - (this.offSet * 60 * 60)
            }
        }
    }
}
</script>