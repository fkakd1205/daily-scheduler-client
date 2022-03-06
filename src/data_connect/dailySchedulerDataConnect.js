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
        searchSchduleInfo: async function () {
            return await axios.get(`${API_SERVER_ADDRESS}/api/v1/schedules`, {
                // TODO :: CORS 설정 후 추가하기
                // withCredentials: true
            });
        },
    }
}

export {
    dailySchedulerDataConnect   
}