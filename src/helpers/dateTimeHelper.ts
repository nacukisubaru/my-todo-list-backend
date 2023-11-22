import * as moment from 'moment';
export const convertTimeStringToSeconds = (time: string = '00:00:00') => {
    var seconds = new Date('1970-01-01T' + time + 'Z').getTime() / 1000;
    return seconds;
}

export const convertSecoundsToTimeString = (time: number) => {
    var date = new Date(0);
    date.setSeconds(time);
    var timeString = date.toISOString().substring(11, 19);
    return timeString;
}


export const getTimePeriod = (start: string = '00:00:00', end: string = '00:00:05') => {
    var period = {
        start: `1970-01-01T${start}.000Z`,
        end: `1970-01-01T${end}.000Z`
    }
   
    var i = 1;
    var times = [];

    const diffSec = moment(period.end).diff(period.start, 'seconds');
    while (i < diffSec) {
        let seconds = convertTimeStringToSeconds(start) + i;
        times.push(convertSecoundsToTimeString(seconds));
        i = i + 1;
    }

    return times;
}