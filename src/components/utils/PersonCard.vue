<template>
    <div
        v-ripple
        @click="handleClick"
        class="person-item">
        <v-img
            class="person-item_img elevation-1"
            :src="userImg || defaultImg" />
        <p 
            v-if="name"
            class="person-item__title">
            {{ name }}
        </p>

        <p 
            v-if="email"
            class="person-item__subtitle">
            {{ email }}
        </p>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            required: true,
            type: String
        },
        userImg: {
            required: false,
            default: undefined,
            type: [Buffer, String]
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    computed: {
        defaultImg() {
            return require("../../assets/images/default_user_img.png")
        }
    },
    methods: {
        handleClick() {
            this.$emit("click", { id: this.id })
        }
    }
}
</script>

<style lang="scss">
.person-item {
    width: 180px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.35s ease;

    &:hover {
        background-color: $bg-default;
    }

    .person-item_img {
        height: 100px;
        width: 100px;
        border-radius: 50%;
        margin: auto;
    }

    .person-item__title {
        color: $c-primary;
        margin-top: 10px;
        margin-bottom: 0;
        font-size: 14px;
        text-align: center;
    }

    .person-item__subtitle {
        color: $c-gray-3;
        font-size: 14px;
        text-align: center;
    }
}
</style>