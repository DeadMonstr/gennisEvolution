import PlatformNewStudents from "pages/platformContent/platformNewStudents/platformNewStudents";

import cls from "./platformUsersPage.module.sass"
import Radio from "components/platform/platformUI/radio/radio";
import {useState} from "react";
import PlatformStudyingStudents from "pages/platformContent/platformStudyingStudents/platformStudyingStudents";
import PlatformDeletedGroupsStudents
    from "pages/platformContent/platformDeletedGroupStudents/platformDeletedGroupsStudents";
import PlatformEmployees from "pages/platformContent/platformEmployees/platformEmployees";
import PlatformTeachers from "pages/platformContent/platformCurrentLocTeachers/platformTeachers";
import PlatformParentsList from "pages/platformContent/platformParentsList/platformParentsList";

const studentsPage = [
    {
        name: "workers",
        label: "Ishchilar"
    },
    {
        name: "teachers",
        label: "O'qituvchilar"
    },
    {
        name: "parents",
        label: "Ota-onalar"
    },

]

const PlatformUsersPage = () => {

    const [selectRadio , setSelectRadio] = useState(studentsPage[0].name)

    const renderPage = () => {
        switch (selectRadio) {
            case "workers" :
                return   <PlatformEmployees/>
            case "teachers":
                return <PlatformTeachers/>
            case "parents" :
                return <PlatformParentsList/>
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

export default PlatformUsersPage;