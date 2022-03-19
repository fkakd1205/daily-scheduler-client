import moment from 'moment';

function dateToYYYYMMDDhhmm(date) {
    var changeDate = new Date(date);
    return moment(changeDate).format("YYYY.MM.DD HH:mm");
}

function dateToYYYYMMDD(date) {
    var changeDate = new Date(date);
    return moment(changeDate).format("YYYY.MM.DD");
}

function getStartDate(date) {
    var startDate = new Date(date);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    return dateToYYYYMMDDhhmm(startDate);
}

function getEndDate(date) {
    var endDate = new Date(date);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    return dateToYYYYMMDDhhmm(endDate);

}

export {
    dateToYYYYMMDDhhmm,
    dateToYYYYMMDD,
    getStartDate,
    getEndDate
}