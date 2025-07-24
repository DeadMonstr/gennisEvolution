import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {motion, useDragControls, useMotionValue} from "framer-motion";
import cls from "../platformTaskManager.module.sass";
import {TaskCard} from "../taskManagerCards/taskCards";
import DefaultLoader from "../../../../components/loader/defaultLoader/DefaultLoader";
import {colorStatusList} from "../platformTaskManager";

export const RenderCards = ({isCompleted, arr, status, activeType, banList, elModal, onClick, setDellLead, getStudentId}) => {

    const filteredItems = useCallback((color) => {
        return arr?.filter(item => {

            if (activeType === "leads") {
                return item.status === color
            }

            if (typeof item.moneyType === "string" && item.moneyType) {
                return item.moneyType === color
            }

            if (color === "noColor" && typeof item.moneyType !== "string") {
                return item
            }

        })
    }, [arr, activeType])

    if (status === "loading" || status === "idle") {
        return <DefaultLoader/>
    }


    if (activeType === "newStudents") {

        return (
            <RenderItem
                arr={arr}
                index={1}
                modal={elModal}
                click={onClick}
                activeMenu={activeType}

            />
        )
    }

    return colorStatusList.map((item, i) => {

        switch (activeType) {
            case "debtors" :
                if (banList?.includes(item)) return null

                return (
                    <RenderItem
                        arr={filteredItems(item)}
                        activeMenu={activeType}
                        index={i}
                        modal={elModal}
                        click={onClick}

                    />
                )

            case "leads":
                if (banList?.includes(item)) return null
                return (
                    <RenderItem
                        arr={filteredItems(item)}
                        index={i}
                        activeMenu={activeType}
                        modal={elModal}
                        onDeleteLead={setDellLead}
                        click={onClick}
                        getStudentId={getStudentId}

                    />
                )
        }
    })
}


const RenderItem = React.memo(({arr, index, activeMenu, isCompleted, modal, click, onDeleteLead, getStudentId}) => {


    useEffect(() => {
        const elem = document.querySelectorAll("#main")
        const elements = document.querySelectorAll("#scroll__inner")
        const components = document.querySelectorAll("#scroll")
        elements.forEach((item, i) => {
            if (!item.innerHTML) {
                components[i].style.display = "none"
                if (elem[i]) elem[i].style.display = "none"
            } else {
                components[i].style.display = "flex"
                if (elem[i]) elem[i].style.display = "flex"
            }
        })
    }, [arr])

    const x = useMotionValue(0)
    const [width, setWidth] = useState(0)
    const wrapper = useRef()


    useEffect(() => {
        setWidth(wrapper.current?.scrollWidth - wrapper.current?.offsetWidth)
        x.set(0)
    }, [arr?.length, isCompleted, activeMenu])
    const controls = useDragControls()

    return (
        <motion.div
            key={index}
            className={cls.scroll}
            id="scroll"
            ref={wrapper}
        >
            <motion.div
                className={cls.scroll__inner}
                id="scroll__inner"
                drag={"x"}
                style={{
                    x
                }}
                dragElastic={0}
                dragMomentum={false}
                dragConstraints={{left: -width, right: 0}}
                dragControls={controls}
            >
                {
                    arr?.map((item, i) => {
                        return (
                            <TaskCard item={item} getStudentId={getStudentId} activeMenu={activeMenu} setActiveModal={modal} index={i} click={click} isCompleted={isCompleted} onDelete={onDeleteLead}

                            />
                        )
                    })
                }
            </motion.div>
        </motion.div>
    )
})