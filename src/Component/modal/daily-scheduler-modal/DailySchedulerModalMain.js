import React, { useEffect, useReducer, useState } from "react";
import DailySchedulerModalBody from "./DailySchedulerModalBody";

export default function DailySchedulerModalMain(props) {
    const [scheduleInfoValueState, dispatchScheduleInfoValueState] = useReducer(scheduleInfoValueStateReducer, initialScheduleInfoValueState);
    const [scheduleEditValueState, dispatchScheduleEditValueState] = useReducer(scheduleEditValueStateReducer, initialScheduleEditValueState);
    const [scheduleSortingInfoState, dispatchScheduleSortingInfoState] = useReducer(scheduleSortingInfoReducer, initialScheduleSortingInfo);

    const [completedScheduleInfoList, setCompletedScheduleInfoList] = useState([]);
    const [checkedScheduleInfoList, setCheckedScheduleInfoList] = useState([]);

    useEffect(() => {
        async function getInitData() {
            await props.searchDailySchedulerCategoryControl();
            await props.searchScheduleInfoControl();

            // 기본 카테고리 select 선택
            dispatchScheduleSortingInfoState({
                type: 'INIT_DATA'
            });
        }

        getInitData();
    }, [])

    useEffect(() => {
        function initSchedule() {
            if(!props.scheduleInfo) {
                return;
            }

            dispatchScheduleEditValueState({
                type: 'INIT_DATA',
                payload: props.scheduleInfo
            });
        }
        initSchedule();
    }, [props.scheduleInfo]);

    useEffect(() => {
        function getCompletedSchedule() {
            if(!props.scheduleInfo) {
                return;
            }
            
            let completedIdList = props.scheduleInfo.filter(r => r.completed).map(r => r.id);
            if(completedIdList) {
                setCompletedScheduleInfoList(completedIdList);
                setCheckedScheduleInfoList(completedIdList);
            }
        }

        getCompletedSchedule();
    }, [props.scheduleInfo]);

    // 선택된 카테고리로 스케쥴 조회
    useEffect(() => {
        function changeSort() {
            if(!(scheduleSortingInfoState && props.scheduleInfo)) {
                return;
            }

            viewSelectControl().changeViewData();
        }
        changeSort();
    }, [scheduleSortingInfoState, props.scheduleInfo])

    const onCloseModal = (e) => {
        e.preventDefault();
        props.onClose();
    }
    
    const onChangeScheduleInfoValue = (e) => {
        e.preventDefault();

        dispatchScheduleInfoValueState({
            type: 'SET_DATA',
            payload: {
                name : e.target.name,
                value : e.target.value
            }
        });
    }

    const scheduleSubmit = async (e) => {
        e.preventDefault();

        if(!scheduleInfoValueState.categoryId){
            alert('카테고리를 선택해주세요.')
            return;
        }

        await props.scheduleInfoSubmitControl(scheduleInfoValueState);

        dispatchScheduleInfoValueState({
            type: 'CLEAR'
        });
    }

    const convertCategoryName = (categoryId) => {
        return props.dailySchedulerCategory?.filter(r => r.id === categoryId)[0].name;
    }

    const scheduleStatusControl = () => {
        return {
            isChecked: function (scheduleId) {
                return checkedScheduleInfoList?.includes(scheduleId);
            },
            isCompleted: function (scheduleId) {
                return completedScheduleInfoList?.includes(scheduleId);
            },
            checkOne: function (e, scheduleId) {
                if(e.target.checked) {
                    setCheckedScheduleInfoList(checkedScheduleInfoList.concat(scheduleId));

                    let newData = scheduleEditValueState?.map(r => {
                        if(r.id === scheduleId){
                            r.completed = true;
                        }
                        return r;
                    });

                    dispatchScheduleEditValueState({
                        type: 'SET_DATA',
                        payload: newData
                    });

                } else {
                    setCheckedScheduleInfoList(checkedScheduleInfoList.filter(r => r !== scheduleId));

                    let newData = scheduleEditValueState?.map(r => {
                        if(r.id === scheduleId){
                            r.completed = false;
                        }
                        return r;
                    });


                    dispatchScheduleEditValueState({
                        type: 'SET_DATA',
                        payload: newData
                    });
                }
            },
            cancelOne: async function (scheduleId) {
                if (window.confirm('정말 취소하시겠습니까?')) {
                    let data = {
                        id: scheduleId,
                        completed: false
                    }
                    await props.changeScheduleDataControl(data);
                }
            }
        }
    }

    const scheduleEditControl = () => {
        return {
            onChangeInputValue: function(e, scheduleId) {

                let newData = scheduleEditValueState?.map(r => {
                    if(r.id === scheduleId){
                        r = {
                            ...r,
                            [e.target.name] : e.target.value
                        }
                    }
                    
                    return r;
                });

                dispatchScheduleEditValueState({
                    type : 'SET_DATA',
                    payload: newData
                });
            }
        }
    }

    const viewSelectControl = () => {
        return {
            onChangeCategoryValue: function (e) {
                let target = e.target.value;

                dispatchScheduleSortingInfoState({
                    type: 'SET_DATA',
                    payload: {
                        categoryId: target
                    }
                });
            },
            onChangeCompletedValue: function (e) {
                let target = e.target.value;

                dispatchScheduleSortingInfoState({
                    type: 'SET_DATA',
                    payload: {
                        completed: target
                    }
                });
            },
            changeViewData: function () {
                let newData = props.scheduleInfo;

                if(scheduleSortingInfoState?.categoryId !== 'total') {
                    newData = newData?.filter(r => r.categoryId === scheduleSortingInfoState?.categoryId);
                }

                if(scheduleSortingInfoState?.completed !== 'total') {
                    newData = newData?.filter(r => JSON.parse(scheduleSortingInfoState.completed) === r.completed);
                }

                dispatchScheduleEditValueState({
                    type: 'INIT_DATA',
                    payload: newData
                });
            }
        }
    }

    const scheduleContentDelete = async (e, sheduleId) => {
        e.preventDefault();

        if(window.confirm('정말 삭제하시겠습니다?')){
            await props.scheduleDeleteControl(sheduleId);
        }
    }

    const updateSchedule = async (e) => {
        e.preventDefault();

        if(!scheduleEditValueState.length) {
            alert('변경된 데이터가 없습니다!');
            return;
        }

        await props.updateScheduleDataControl(scheduleEditValueState);
    }

    return (
        <>
            <DailySchedulerModalBody
                selectedDateState={props.selectedDateState}
                dateInfoState={props.dateInfoState}
                dailySchedulerCategory={props.dailySchedulerCategory}

                scheduleInfoValueState={scheduleInfoValueState}
                scheduleEditValueState={scheduleEditValueState}
                scheduleSortingInfoState={scheduleSortingInfoState}

                scheduleSubmit={scheduleSubmit}
                onCloseModal={onCloseModal}
                onChangeScheduleInfoValue={onChangeScheduleInfoValue}
                updateSchedule={updateSchedule}
                viewSelectControl={viewSelectControl}
                convertCategoryName={convertCategoryName}
                scheduleStatusControl={scheduleStatusControl}
                scheduleEditControl={scheduleEditControl}
                scheduleContentDelete={scheduleContentDelete}
            />
        </>
    )    
}

const initialScheduleInfoValueState = null;
const initialScheduleEditValueState = null;
const initialScheduleSortingInfo = null;

const scheduleInfoValueStateReducer =  (state, action) => {
    switch (action.type) {
        case 'INIT_DATA': 
            return action.payload;
        case 'SET_DATA': 
            return {
                ...state,
                [action.payload.name] : action.payload.value
            }
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

const scheduleEditValueStateReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA': 
            return action.payload;
        case 'SET_DATA': 
            return action.payload;
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

const scheduleSortingInfoReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return {
                ...state,
                categoryId: 'total',
                completed: 'total'
            }
        case 'SET_DATA':
            return {
                ...state,
                categoryId: action.payload.categoryId ?? state.categoryId,
                completed: action.payload.completed ?? state.completed
            }
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}