<template>
    <div 
        class="paginated-data-table">
        <v-overlay
            :value="!canRender || loading"
            absolute>
            <v-progress-circular
                indeterminate />
        </v-overlay>
        <v-data-table
            v-on="$listeners"
            @update:sort-by="updateSortBy"
            @update:sort-desc="updateSort"
            hide-default-footer
            :items-per-page="limit"
            :disable-sort="!enableSort"
            :headers="header.length && header || customHeader"
            :items="items"
            v-if="canRender">
            <template 
                v-for="(_, slot) of $scopedSlots"
                v-slot:[slot]="scope">
                <slot 
                    :name="slot" 
                    v-bind="scope" />
            </template>
        </v-data-table>
        <slot name="footer">
            <div class="d-flex">
                <v-text-field
                    @click:clear="clearAndSearch"
                    @keydown.enter="getItems"
                    v-model="search"
                    :label="searchLabel"
                    placeholder="Insira o termo de busca e aperte enter"
                    clearable />
                <v-spacer />
                <v-pagination
                    v-model="page"
                    :length="maxPages"
                    @input="getItems" />
                <v-spacer />
                <v-select
                    class="itens-per-page"
                    v-model="limit"
                    :items="itemsPerPage"
                    @change="updateLimit"
                    label="Items por página" />
            </div>
        </slot>
    </div>
</template>

<script>
export default {
    props: {
        getItemsFunction: {
            type: Function,
            required: true
        },
        header: {
            type: Array,
            required: false,
            default: () => []
        },
        initialPage: {
            type: Number,
            required: false,
            default: 1
        },
        enableSort: {
            type: Boolean,
            required: false,
            default: true
        },
        initialLimit: {
            type: Number,
            required: false,
            default: 20
        },
        excludedHeaders: {
            type: Array,
            required: false,
            default: () => []
        },
        itemsPerPage: {
            type: Array,
            required: false,
            default: () => [ 5, 10, 20, 50 ]
        },
        searchLabel: {
            type: String,
            required: false,
            default: "Buscar item"
        }
    },
    data() {
        return {
            items: [],
            customHeader: [],
            excludedHeadersLocal: [ "__v", "_id" ],
            canRender: false,
            initialArgs: {},
            page: undefined,
            limit: undefined,
            maxPages: 1,
            loading: false,
            sort: "",
            sortType: 0,
            search: ""
        }
    },
    methods: {
        async getItems() {
            this.loading = true
            const args = {
                ...this.initialArgs,
                page: this.page,
                limit: this.limit,
                ...(!!this.sort && { sort: this.sort }),
                ...(!!this.sortType && { sortType: this.sortType }),
                ...(!!this.search && { search: this.search }),
            }

            try {
                const response = await this.getItemsFunction(args)

                this.items = response.data.items
                this.maxPages = response.data.totalPages

                this.customHeader = this.customHeader.length && this.customHeader ||
                    Object
                        .keys(this.items[0])
                        .filter(item => !this.excludedHeadersLocal.includes(item))
                        .filter(item => !this.excludedHeaders.includes(item))
                        .map(item => {
                            return {
                                text: item.charAt(0).toUpperCase() + item.slice(1),
                                value: item
                            }
                        })
            }
            catch (error) {
                this.$emit("error", error)
            }
            this.loading = false
        },
        setInitialArgs(args) {
            this.page = this.initialPage 
            this.limit = this.initialLimit

            this.initialArgs = args
            return this 
        },
        async clearAndSearch() {
            this.search = ""
            await this.getItems()
        },
        updateSortBy(key) {
            if (this.enableSort && key[0])
                this.sort = key[0] 
        },
        async updateLimit(value) {
            this.limit = value
            this.page = 1
            await this.getItems()
        },
        async updateSort(value) {
            if (this.enableSort && value[0] === true) {
                this.sortType = -1
                await this.getItems()
            }
            else if (this.enableSort && value[0] === false) {
                this.sortType = 1
                await this.getItems()
            }
        },
        async init() {
            await this.getItems()
            this.canRender = true
        }
    },
}
</script>

<style lang="scss">
.paginated-data-table {
    position: relative;

    .itens-per-page {
        max-width: 200px;
    }
}
</style>