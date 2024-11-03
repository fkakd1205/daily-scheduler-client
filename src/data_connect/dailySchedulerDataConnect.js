import axios from "axios";

const API_SERVER_ADDRESS = "http://localhost:8081";

const dailySchedulerDataConnect = () => {
    return {
        createScheduleContent: async function (data) {
            return await axios.post(`${API_SERVER_ADDRESS}/api/v1/schedules`, data, {
                // TODO :: CORS 설정 후 추가하기
                withCredentials: true
            });
        },
        searchScheduleInfoByDate: async function (startDate, endDate) {
            return await axios.get(`${API_SERVER_ADDRESS}/api/v1/schedules/date`, {
                params : {
                    startDate : startDate,
                    endDate: endDate
                },
                withCredentials: true
            });
        },
        deleteSchedule: async function (scheduleId) {
            return await axios.delete(`${API_SERVER_ADDRESS}/api/v1/schedules/${scheduleId}`, {
                withCredentials: true
            });
        },
        updateCompletedSchedule: async function (data) {
            return await axios.patch(`${API_SERVER_ADDRESS}/api/v1/schedules/completed`, data, {
                withCredentials: true
            });
        },
        updateScheduleList: async function (data) {
            return await axios.put(`${API_SERVER_ADDRESS}/api/v1/schedules/batch`, data, {
                withCredentials: true
            });
        },
        searchScheduleSummaryByDate: async function (startDate, endDate) {
            return await axios.get(`${API_SERVER_ADDRESS}/api/v1/schedules/summary`, {
                params : {
                    startDate : startDate,
                    endDate: endDate
                },
                withCredentials: true
            });
        },
    }
}

export {
    dailySchedulerDataConnect   
}