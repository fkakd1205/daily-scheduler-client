import moment from 'moment';

function dateToYYYYMMDDhhmm(date) {
    var changeDate = new Date(date);
    return moment(changeDate).format("YYYY.MM.DD HH:mm");
}

function dateToYYYYMMDD(date) {
    var changeDate = new Date(date);
    return moment(changeDate).format("YYYY.MM.DD");
}

export {
    dateToYYYYMMDDhhmm,
    dateToYYYYMMDD
}