import { useEffect, useState, useRef, useCallback } from "react"
import { motion, useDragControls, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
    PhoneIcon,
    SearchIcon,
} from "lucide-react"
import Calendar from "react-calendar";
import classNames from "classnames";

import {
    callStart,
    fetchCompletedDebtorsData,
    fetchCompletedLeadsData,
    fetchCompletedNewStudentsTaskData,
    fetchDebtorsData,
    fetchLeadsData,
    fetchNewStudentsTaskData,
    onChangeProgress,
    onDelDebtors,
    onDelLeads
} from "slices/taskManagerSlice"
import { BackUrl, formatDate, headers } from "constants/global";
import { useHttp } from "hooks/http.hook";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import Table from "components/platform/platformUI/table";
import Modal from "components/platform/platformUI/modal";
import Input from "components/platform/platformUI/input";
import Button from "components/platform/platformUI/button";

import styles from "./newTaskManager.module.sass"
import { setMessage } from "slices/messageSlice";

const NewTaskManager = () => {

    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { locationId } = useParams()
    const { request } = useHttp()

    const {
        unCompleted,
        completed,
        completedDebtorStudent,
        progress,
        progressStatus,
        allProgress,
        isTable,
        unCompletedStatus,
        completedStatus,
        profile,
        callId,
        callState,
        callStatus,
        audioId
    } = useSelector(state => state.taskManager)

    const [activeColorList, setActiveColorList] = useState([])
    const [activeCategory, setActiveCategory] = useState("debtors")
    const [isCompleted, setIsCompleted] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11))
    const [date, setDate] = useState(new Date())
    const [data, setData] = useState([])


    const [selectedAudioId, setSelectedAudioId] = useState({ id: null, state: null })
    const [isCall, setIsCall] = useState(false)
    const [audioCom, setAudioCom] = useState(null)
    const [audioDate, setAudioDate] = useState(null)

    const [isSelectPhone, setIsSelectPhone] = useState(false)
    const [phonesList, setPhonesList] = useState([])
    const [isSelectedStudent, setIsSelectedStudent] = useState(null)
    const [selectedPhone, setSelectedPhone] = useState(null)


    useEffect(() => {
        if (!locationId && !date) return;

        const formatted = formatDate(date)

        if (isCompleted) {
            switch (activeCategory) {
                case "debtors":
                    dispatch(fetchCompletedDebtorsData({ locationId, date: formatted }))
                    break;
                case "newStudents":
                    dispatch(fetchCompletedNewStudentsTaskData({ locationId, date: formatted }))
                    break;
                case "leads":
                    dispatch(fetchCompletedLeadsData({ locationId, date: formatted }))
                    break;
            }
        } else {
            switch (activeCategory) {
                case "debtors":
                    dispatch(fetchDebtorsData({ locationId, date: formatted }))
                    break;
                case "newStudents":
                    dispatch(fetchNewStudentsTaskData({ locationId, date: formatted }))
                    break;
                case "leads":
                    dispatch(fetchLeadsData({ locationId, date: formatted }))
                    break;


            }
        }
    }, [activeCategory, locationId, date, isCompleted])

    useEffect(() => {
        if (!locationId && !date) return;


        if (isCompleted) {
            switch (activeCategory) {
                case "debtors":
                    setData(completed.debtors)
                    break;
                case "newStudents":
                    setData(completed.students)
                    break;
                case "leads":
                    setData(completed.leads)
                    break;


            }
        } else {
            switch (activeCategory) {
                case "debtors":
                    setData(unCompleted.debtors)
                    break;
                case "newStudents":
                    setData(unCompleted.students)
                    break;
                case "leads":
                    setData(unCompleted.leads)
                    break;
            }
        }


    }, [
        unCompleted.debtors,
        unCompleted.students,
        unCompleted.leads,
        completed.debtors,
        completed.students,
        completed.leads,
    ])

    useEffect(() => {
        if (!callId) return;

        let isActive = true;
        let timeoutId = null;

        setIsCall(true);

        const poll = async () => {
            if (!isActive && callStatus === "loading") return;

            try {
                const response = await request(
                    `${BackUrl}task_leads/call-status/${callId}`,
                    "GET",
                    null,
                    headers()
                );

                // setSelectedAudioId(prev => ({ ...prev, state: response?.state }))

                // ❗ проверка состояния
                if (response?.state === "SUCCESS") {
                    if (response.result.success) {
                        let result;
                        if (activeCategory === "leads") {
                            result = {
                                audioId: response.result.lead_info_id,
                                callId: null,
                                callStatus: "success",
                                callState: "success"
                            }
                        } else {
                            result = {
                                audioId: response.result.audio_record_id,
                                callId: null,
                                callStatus: "success",
                                callState: "success"
                            }
                        }
                        dispatch(callStart(result))
                    } else {
                        dispatch(callStart({
                            callId: null,
                            callStatus: "success",
                            callState: "error"
                        }))
                    }
                    // setIsCall(false);
                    // setSelectedAudioId(prev => ({ ...prev, state: response?.state, lead_id: response?.result?.lead_info_id }))
                    isActive = false; // останавливаем polling
                    return;
                }

                // продолжаем polling
                timeoutId = setTimeout(poll, 5000);

            } catch (error) {
                console.error(error);
                timeoutId = setTimeout(poll, 5000);
            }
        };

        poll();

        return () => {
            isActive = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [callId]);


    const onSubmit = () => {

        console.log("hello")

        let post;
        let postURL;
        if (activeCategory === "leads") {
            postURL = `task_leads/task_leads_update/${audioId}`
            post = {
                comment: audioCom,
                date: audioDate,
            }
        } else if (activeCategory === "debtors") {
            postURL = "task_debts/call_to_debts"
            post = {
                excuse_id: audioId,
                phone: selectedPhone,
                comment: audioCom,
                date: audioDate,
            }
        } else {
            postURL = "task_new_students/call_to_new_students"
            post = {
                excuse_id: audioId,
                phone: selectedPhone,
                comment: audioCom,
                date: audioDate,
            }
        }

        request(`${BackUrl}${postURL}`, "POST", JSON.stringify(post), headers())
            .then(res => {
                console.log(res)
                if (activeCategory === "leads") {
                    dispatch(onDelLeads({ id: res?.lead_id }))
                } else {
                    dispatch(onDelDebtors({ id: post.id }))
                }
                dispatch(onChangeProgress({
                    progress: res.task_statistics,
                    allProgress: res.task_daily_statistics
                }))
                dispatch(setMessage({
                    msg: activeCategory === "leads" ? res.msg : res.message,
                    type: "success",
                    active: true
                }))
                setIsCall(false)
                dispatch(callStart({
                    audioId: null,
                    callId: null,
                    callStatus: "idle",
                    callState: "idle"
                }))
            })
            .catch(err => console.log(err))

    }


    const calcLengthData = useCallback((type, isCompleted) => {
        if (isCompleted) {
            switch (type) {
                case "debtors":
                    return completed.debtors.length;
                case "newStudents":
                    return completed.students.length;
                case "leads":
                    return completed.leads.length;
            }
        } else {
            switch (type) {
                case "debtors":
                    return unCompleted.debtors.length;
                case "newStudents":
                    return unCompleted.students.length;
                case "leads":
                    return unCompleted.leads.length;
            }
        }
    }, [
        unCompleted.debtors.length,
        unCompleted.students.length,
        unCompleted.leads.length,
        completed.debtors.length,
        completed.students.length,
        completed.leads.length,
    ])


    const getVisibleData = () => {
        const filtered = data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

        if (activeCategory === "completed") {
            return filtered.filter(
                (item) => item.category !== "lead" && item.category !== "debtors" && item.category !== "newStudents",
            )
        }

        return filtered
    }

    const getCardColor = (student) => {
        if (activeCategory === "debtors") {
            return (student.debt || 0) > 200000 ? "red" : "yellow"
        }
        if (activeCategory === "newStudents") {
            if (student.moneyType === "green") return "green"
            if (student.moneyType === "yellow") return "yellow"
            if (student.moneyType === "red") return "red"
            return "gray"
        }
        if (activeCategory === "lead") {
            return "red"
        }
        return "gray"
    }

    const sortedData = getVisibleData()

    const onCall = (id, phone) => {
        let post;
        let postURL;
        if (activeCategory === "leads") {
            postURL = "task_leads/call-to-lead"
            post = { lead_id: id }
        } else if (activeCategory === "debtors") {
            postURL = "task_debts/call_to_debt"
            post = { student_id: id, phone: "901101664" }
        } else {
            postURL = "task_new_students/call_to_new_student"
            post = { student_id: id, phone: "901101664" }
        }
        request(`${BackUrl}${postURL}`, "POST", JSON.stringify(post), headers())
            .then(res => {
                console.log(res)
                dispatch(callStart({
                    callId: res.task_id,
                    callStatus: "loading",
                    callState: "processing"
                }))
                setSelectedPhone(phone)
            })
            .catch(err => console.log(err))
    }


    return (
        <div className={styles.mainContent}>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Top Navigation */}
                <div className={styles.topNav}>
                    <div className={styles.searchBox}>
                        <SearchIcon size={20} />
                        <input
                            type="text"
                            placeholder="Qidiruv"
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className={styles.inProgressButton}>
                        <span>📋</span> In Progress
                    </button>
                </div>

                {/* Category Tabs */}
                <div className={styles.categoryTabs}>
                    <h2 className={styles.categoryTitle}>My tasks</h2>
                    <div className={styles.tabsContainer}>
                        {[
                            { id: "debtors", label: "Qarzdorlar", count: calcLengthData("debtors", isCompleted) },
                            {
                                id: "newStudents",
                                label: "Yangi o'quvchilar",
                                count: calcLengthData("newStudents", isCompleted)
                            },
                            { id: "leads", label: "Lead", count: calcLengthData("leads", isCompleted) },
                            // { id: "completed", label: "Completed", count: 0 },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                className={`${styles.tab} ${activeCategory === tab.id ? styles.activeTab : ""}`}
                                onClick={() => setActiveCategory(tab.id)}
                            >
                                <span>{tab.label}</span>
                                <span className={styles.tabCount}>{tab.count}</span>
                            </button>
                        ))}
                    </div>
                    <div className={styles.totalCount}>
                        {
                            sortedData.length
                        }
                    </div>
                </div>

                {/* Cards Grid */}
                {
                    (unCompletedStatus === "loading" || completedStatus === "loading")
                        ? <div classNames={styles.main__loader}>
                            <DefaultLoader />
                        </div>
                        : isTable
                            ? <div className={styles.main__table}>
                                <TableData
                                    isCompleted={isCompleted}
                                    arr={sortedData}
                                    activeType={activeCategory}
                                />
                            </div>
                            : <>
                                <WrapperSlide
                                    arr={
                                        activeCategory === "debtors"
                                            ? sortedData.filter(item => item.moneyType === "red")
                                            : sortedData
                                    }
                                    index={"red"}
                                    activeCategory={activeCategory}
                                    getCardColor={getCardColor}
                                    setPhonesList={setPhonesList}
                                    setIsSelectPhone={setIsSelectPhone}
                                    setIsSelectedStudent={setIsSelectedStudent}
                                    onCall={onCall}
                                />

                                {
                                    activeCategory === "debtors" && (
                                        <WrapperSlide
                                            arr={sortedData.filter(item => item.moneyType === "yellow")}
                                            index={"yellow"}
                                            activeCategory={activeCategory}
                                            getCardColor={getCardColor}
                                            setPhonesList={setPhonesList}
                                            setIsSelectPhone={setIsSelectPhone}
                                            setIsSelectedStudent={setIsSelectedStudent}
                                            onCall={onCall}
                                        />
                                    )
                                }
                            </>
                }
            </main>

            {/* Right Sidebar */}
            <aside className={styles.rightSidebar}>
                <div className={styles.navButtons}>
                    <button
                        className={classNames(
                            styles.navButton,
                            {
                                [styles.active]: location.pathname.includes("taskManager")
                            }
                        )}
                        onClick={() => navigate("../taskManager")}
                    >
                        Task manager
                    </button>
                    <button
                        className={classNames(
                            styles.navButton,
                            {
                                [styles.active]: location.pathname.includes("adminRanking")
                            }
                        )}
                        onClick={() => navigate("../adminRanking")}
                    >
                        Admin ranking
                    </button>
                </div>
                {/* Calendar */}
                <div className={styles.calendarWidget}>
                    {/* <div className={styles.calendarHeader}>
                        <button
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        >
                            <ChevronLeftIcon size={18} />
                        </button>
                        <span>
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                        <button
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        >
                            <ChevronRightIcon size={18} />
                        </button>
                    </div>
                    <div className={styles.calendarDays}>
                        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                            <div key={day} className={styles.dayHeader}>
                                {day}
                            </div>
                        ))}
                        {calendarDays.map((day, idx) => (
                            <div
                                key={idx}
                                className={`${styles.calendarDay} ${day === today.getDate() && isCurrentMonth ? styles.today : ""}`}
                            >
                                {day}
                            </div>
                        ))}
                    </div> */}
                    <Calendar
                        defaultValue={date}
                        onChange={setDate}
                    />
                </div>

                {/* Statistics */}
                <div className={styles.statsWidget}>
                    <div className={styles.statItem}>
                        <div className={styles.statCircle}>
                            <span className={styles.statValue}>{allProgress?.completed_tasks_percentage || 0}%</span>
                        </div>
                        <span className={styles.statLabel}>All Rating</span>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statCircle}>
                            <span className={styles.statValue}>{progress?.completed_tasks_percentage || 0}</span>
                        </div>
                        <span className={styles.statLabel}>{activeCategory}</span>
                    </div>
                </div>
            </aside>
            <Modal
                activeModal={isCall}
                setActiveModal={setIsCall}
                extraClass={styles.audioModal}
            >
                <div className={styles.audioModal__loader}>
                    <CallStatusLoader
                        status={callStatus}
                        state={callState}
                    />
                </div>
                {
                    (callStatus === "success" && callState !== "error") && (
                        <>
                            <Input
                                title={"Koment"}
                                placeholder={"Koment"}
                                onChange={setAudioCom}
                            />
                            <Input
                                type={"date"}
                                title={"Kun"}
                                onChange={setAudioDate}
                            />
                            <Button onClickBtn={onSubmit}>Kiritish</Button>
                        </>
                    )
                }
            </Modal>
            <Modal
                activeModal={isSelectPhone}
                setActiveModal={setIsSelectPhone}
                extraClass={styles.audioModal}
            >
                {
                    phonesList.map(item => (
                        <div
                            className={styles.audioModal__inner}
                            onClick={() => {
                                onCall(isSelectedStudent, item.phone)
                                setIsSelectPhone(false)
                            }}
                        >
                            <span>{item.personal ? "Presonal" : item.parent ? "Parent" : "Other"}:</span>
                            {item.phone}
                        </div>
                    ))
                }
            </Modal>
        </div>
    )
}

