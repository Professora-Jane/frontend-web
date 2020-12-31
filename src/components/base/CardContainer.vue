<template>
    <v-card 
        v-bind="{...$props, ...$attrs}"
        :id="$attrs['id']"
        class="card-container"
        elevation="2">
        <v-card-title
            class="card-container__title">
            <div>
                {{ pageTitle }}
            </div>
            <v-spacer />

            <slot name="header" />
        </v-card-title>

        <slot />
    </v-card>
</template>

<script>
export default {
    props: {
        pageTitle: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss">
.card-container {
    border-radius: 8px !important;

    .students-area {
        display: flex;
        flex-wrap: wrap;
    }

    .card-container__title {
        background-color: $bg-light !important;
    }
}
</style>