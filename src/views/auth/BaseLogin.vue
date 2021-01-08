<template>
    <v-main
        id="base-login"> 
        <v-fade-transition 
            mode="out-in">
            <router-view />
        </v-fade-transition>
    </v-main>
</template>

<style lang="scss">
#base-login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: $c-primary;
    background: linear-gradient(26deg, $c-primary_variant 0%, $bg-light 100%);

    .v-main__wrap {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>