import axios from "axios";

const API_SERVER_ADDRESS = "http://localhost:8081";

const dailySchedulerCategoryDataConnect = () => {
    return {
        searchDailySchedulerCategory: async function () {
            return await axios.get(`${API_SERVER_ADDRESS}/api/v1/schedule-categories`, {
                // TODO :: CORS 설정 후 추가하기
                // withCredentials: true
            });
        }
    }
}

export {
    dailySchedulerCategoryDataConnect   
}