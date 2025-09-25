import PlatformNewStudents from "pages/platformContent/platformNewStudents/platformNewStudents";

import cls from "./platformStudents.module.sass"
import Radio from "components/platform/platformUI/radio/radio";
import {useState} from "react";
import PlatformStudyingStudents from "pages/platformContent/platformStudyingStudents/platformStudyingStudents";
import PlatformDeletedGroupsStudents
    from "pages/platformContent/platformDeletedGroupStudents/platformDeletedGroupsStudents";

const studentsPage = [
    {
        name: "newStudents",
        label: "New students"
    },
    {
        name: "studyingStudents",
        label: "Studying students"
    },
    {
        name: "deletedStudents",
        label: "Deleted students"
    },

]

const PlatformStudentsPage = () => {

    const [selectRadio , setSelectRadio] = useState(studentsPage[0].name)

    const renderPage = () => {
        switch (selectRadio) {
            case "newStudents" :
                return   <PlatformNewStudents/>
            case "studyingStudents":
                return <PlatformStudyingStudents/>
            case "deletedStudents" :
                return <PlatformDeletedGroupsStudents/>
        }
    }

    console.log(renderPage())
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

export default PlatformStudentsPage;