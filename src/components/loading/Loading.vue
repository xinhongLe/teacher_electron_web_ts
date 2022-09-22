<template>
    <div class="loading-container" v-show="show">
        <div class="book">
            <div class="inner">
                <div class="left"></div>
                <div class="middle"></div>
                <div class="right"></div>
            </div>
            <ul>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        show: {
            type: Boolean
        }
    }
});
</script>

<style lang="scss" scoped>
.loading-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99999;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
}

.book {
    --color: #fff;
    --duration: 6.8s;
    width: 32px;
    height: 12px;
    position: relative;
    margin: 32px 0 0 0;
    //Demo
    zoom: 1.5;
    .inner {
        width: 32px;
        height: 12px;
        position: relative;
        transform-origin: 2px 2px;
        transform: rotateZ(-90deg);
        animation: book var(--duration) ease infinite;
        .left,
        .right {
            width: 60px;
            height: 4px;
            top: 0;
            border-radius: 2px;
            background: var(--color);
            position: absolute;
            &:before {
                content: "";
                width: 48px;
                height: 4px;
                border-radius: 2px;
                background: inherit;
                position: absolute;
                top: -10px;
                left: 6px;
            }
        }
        .left {
            right: 28px;
            transform-origin: 58px 2px;
            transform: rotateZ(90deg);
            animation: left var(--duration) ease infinite;
        }
        .right {
            left: 28px;
            transform-origin: 2px 2px;
            transform: rotateZ(-90deg);
            animation: right var(--duration) ease infinite;
        }
        .middle {
            width: 32px;
            height: 12px;
            border: 4px solid var(--color);
            border-top: 0;
            border-radius: 0 0 9px 9px;
            transform: translateY(2px);
        }
    }
    ul {
        margin: 0;
        padding: 0;
        list-style: none;
        position: absolute;
        left: 50%;
        top: 0;
        li {
            height: 4px;
            border-radius: 2px;
            transform-origin: 100% 2px;
            width: 44px;
            right: 0;
            top: -10px;
            position: absolute;
            background: var(--color);
            transform: rotateZ(0deg) translateX(-16px);
            animation-duration: var(--duration);
            animation-timing-function: ease;
            animation-iteration-count: infinite;
            $i: 0;
            @while $i < 19 {
                &:nth-child(#{$i}) {
                    animation-name: page-#{$i};
                }
                $i: $i + 1;
            }
        }
    }
}

$i: 0;
@for $i from 1 through 19 {
    $delay: $i * 1.86;
    $delay-after: $i * 1.74;
    @keyframes page-#{$i} {
        #{(4 + $delay) * 1%} {
            transform: rotateZ(0deg) translateX(-16px);
        }
        #{(13 + $delay-after) * 1%},
        #{(54 + $delay) * 1%} {
            transform: rotateZ(180deg) translateX(-16px);
        }
        #{(63 + $delay-after) * 1%} {
            transform: rotateZ(0deg) translateX(-16px);
        }
    }
}
@keyframes left {
    4% {
        transform: rotateZ(90deg);
    }
    10%,
    40% {
        transform: rotateZ(0deg);
    }
    46%,
    54% {
        transform: rotateZ(90deg);
    }
    60%,
    90% {
        transform: rotateZ(0deg);
    }
    96% {
        transform: rotateZ(90deg);
    }
}

@keyframes right {
    4% {
        transform: rotateZ(-90deg);
    }
    10%,
    40% {
        transform: rotateZ(0deg);
    }
    46%,
    54% {
        transform: rotateZ(-90deg);
    }
    60%,
    90% {
        transform: rotateZ(0deg);
    }
    96% {
        transform: rotateZ(-90deg);
    }
}

@keyframes book {
    4% {
        transform: rotateZ(-90deg);
    }
    10%,
    40% {
        transform: rotateZ(0deg);
        transform-origin: 2px 2px;
    }
    40.01%,
    59.99% {
        transform-origin: 30px 2px;
    }
    46%,
    54% {
        transform: rotateZ(90deg);
    }
    60%,
    90% {
        transform: rotateZ(0deg);
        transform-origin: 2px 2px;
    }
    96% {
        transform: rotateZ(-90deg);
    }
}
</style>
