export default {
    dateToMilliseconds(date) {
        if (date === undefined || date === null || date === '' || typeof date !== 'string') {
            return 0;
        }
        const parts = date.split(":");
        const h = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const s = parseInt(parts[2], 10);
        return (Number.isFinite(h) ? h * 3600 : 0)
            + (Number.isFinite(m) ? m * 60 : 0)
            + (Number.isFinite(s) ? s : 0);
    },
    millisecondToDate(milliseocond) {
        if (!Number.isFinite(milliseocond) || milliseocond < 0) {
            milliseocond = 0;
        }
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