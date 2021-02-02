import { MenuComponent } from "./menu.component";

interface globalProps {
    hiScreen: boolean,
    coins: number,
    highScore: number,
    boughtSkins: Array<number>,
    activeSkin: number,
    options: {
        shadows: boolean,
        sound: boolean,
        antialiasing: boolean,
        volume: number,
        quality: number
    },
    menuComponent: any,
    alert: {
        state: boolean,
        actions: Array<{
            cb(): void,
            label: string
        }>,
        message: string
    },
    loadImg: Array<HTMLImageElement>,
    userName: string | undefined
}

export const globalProps: globalProps = {
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
    menuComponent: MenuComponent,
    alert: {
        state: false,
        actions: [{
            cb: () => {
                console.log('test');
            },
            label: 'test btn'
        }],
        message: 'Test message'
    },
    loadImg: [],
    userName: 'No Name'
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