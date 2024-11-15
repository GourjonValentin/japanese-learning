<template>
    <div class="alphabet">
        <div class="tabs">
            <button :class="{ active: selectedTab === 'hiragana' }" @click="selectTab('hiragana')">Hiragana</button>
            <button :class="{ active: selectedTab === 'katakana' }" @click="selectTab('katakana')">Katakana</button>
            <span class="indicator"></span>
        </div>

        <div class="grid-letters">
            <div
                v-for="letter in alphabet"
                :key="letter"
                class="grid-letter"
                @mouseenter="setupMouseEffect($event)"
                @mouseleave="removeMouseEffect($event)">

                <div class="letter">
                    <img :src="require(`@/assets/alphabet/${selectedTab}/${letter}.png`)">
                    <div class="light"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { globalColors } from '../utils/GlobalVariable';

    export default {
        data() {
            return {
                alphabet: [
                    "a", "i", "u", "e", "o",         // あ, い, う, え, お
                    "ka", "ki", "ku", "ke", "ko",    // か, き, く, け, こ
                    "sa", "shi", "su", "se", "so",   // さ, し, す, せ, そ
                    "ta", "chi", "tsu", "te", "to",  // た, ち, つ, て, と
                    "na", "ni", "nu", "ne", "no",    // な, に, ぬ, ね, の
                    "ha", "hi", "fu", "he", "ho",    // は, ひ, ふ, へ, ほ
                    "ma", "mi", "mu", "me", "mo",    // ま, み, む, め, も
                    "ya", "emp", "yu", "emp", "yo",  // や, ゆ, よ
                    "ra", "ri", "ru", "re", "ro",    // ら, り, る, れ, ろ
                    "wa", "emp", "emp", "emp", "wo", // わ, を
                    "emp", "emp", "n", "emp", "emp"  // ん
                ],
                selectedTab: 'hiragana',
                globalColors: globalColors,
            }
        },
        methods: {
            selectTab(tab) {
                this.selectedTab = tab;
            },
            setupMouseEffect(event) {
                const gridLetter = event.currentTarget; // Selects the specific grid-letter being hovered
                const cardLetter = gridLetter.querySelector('.letter'); // Targets the letter inside the hovered grid-letter

                const rect = gridLetter.getBoundingClientRect();
                const { x, y, width, height } = rect;

                const mouseMove = (e) => {
                    const left = e.clientX - x;
                    const top = e.clientY - y;
                    const centerX = left - width / 2;
                    const centerY = top - height / 2;
                    const distance = Math.sqrt(centerX ** 2 + centerY ** 2);

                    cardLetter.style.boxShadow = `${-centerX / 5}px ${-centerY / 10}px 10px rgba(0, 0, 0, 0.2)`;
                    cardLetter.style.transform = `rotate3d(${-centerY / 80}, ${centerX / 80}, 0, ${distance / 5}deg) scale(1.05)`;
                    // light.style.backgroundImage = `radial-gradient(circle at ${left}px ${top}px, #00000040 5%, #ffffff00 20%, #ffffff99 30%)`;
                };

                gridLetter.addEventListener("mousemove", mouseMove);

                gridLetter.addEventListener("mouseleave", () => {
                    gridLetter.removeEventListener("mousemove", mouseMove);
                });
            },
            removeMouseEffect(event) {
                const cardLetter = event.currentTarget.querySelector('.letter');
                const light = event.currentTarget.querySelector('.light');

                cardLetter.style.boxShadow = '';
                cardLetter.style.transform = '';
                light.style.backgroundImage = '';
            },
        }
    };
</script>

<style scoped>
    .tabs {
        display: inline-flex;
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        margin: 20px 0 20px 0;
        width: 100%;
        max-width: 217px;
        background-color: v-bind('globalColors.lightColor');
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    }

    button {
        flex: 1;
        padding: 16px;
        font-size: 18px;
        border: none;
        background: transparent;
        position: relative;
        z-index: 2;
        cursor: pointer;
        color: v-bind('globalColors.darkColor');
        transition: color 0.3s;
    }

    button:hover {
        background-color: v-bind('globalColors.redColor');
    }

    .indicator {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 50%; /* Half the width of .tabs to cover one button */
        background-color: #c64f4f;
        z-index: 1;
        transition: left 0.3s ease;
    }

    .tabs button.active:nth-of-type(1) ~ .indicator {
        left: 0; /* Hiragana button */
    }

    .tabs button.active:nth-of-type(2) ~ .indicator {
        left: 50%; /* Katakana button */
    }

    .grid-letters{
        display: grid;
        grid-template-columns: repeat(5, auto); /* 5 columns, adjusting to content size */
        gap: 10px; /* Spacing between letters */
        justify-content: center; /* Center the grid in the container */
    }

    .grid-letter{
        width: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 200ms;
        
        &:hover { transform: scale3d(1.05, 1.05, 1.05); }
    }

    .letter{
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-color: v-bind('globalColors.lightColor');
        border-radius: 9px;
        box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
        position: relative;
        transition-duration: 250ms;
        transition-property: transform, box-shadow;
        transition-timing-function: ease-out;
    }

    /* .letter img{
        display: block;
        margin: auto;
    } */

    .light {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 9px;
    }
</style>