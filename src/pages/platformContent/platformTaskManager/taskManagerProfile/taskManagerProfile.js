import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

import { useHttp } from "hooks/http.hook";
import { fetchUserDataWithHistory } from "slices/taskManagerSlice";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";

import styles from "./taskManagerProfile.module.sass";
import { BackUrl, headers } from "constants/global";

const TaskManagerProfile = () => {
    const dispatch = useDispatch();
    const { storyId, storyType } = useParams();
    const { request } = useHttp()

    const { profile, profileStatus } = useSelector(
        state => state.taskManager
    );

    /** ================= FETCH ================= */
    useEffect(() => {
        if (storyId && storyType) {
            dispatch(fetchUserDataWithHistory({ id: storyId, type: storyType }));
        }
    }, [storyId, storyType]);

    useEffect(() => {
        request(`${BackUrl}task_leads/leads_records/62/`, "GET", null, headers())
    }, [])

    /** ================= JSX ================= */
    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.rightColumn}>
                    {profileStatus === "loading" ? (
                        <DefaultLoader />
                    ) : (
                        <div className={styles.commentsContainer}>
                            {
                                // profile?.comments
                                [
                                    {
                                        id: 1,
                                        comment: "Mijoz bilan bog‘lanildi, kelishildi",
                                        added_date: "2025-12-09",
                                        to_date: "2025-12-10",

                                        audios: [
                                            {
                                                id: 101,
                                                url: "http://192.168.0.109:5002/media/call_records/leads/9F8BG55RPO000036.mp3",
                                                duration: "00:34",
                                                date: "2025.12.09"
                                            },
                                            {
                                                id: 102,
                                                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                                                duration: "01:12",
                                                date: "2025.12.10"
                                            }
                                        ]
                                    },

                                    {
                                        id: 2,
                                        comment: "Telefon ko‘tarmadi, keyinroq qo‘ng‘iroq qilish kerak",
                                        added_date: "2025-12-11",
                                        to_date: "2025-12-12",

                                        audios: [
                                            {
                                                id: 201,
                                                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                                                duration: "00:45",
                                                date: "2025.12.11"
                                            }
                                        ]
                                    },

                                    {
                                        id: 3,
                                        comment: "Raqam noto‘g‘ri",
                                        added_date: "2025-12-13",
                                        to_date: "2025-12-13",

                                        audios: [] // НЕТ АУДИО — тоже проверка
                                    }
                                ]
                                    ?.map(comment => (
                                        <CommentCard
                                            comment={comment}
                                        />
                                    ))
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CommentCard = ({ comment }) => {

    const audioRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [audioList, setAudioList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isMoreInfo, setIsMoreInfo] = useState(null);

    const playByIndex = (index, list) => {
        const audio = audioRef.current;
        if (!audio || !list?.length) return;

        const selected = list[index];
        if (!selected) return;

        if (currentAudio === selected.url) {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio.play();
                setIsPlaying(true);
            }
            return;
        }

        audio.src = selected.url;
        audio.play();

        setAudioList(list);
        setCurrentIndex(index);
        setCurrentAudio(selected.url);
        setIsPlaying(true);
    };

    const onTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio) return;

        setCurrentTime(audio.currentTime);
        setDuration(audio.duration || 0);
        setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const playNext = () => {
        if (currentIndex === null) return;
        if (currentIndex < audioList.length - 1) {
            playByIndex(currentIndex + 1, audioList);
        }
    };
    const formatTime = (time = 0) => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };


    const playPrev = () => {
        if (currentIndex === null) return;
        if (currentIndex > 0) {
            playByIndex(currentIndex - 1, audioList);
        }
    };

    const onSeek = (e) => {
        const audio = audioRef.current;
        if (!audio) return;

        const value = e.target.value;
        audio.currentTime = (audio.duration * value) / 100;
        setProgress(value);
    };

    return (
        <div key={comment.id} className={styles.column}>
            {/* HEADER */}
            <div className={styles.commentCard}>
                <div className={styles.commentHeader}>
                    <strong>
                        Telefon qilingan :
                        {" "}
                        {comment.added_date}
                        {" / "}
                        {comment.to_date}
                    </strong>

                    <div className={styles.icons}>
                        {/* HEADER PLAY (LAST AUDIO) */}
                        <div className={styles.icons__options}>
                            {/* <i
                                className={classNames(
                                    "fa-solid fa-backward-step",
                                    styles.icons__audio
                                )}
                            /> */}
                            <i
                                className={classNames(
                                    `fa-solid fa-${isPlaying &&
                                        currentAudio ===
                                        comment.audios?.at(-1)?.url
                                        ? "pause"
                                        : "play"
                                    }`,
                                    styles.icons__audio
                                )}
                                onClick={() =>
                                    playByIndex(
                                        comment.audios.length - 1,
                                        comment.audios
                                    )
                                }
                            />
                            {/* <i
                                className={classNames(
                                    "fa-solid fa-forward-step",
                                    styles.icons__audio
                                )}
                            /> */}
                        </div>
                        <i
                            className={classNames(
                                `fa-solid fa-chevron-${comment.id === isMoreInfo
                                    ? "up"
                                    : "down"
                                }`,
                                styles.icons__audio
                            )}
                            onClick={() =>
                                setIsMoreInfo(prev =>
                                    prev === comment.id ? null : comment.id
                                )
                            }
                        />
                    </div>
                </div>

                <div className={styles.commentText}>
                    Comment : {comment.comment || ""}
                </div>
            </div>

            {/* AUDIO LIST */}
            <div
                className={classNames(styles.column__list, {
                    [styles.active]: comment.id === isMoreInfo
                })}
            >
                <div className={styles.wrapper}>
                    {
                        comment.audios?.map((audio, index) => (
                            // <Audio
                            //     audio={audio}
                            // />
                            <div key={audio.id} className={styles.wrapper__item}>
                                <h2 className={styles.audioTitle}>
                                    {audio.date}
                                </h2>

                                <div className={styles.audio}>
                                    <p className={styles.audio__subTitle}>
                                        {formatTime(
                                            currentAudio === audio.url
                                                ? currentTime
                                                : 0
                                        )}
                                        {" / "}
                                        {/* {formatTime(duration)} */}
                                        {audio.duration}
                                    </p>

                                    <div className={styles.controls}>
                                        <i
                                            className="fa-solid fa-backward-step"
                                            onClick={playPrev}
                                        />

                                        <i
                                            className={classNames(
                                                `fa-solid fa-${isPlaying &&
                                                    currentAudio === audio.url
                                                    ? "pause"
                                                    : "play"
                                                }`,
                                                styles.wrapper__audio
                                            )}
                                            onClick={() =>
                                                playByIndex(index, comment.audios)
                                            }
                                        />

                                        <i
                                            className="fa-solid fa-forward-step"
                                            onClick={playNext}
                                        />
                                    </div>
                                </div>

                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={
                                        currentAudio === audio.url
                                            ? progress
                                            : 0
                                    }
                                    onChange={onSeek}
                                />
                                {/* <audio
                ref={audioRef}
                onTimeUpdate={onTimeUpdate}
                onEnded={playNext}
            /> */}
                            </div>
                        ))
                    }
                </div>
            </div>
            <audio
                ref={audioRef}
                onTimeUpdate={onTimeUpdate}
                onEnded={playNext}
            />
        </div>
    )
}

export default TaskManagerProfile;
