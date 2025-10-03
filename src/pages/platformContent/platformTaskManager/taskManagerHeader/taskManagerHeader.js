import React, {useState} from 'react';
import cls from '../platformTaskManager.module.sass'
import PlatformSearch from "../../../../components/platform/platformUI/search";
import switchCompletedBtn from "../../../../assets/icons/progress.svg";
import switchXButton from "../../../../assets/icons/bx_task-x.svg";

const SwitchButton = ({isCompleted, setIsCompleted, setSearchValue}) => {


    return (
        <div className={cls.switchBox}>
            <div className={`${cls.switch} ${isCompleted ? `${cls.completed}` : `${cls.inProgress} `}`}
                 onClick={() => {
                     setIsCompleted(!isCompleted)
                     setSearchValue("")
                 }}>
                <div className={cls.iconButton}>
                    {isCompleted ?
                        <div className={cls.icon__handlerSucces}>
                            <img className={cls.buttonIcon} src={switchCompletedBtn} alt=""/>
                        </div>
                        :
                        <div className={cls.icon__handler}>
                            <img src={switchXButton} className={cls.buttonIcon} alt=""/>
                        </div>
                    }
                </div>
                <span className={cls.textContent}>
                     {isCompleted ? (
                         <h1 className={cls.textContentSucces}>Completed</h1>
                     ) : (
                         <h1 className={cls.textContent}>In Progress</h1>
                     )}
                  </span>

            </div>
        </div>
    );
};

export const TaskManagerHeader = ({searchValue, setSearchValue, isCompleted, setIsCompleted}) => {

    return (
        <div style={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <PlatformSearch search={searchValue} setSearch={setSearchValue}/>
            <SwitchButton setSearchValue={setSearchValue} isCompleted={isCompleted} setIsCompleted={setIsCompleted} />
        </div>
    );

};

