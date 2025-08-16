export const GetCSharpDateType = (date: Date) => {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var secondfloat = date.getMilliseconds();
    return year + "-" + month + "-" + day + " " + hour + ':' + minute + ':' + second + '.' + secondfloat;
}