const WrapperSlide = ({ arr, index, activeCategory, getCardColor, setIsSelectPhone, setPhonesList, onCall, setIsSelectedStudent }) => {

    const { request } = useHttp()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const x = useMotionValue(0)
    const [width, setWidth] = useState(0)
    const wrapper = useRef()

    useEffect(() => {
        setWidth(wrapper.current?.scrollWidth - wrapper.current?.offsetWidth)
        x.set(0)
    }, [arr?.length])

    const controls = useDragControls()

    const onGetPnohe = (id) => {
        request(`${BackUrl}task_debts/get_phones/${id}/`, "GET", null, headers())
            .then(res => {
                console.log(res, "res")
                setIsSelectPhone(true)
                setPhonesList(res.phones)
                setIsSelectedStudent(id)
            })
    }

    return (
        <motion.div
            key={index}
            className={styles.scroll}
            id="scroll"
            ref={wrapper}
        >
            <motion.div
                className={styles.scroll__inner}
                id="scroll__inner"
                drag={"x"}
                dragElastic={0}
                dragMomentum={false}
                dragConstraints={{ left: -width, right: 0 }}
                dragControls={controls}
            >
                {
                    arr?.map((student) => {
                        return (
                            <div
                                key={student.id}
                                className={classNames(
                                    styles.card,
                                    {
                                        [styles.cardRed]: student.moneyType === "red" || student.status === "red",
                                        [styles.cardYellow]: student.moneyType === "yellow" || student.status === "yellow",
                                        [styles.cardGray]: (student.moneyType !== "red" && student.moneyType !== "yellow") && (student.status !== "red" && student.status !== "yellow"),
                                    }
                                )}
                            >
                                <div className={styles.cardHeader}>
                                    <div
                                        className={styles.avatar}
                                        onClick={() => navigate("")}
                                    />
                                    <button
                                        className={styles.phoneButton}
                                        onClick={() =>
                                            activeCategory === "leads"
                                                ?
                                                onCall(student.id)
                                                : onGetPnohe(student.id)
                                        }
                                    >
                                        <PhoneIcon size={20} />
                                    </button>
                                </div>
                                <div className={styles.cardContent}>
                                    <p className={styles.cardName}>{student.name} {student.surname}</p>
                                    {activeCategory === "debtors" && <p className={styles.debtAmount}>{student.balance}</p>}
                                    {activeCategory === "newStudents" && <p className={styles.subject}>{student.subjects[0]}</p>}
                                    {activeCategory === "leads" && <p className={styles.regDate}>{student.day}</p>}
                                </div>
                                <div className={styles.cardFooter}>
                                    {activeCategory === "debtors" && (
                                        <>
                                            <div className={styles.footerItem}>
                                                <span className={styles.label}>Number:</span>
                                                <span className={styles.value}>{student.phone}</span>
                                            </div>
                                            <div className={styles.footerItem}>
                                                <span className={styles.label}>Tel status:</span>
                                                <span className={styles.value}>{student.reason}</span>
                                            </div>
                                        </>
                                    )}
                                    {activeCategory === "newStudents" && (
                                        <>
                                            <div className={styles.footerItem}>
                                                <span className={styles.label}>number:</span>
                                                <span className={styles.value}>{student.number}</span>
                                            </div>
                                        </>
                                    )}
                                    {activeCategory === "leads" && (
                                        <>
                                            <div className={styles.footerItem}>
                                                <span className={styles.label}>number:</span>
                                                <span className={styles.value}>{student.phone}</span>
                                            </div>
                                        </>
                                    )}
                                    <div className={styles.footerItem}>
                                        <span className={styles.label}>Parent number:</span>
                                        <span className={styles.value}>{student.parent}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </motion.div>
        </motion.div>
    )
}

const TableData = ({ arr }) => {

    const stringCheck = (name, length = 10) => {
        if (name?.length > length) {
            return (
                <>
                    {name.substring(0, length)}...
                    <div className={styles.popup}>
                        {name}
                    </div>
                </>
            )
        }
        return name
    }
    const renderData = () => {
        return arr?.map((item, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{stringCheck(item.name)}</td>
                <td>{stringCheck(item.surname)}</td>
                <td>{item?.phone}</td>
                <td>{stringCheck(item?.reason, 20)}</td>
            </tr>
        ))
    }
    const render = renderData()


    return (
        <Table className={styles.table_results}>
            <thead className={styles.tableHeader}>
                <tr>
                    <th>No</th>
                    <th>Ism</th>
                    <th>Familiya</th>
                    <th>Telefon raqami</th>
                    <th>Sababi</th>
                </tr>
            </thead>
            <tbody>
                {render}
            </tbody>
        </Table>
    )
}

const CallStatusLoader = ({ status, state }) => {
    const [showCheckmark, setShowCheckmark] = useState(false)

    useEffect(() => {
        if (status === "success") {
            setTimeout(() => setShowCheckmark(true), 100)
        } else {
            setShowCheckmark(false)
        }
    }, [status])

    return (
        <div className={styles.container}>
            <div className={styles.loaderWrapper}>
                <span
                    className={classNames(styles.parent, {
                        [styles.fadeOut]: status === "success"
                    })}
                >
                    <span className={styles.loader} />
                </span>

                {
                    state === "error"
                        ? <svg
                            className={`${styles.checkmark} ${showCheckmark ? styles.show : ""}`}
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                style={{ stroke: "#e53935" }}
                                className={styles.checkmarkPath}
                                d="M 30 30 L 70 70 M 70 30 L 30 70"
                            />
                        </svg>
                        : <svg
                            className={`${styles.checkmark} ${showCheckmark ? styles.show : ""}`}
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path className={styles.checkmarkPath} d="M 25 52 L 42 68 L 75 32" />
                        </svg>
                }



            </div>

            <p
                style={state === "error" ? { color: "#e53935" } : null}
                className={styles.statusText}
            >
                {
                    status === "loading"
                        ? "Calling in progress..."
                        : status === "success"
                            ? state === "error"
                                ? "Call rejected"
                                : "Call successed"
                            : "Call connecting..."
                }
            </p>
        </div>
    )
}

export default NewTaskManager
