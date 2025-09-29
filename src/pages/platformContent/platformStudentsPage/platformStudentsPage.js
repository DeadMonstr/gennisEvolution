import { useState, useEffect } from "react";
import PlatformNewStudents from "pages/platformContent/platformNewStudents/platformNewStudents";
import PlatformStudyingStudents from "pages/platformContent/platformStudyingStudents/platformStudyingStudents";
import PlatformDeletedGroupsStudents from "pages/platformContent/platformDeletedGroupStudents/platformDeletedGroupsStudents";

import cls from "./platformStudents.module.sass";
import Radio from "components/platform/platformUI/radio/radio";

const studentsPage = [
    {
        name: "newStudents",
        label: "New students",
    },
    {
        name: "studyingStudents",
        label: "Studying students",
    },
    {
        name: "deletedStudents",
        label: "Deleted students",
    },
];

const PlatformStudentsPage = () => {
    // 🔑 localStorage dan oxirgi tanlovni olish
    const savedRadio = localStorage.getItem("platformStudentsRadio");

    const [selectRadio, setSelectRadio] = useState(savedRadio || studentsPage[0].name);

    // 🔑 Tanlov o‘zgarganda localStorage ga yozib qo‘yish
    useEffect(() => {
        localStorage.setItem("platformStudentsRadio", selectRadio);
    }, [selectRadio]);

    const renderPage = () => {
        switch (selectRadio) {
            case "newStudents":
                return <PlatformNewStudents />;
            case "studyingStudents":
                return <PlatformStudyingStudents />;
            case "deletedStudents":
                return <PlatformDeletedGroupsStudents />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className={cls.filters}>
                {studentsPage.map((item) => (
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

export default PlatformStudentsPage;
