module.exports.myFunc = function (condition) {
    console.log('before');
    if (condition) {
        process.exit(-1);
    }
    console.log('after');
}