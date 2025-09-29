import React, { useState, useEffect } from 'react';
import PlatformTaskManager from "pages/platformContent/platformTaskManager/platformTaskManager";
import PlatformAdminRating from "pages/platformContent/platformAdminRating/platformAdminRating";
import cls from "./platformAdminItem.module.sass";
import Radio from "components/platform/platformUI/radio/radio";

const studentsPage = [
    {
        name: "taskManager",
        label: "Task manager"
    },
    {
        name: "adminRanking",
        label: "Admin ranking"
    },
];

const PlatformAdminItem = () => {
    // 🔑 localStorage dan oxirgi tanlovni olish
    const savedRadio = localStorage.getItem("platformAdminRadio");

    const [selectRadio, setSelectRadio] = useState(savedRadio || studentsPage[0].name);

    // 🔑 har safar o‘zgarganda localStorage ga yozib qo‘yish
    useEffect(() => {
        localStorage.setItem("platformAdminRadio", selectRadio);
    }, [selectRadio]);

    const renderPage = () => {
        switch (selectRadio) {
            case "taskManager":
                return <PlatformTaskManager />;
            case "adminRanking":
                return <PlatformAdminRating />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className={cls.filters}>
                {studentsPage.map(item => (
                    <div key={item.name} className={cls.filters__item}>
                        <Radio
                            onChange={setSelectRadio}
                            checked={selectRadio === item.name}
                            name="studentsRadio"
                            value={item.name}
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
