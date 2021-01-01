<template>
    <card-container
        id="room"
        page-title="Salas de aula">
        <template v-slot:header>
            <v-spacer />
            <button-with-tooltip
                large 
                bottom
                label="Salas de aula"
                btn-color="transparent"
                icon="mdi-calendar-plus" />
        </template>
        <div class="pa-3">
            <h2>Teste</h2>
        </div>
    </card-container>
</template>

<script>
import { mapState } from "vuex"
import CardContainer from "../../components/base/CardContainer.vue"
import ButtonWithTooltip from "../../components/utils/ButtonWithTooltip.vue"
import { socketHandlerInstance } from "../../websockets/socketHandler"

export default {
    components: {
        CardContainer,
        ButtonWithTooltip,
    },
    data() {
        return {
        }
    },
    computed: {
        ...mapState("authUser", [ 'id' ])
    },
    methods: {
        onReceivedMessage(content) {
            console.log("Recenbo conteúdo via listener")
            console.log(content)
            //this.$wsEmit('chat', { message: "olar" })
        }
    },
    created() {
        socketHandlerInstance.on('chat', this.onReceivedMessage)
    },
    mounted() {
        this.$wsEmit('connection', { id: this.id })

        setTimeout(() => this.$wsEmit('chat', { message: "olar" }), 3000)
    }
}
</script>

