module.exports = (number) => {
    switch (number) {
        case 0:
            return "text"

        case 1:
            return "dm"

        case 2:
            return "voice"

        case 3:
            return "groupDm"

        case 4:
            return "category"
        
        case 5:
            return "news"

        case 6:
            return "store"
    
        default:
            return "Invalid type"
    }
}