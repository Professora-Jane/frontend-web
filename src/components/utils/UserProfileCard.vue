<template>
    <div>
        <img 
            class="header-profile-img"
            :src="userImg">
        <div>
            <p class="body-2 mb-0">
                {{ name }}
            </p>
            <p class="caption mb-0">
                {{ email }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        email: {
            type: String,
            required: false,
            default: ""
        },
        name: {
            type: String,
            required: true
        },
        userImg: {
            type: String,
            required: false,
            default: () => require("../../assets/images/default_user_img.png")
        }
    }
}
</script>

<style lang="scss">
.header-profile-img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
}

.header-list-item {
    cursor: pointer;
    transition: all 0.2s ease-out;

    &:hover {
        background: rgba(0, 0, 0, 0.1);
    }

    .v-list-item__title {
        line-height: 1.5;
    }
}
</style>