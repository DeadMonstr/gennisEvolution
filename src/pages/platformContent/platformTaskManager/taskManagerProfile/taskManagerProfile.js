import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchUserDataWithHistory } from "slices/taskManagerSlice";

import styles from "./taskManagerProfile.module.sass"
import classNames from "classnames";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";

const TaskManagerProfile = () => {

    const dispatch = useDispatch()
    const { storyId, storyType } = useParams()

    const {
        profile,
        profileStatus
    } = useSelector(state => state.taskManager)

    const [isBalanceNegative, setIsBalanceNegative] = useState(false)
    const [isPlayAudio, setIsPlayAudio] = useState(null)
    const [isMoreInfo, setIsMoreInfo] = useState(null)

    const [selectedOption, setSelectedOption] = useState("")
    const [comment, setComment] = useState("")
    const [selectedDate, setSelectedDate] = useState("")

    useEffect(() => {
        if (storyId && storyType) {
            dispatch(fetchUserDataWithHistory({ id: storyId, type: storyType }))
        }
    }, [storyId, storyType])

    useEffect(() => {
        if (profile) {
            setIsBalanceNegative(profile?.info?.balance < 0)
        }
    }, [profile])

    // Sort comments by added_date descending
    const sortedComments = profile.comments
        ? [...profile.comments].sort((a, b) => new Date(b.added_date) - new Date(a.added_date))
        : []

    // const fullName = `${profile.info.name} ${profile.info.surname}`
    // const isBalanceNegative = profile.info.balance < 0

    const handleSubmit = () => {
        console.log({
            selectedOption,
            comment,
            selectedDate,
        })
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
                {/* Left Column - Student Info */}
                {/* <div className={styles.leftColumn}>
                    <div className={styles.avatar}></div>

                    <div className={styles.fullName}>{profile?.info?.name} {profile?.info?.surname}</div>

                    <div className={styles.infoRow}>
                        <span className={styles.label}>Balance:</span>
                        <span className={isBalanceNegative ? styles.balanceNegative : styles.balance}>{profile?.info?.balance}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.label}>Number:</span>
                        <span className={styles.value}>{profile?.info?.phone}</span>
                    </div>

                    <select className={styles.selectInput}>
                        <option value="">Tanlang</option>
                    </select>

                    <input type="text" placeholder="koment" className={styles.textInput} />

                    <input type="date" className={styles.dateInput} />

                    <button className={styles.button}>Button</button>
                </div> */}

                {/* Right Column - Comments History */}
                <div className={styles.rightColumn}>
                    {
                        profileStatus === "loading"
                            ? <DefaultLoader />
                            : <div className={styles.commentsContainer}>
                                {
                                    profile?.comments
                                        // sortedComments
                                        ?.map((comment, index) => (
                                            <div className={styles.column}>
                                                <div key={index} className={styles.commentCard}>
                                                    <div className={styles.commentHeader}>
                                                        <strong>
                                                            Telefon qilingan : {comment.added_date} / {comment.to_date}
                                                        </strong>
                                                        <div className={styles.icons}>
                                                            <i
                                                                className={classNames(
                                                                    `fa-solid fa-${comment.id === isPlayAudio ? "pause" : "play"}`,
                                                                    styles.icons__audio
                                                                )}
                                                                onClick={() => setIsPlayAudio(prev => prev === comment.id ? null : comment.id)}
                                                            />
                                                            <i
                                                                className={classNames(
                                                                    `fa-solid fa-chevron-${comment.id === isMoreInfo ? "up" : "down"}`,
                                                                    styles.icons__audio
                                                                )}
                                                                onClick={() => setIsMoreInfo(prev => prev === comment.id ? null : comment.id)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={styles.commentText}>Comment : {comment.comment || ""}</div>
                                                </div>
                                                <div
                                                    // style={
                                                    //     comment.id === isMoreInfo
                                                    //         ? { height: "fit-content" }
                                                    //         : { height: 0 }
                                                    // }
                                                    className={
                                                        classNames(styles.column__list, {
                                                            [styles.active]: comment.id === isMoreInfo
                                                        })
                                                    }
                                                >
                                                    <div className={styles.wrapper}>
                                                        <div className={styles.wrapper__item}>
                                                            <h2 className={styles.audioTitle}>2025.12.09</h2>
                                                            <div className={styles.audio}>
                                                                <p className={styles.audio__subTitle}>
                                                                    Audio time:
                                                                    <span className={styles.inner}> 00:34</span>
                                                                </p>
                                                                <i
                                                                    className={classNames(
                                                                        `fa-solid fa-${comment.id === isPlayAudio ? "pause" : "play"}`,
                                                                        styles.wrapper__audio
                                                                    )}
                                                                    onClick={() => setIsPlayAudio(prev => prev === comment.id ? null : comment.id)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                }
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default TaskManagerProfile
