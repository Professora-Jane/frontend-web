<template>
    <div
        v-ripple
        @click="handleStudent"
        class="student-item">
        <v-img
            class="student-item_img elevation-1"
            :src="defaultImg" />
        <p class="student-item__title">
            {{ name }}
        </p>

        <p class="student-item__subtitle">
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
        handleStudent() {
            this.$emit("click", { id: this.id })
        }
    }
}
</script>

<style lang="scss">
.student-item {
    width: 180px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.35s ease;

    &:hover {
        background-color: $bg-default;
    }

    .student-item_img {
        height: 100px;
        width: 100px;
        border-radius: 50%;
        margin: auto;
    }

    .student-item__title {
        color: $c-primary;
        margin-top: 10px;
        margin-bottom: 0;
        font-size: 14px;
        text-align: center;
    }

    .student-item__subtitle {
        color: $c-gray-3;
        font-size: 14px;
        text-align: center;
    }
}
</style>