
export function getRandomPlusMinus() {
    return Math.random() < 0.5 ? -1 : 1;
  }

export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


export function hslToHexNumeric(h, s, l){
    return parseInt(hslToHex(h, s, l).substring(1), 16)
}

export function hslTextToHexNumeric(text){
    return parseInt(text.substring(1), 16)
}

export function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  export function normalizeDirection(deg){
    return ((deg % 360) + 360) % 360
  }
