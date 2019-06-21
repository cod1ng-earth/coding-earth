function pos(str, char) {
    let pos = 0
    const ret = []
    while ( (pos = str.indexOf(char, pos + 1)) !== -1) {
        ret.push(pos)
    }
    return ret
}

export default function truncate(str, len) {
    if (str.length < len)
        return str

    const allPos = [  ...pos(str, '!'), ...pos(str, '.'), ...pos(str, '?')].sort( (a,b) => a-b )
    if (allPos.length === 0) {
        return str.substr(0, len)
    }

    for(let i = 0; i < allPos.length; i++) {
        if (allPos[i] > len) {
            return str.substr(0, allPos[i-1] + 1)
        }
    }
}
