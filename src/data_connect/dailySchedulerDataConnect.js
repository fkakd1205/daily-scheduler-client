import axios from "axios";

const API_SERVER_ADDRESS = "http://localhost:8081";

const dailySchedulerDataConnect = () => {
    return {
        createScheduleContent: async function (data) {
            return await axios.post(`${API_SERVER_ADDRESS}/api/v1/schedules`, data, {
                // TODO :: CORS 설정 후 추가하기
                // withCredentials: true
            });
        },
        searchScheduleInfoByDate: async function (startDate, endDate) {
            return await axios.get(`${API_SERVER_ADDRESS}/api/v1/schedules/date`, {
                params : {
                    startDate : startDate,
                    endDate: endDate
                }
            });
        },
        deleteSchedule: async function (scheduleId) {
            return await axios.delete(`${API_SERVER_ADDRESS}/api/v1/schedules/${scheduleId}`, {
            });
        },
        cancelCompletedSchedule: async function (data) {
            return await axios.patch(`${API_SERVER_ADDRESS}/api/v1/schedules/completed-cancel`, data, {
            });
        },
        updateScheduleList: async function (data) {
            return await axios.put(`${API_SERVER_ADDRESS}/api/v1/schedules/batch`, data, {
            });
        }
    }
}

export {
    dailySchedulerDataConnect   
}