<template>
    <notifications 
        class="notifications"
        v-on="$listeners"
        v-bind="{...$props, ...$attrs}"
        group="notification-with-options"  
        position="top right">
        <template 
            v-slot:body="{ item, close }">
            <div
                :class="item.type" 
                class="vue-notification">
                <div class="notification-title">
                    {{ item.title }}
                </div>
                <div class="notification-content">
                    <p>
                        {{ item.text.content }}
                    </p>
                    <div class="footer d-flex">
                        <v-btn
                            text
                            small
                            color="white"
                            @click="item.text.options.success.callback()">
                            {{ item.text.options.success.text }}
                        </v-btn>
                        <v-spacer />
                        <v-btn
                            text
                            small
                            color="white"
                            @click="item.text.options.close && item.text.options.close.callback && item.text.options.close.callback() || close()">
                            Fechar
                        </v-btn>
                    </div>
                </div>
            </div>
        </template>
    </notifications>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.notifications {
    .vue-notification {
        padding: 10px;
        margin: 0 5px 5px;
        
        font-size: 12px;
        
        color: #ffffff;
        background: #44A4FC;
        border-left: 5px solid #187FE7;
        
        &.warn {
            background: #ffb648 !important;
            border-left-color: #f48a06 !important;
        }
        
        &.error {
            background: #E54D42 !important;
            border-left-color: #B82E24 !important;
        }
        
        &.success {
            background: #68CD86 !important;
            border-left-color: #42A85F !important;
        }
    }
}
</style>