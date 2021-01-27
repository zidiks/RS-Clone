import { MenuComponent } from "./menu.component";

export const globalProps = {
    hiScreen: false,
    coins: 0,
    highScore: 0,
    boughtSkins: [0],
    activeSkin: 0,
    options: {
        shadows: false,
        sound: false,
        antialiasing: false,
        volume: 1,
        quality: 1
    },
    menuComponent: MenuComponent
}

const options = localStorage.getItem('options');
if (options !== null) {
    globalProps.options = JSON.parse(options);
    console.log(globalProps.options);
} else {
    globalProps.options = {
        shadows: false,
        sound: false,
        antialiasing: false,
        volume: 1,
        quality: 1
    }
    localStorage.setItem('options', JSON.stringify(globalProps.options));
}

export const saveOptions = () => {
    localStorage.setItem('options', JSON.stringify(globalProps.options));
}