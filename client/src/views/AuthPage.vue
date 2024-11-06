<template>
    <h1>Welcome to {{ title }}</h1>
    <p> auth page</p>
</template>

<script>
    import { globalTitle } from '@/utils/GlobalVariable';

    export default {
        data() {
            return {
                title: globalTitle
            };
        }
    };
</script>