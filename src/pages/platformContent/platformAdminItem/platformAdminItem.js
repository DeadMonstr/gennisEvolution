import React, {useState} from 'react';
import PlatformEmployees from "pages/platformContent/platformEmployees/platformEmployees";
import PlatformTeachers from "pages/platformContent/platformCurrentLocTeachers/platformTeachers";
import PlatformParentsList from "pages/platformContent/platformParentsList/platformParentsList";
import cls from "./platformAdminItem.module.sass";
import Radio from "components/platform/platformUI/radio/radio";
import PlatformTaskManager from "pages/platformContent/platformTaskManager/platformTaskManager";
import PlatformAdminRating from "pages/platformContent/platformAdminRating/platformAdminRating";
const studentsPage = [
    {
        name: "taskManager",
        label: "Task manager"
    },
    {
        name: "adminRanking",
        label: "Admin ranting"
    },
]
const PlatformAdminItem = () => {

    const [selectRadio , setSelectRadio] = useState(studentsPage[0].name)

    const renderPage = () => {
        switch (selectRadio) {
            case "taskManager" :
                return   <PlatformTaskManager/>
            case "adminRanking":
                return <PlatformAdminRating/>
        }
    }


    return (
        <>
            <div className={cls.filters}>
                {studentsPage.map(item => (
                    <div className={cls.filters__item}>
                        <Radio
                            onChange={setSelectRadio}
                            checked={selectRadio === item.name}
                            name="studentsRadio"   // 🔑 hammasi bitta guruhda
                            value={item.name}      // 🔑 qaysi radio bosilgani
                        >
                            {item.label}
                        </Radio>

                    </div>
                ))}
            </div>
            {renderPage()}

        </>
    );
};

export default PlatformAdminItem;