function trans(s, n){
    function handleWorld(s) {
        let code = s.charCodeAt()
        if (code >= 'a'.charCodeAt() && code <= 'z'.charCodeAt()) {
            return s.toUpperCase()
        } else {
            return s.toLowerCase()
        }
    }
    let arr = s.split(' ').reverse()
    return arr.map(item => {
        return item.split('').map(str => handleWorld(str)).join('')
    }).join(' ')
}

trans("This is a sample", 16)