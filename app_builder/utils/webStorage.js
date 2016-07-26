
exports.saveLocal = function (to,data) {
    console.log(to)
    console.log(data)
    localStorage.setItem(to, JSON.stringify(data));
}

exports.getLocal = function (from) {
    return (JSON.parse(localStorage.getItem(from))) ? JSON.parse(localStorage.getItem(from)):[];
}
