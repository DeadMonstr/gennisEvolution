import PlatformNewStudents from "pages/platformContent/platformNewStudents/platformNewStudents";

// import "./platformStudents.sass"
import Radio from "components/platform/platformUI/radio/radio";
import {useEffect, useState} from "react";
import PlatformStudyingStudents from "pages/platformContent/platformStudyingStudents/platformStudyingStudents";
import PlatformDeletedGroupsStudents
    from "pages/platformContent/platformDeletedGroupStudents/platformDeletedGroupsStudents";
import {useLocation} from "react-router-dom";
import cls from "pages/platformContent/platformUsersPage/platformUsersPage.module.sass";

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
    const location = useLocation(); // 👈

    const [selectRadio, setSelectRadio] = useState(
        localStorage.getItem("selectedStudentTab") || studentsPage[0].name
    );


    useEffect(() => {
        localStorage.setItem("selectedStudentTab", selectRadio);
    }, [selectRadio]);
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
    const isProfilePage = location.pathname.includes("profile");
    return (
        <>
            {!isProfilePage && (
                <div className={cls.filters}>
                    {studentsPage.map((item) => (
                        <div className={cls.filters__item} key={item.name}>
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
            )}
            {renderPage()}

        </>
    );
};

export default PlatformStudentsPage;