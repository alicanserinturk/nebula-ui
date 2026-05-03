export default {
    dateToMilliseconds(date) {
        if (typeof date === 'undefined')
            date = "0"
        let parts = date.split(":");
        return (parseInt(parts[0]) * 60 * 60) + (parseInt(parts[1]) * 60) + parseInt(parts[2]);
    },
    millisecondToDate(milliseocond) {
        let hour = Math.floor(milliseocond / (60 * 60));
        let minute = Math.floor((milliseocond - (hour * 60 * 60)) / (60));
        let second = milliseocond - ((hour * 60 * 60) + (minute * 60));
        return this.pad(hour) + ':' + this.pad(minute) + ':' + this.pad(Math.floor(parseInt(second)));
    },
    pad(num, size = 2) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    },
    lightenDarkenColor(col, amt) {
        var usePound = false;

        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }

        var num = parseInt(col, 16);

        var r = (num >> 16) + amt;

        if (r > 255) r = 255;
        else if (r < 0) r = 0;

        var b = ((num >> 8) & 0x00ff) + amt;

        if (b > 255) b = 255;
        else if (b < 0) b = 0;

        var g = (num & 0x0000ff) + amt;

        if (g > 255) g = 255;
        else if (g < 0) g = 0;

        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
    },
}