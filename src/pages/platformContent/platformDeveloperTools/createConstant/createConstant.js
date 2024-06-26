import React, {useCallback, useEffect, useState} from 'react';

import 'pages/platformContent/platformDeveloperTools/createConstant/createConstant.sass'
import Input from "components/platform/platformUI/input";
import InputForm from "components/platform/platformUI/inputForm";
import {useForm} from "react-hook-form";
import Modal from "components/platform/platformUI/modal";
import Button from "components/platform/platformUI/button";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {fetchDataTools} from "slices/dataToChangeSlice";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";


const CreateConstant = () => {

    const {name} = useParams()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchDataTools())
    },[dispatch])


    const {tools} = useSelector(state => state.dataToChange)
    
    const [data,setData] = useState({
        title: null,
        items: []
    })
    const [nameList,setNameList] = useState(null)
    
    const onTitleSubmit = (e) => {
        e.preventDefault()
        setData({...data,title: nameList})
    }
    
    useEffect(() => {
        if (name || name !== "new") {
            tools.map(item => {
                console.log(name)
                if (item.title === name) {
                    setData({
                        title: item.title,
                        items: item.values
                    })
                }
            })
        }
    },[name, tools])
    
    // const onItemSubmit = (data,e) => {
    //     e.preventDefault()
    //     console.log(data)
    // }
    //
    //
    // const setItem = (input,name) => {
    //     // setItems({
    //     //     ...items,
    //     //     [name]: input
    //     // })
    // }


    const {request} = useHttp()

    const postData = () => {
        request(`${BackUrl}create_constants`,"POST",JSON.stringify(data),headers())
    }

    return (
        <div className="createItems">

            <h1>Create Items</h1>


            <div className="container">
                <header>
                    { data.title ?
                        <div className="titleBox">
                            <h1>Name of List:</h1>
                            <span>{data.title}</span>
                        </div>
                        :
                        <form action="" onSubmit={onTitleSubmit}>
                            <Input onChange={setNameList} name={"nameOfList"} title={"Name of List"}  required={true} type={"text"}/>
                            <input type="submit" className="input-submit"/>
                        </form>
                    }
                </header>


                <main>
                    {
                        data.title ? <ItemsForm setData={setData} data={data}/> : null
                    }

                </main>
                <footer>
                    <Button onClickBtn={postData} >
                        Submit
                    </Button>
                </footer>

            </div>
        </div>
    );
};

const ItemsForm = ({setData,data}) => {

    const [nameOfInput,setNameOfInput] = useState("")
    const [extraTools,setExtraTools] = useState([])


    const [activeModal,setActiveModal] = useState(false)
    const [activeModalName,setActiveModalName] = useState("")
    const [changeItem,setChangeItem] = useState({
        item: null,
        index: null
    })
    const [items,setItems] = useState([])
    
    
    useEffect(()=>{
        setData({...data,items:items})
    },[items])


    useEffect(()=>{
        setItems([...items,...data.items])
    },[])


    const onGetNameSubmit = (e) => {
        e.preventDefault()
        const data = {
            name: nameOfInput
        }
        setExtraTools([...extraTools,data])
        setActiveModal(false)
        setNameOfInput("")
        e.target.reset()
    }


    const renderItems = useCallback(() => {
        // eslint-disable-next-line array-callback-return
        return items.map((item,index) => {
            const keys = Object.keys(item)
            const renderKeys = keys.map(key => {
                if (key === "id") return
                return (
                    <div>
                        <span>{key}:</span>
                        <span>{item[key]}</span>
                    </div>
                )
            })
            return (
                <div className="addInput__item">
                    <span className="index">{index+1}</span>
                    {renderKeys}
                    <div className="tools">
                        <i className="fas fa-plus addInput-icon" />
                        <i className="fas fa-edit" onClick={() => setChangeItemModal(item,index)}/>
                        <i onClick={() => deleteItem(index,items,setItems)} className="fas fa-times" />
                    </div>
                </div>
            )
        })
    },[items])

    const deleteItem = (index,list,setFunc) => {
        const newData = list.filter((_,i) => i !== index)
        setFunc(newData)
    }


    const setAddInputModal = () => {
        setActiveModal(!activeModal)
        setActiveModalName("addInput")
    }

    const setChangeItemModal = (item,index) => {
        setChangeItem({
            item,
            index
        })
        setActiveModal(!activeModal)
        setActiveModalName("changeItem")
    }


    return (
        <>
            {
            activeModalName === "addInput" ?
                <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                    <form className="getNameForm" action="" onSubmit={onGetNameSubmit}>
                        <label className="input-label" htmlFor={"name"}>
                            <span className="name-field">Name of Input</span>
                            <input
                                required={true}
                                type={"text"}
                                defaultValue={""}
                                id={"name"}
                                className="input-fields"
                                value={nameOfInput}
                                onChange={e => setNameOfInput(e.target.value)}
                            />
                        </label>
                        <input type="submit" className="input-submit"/>
                    </form>
                </Modal>
                : activeModalName === "changeItem" ?
                    <Modal>
                        {/*<ChangeItem data={} setItems={} />*/}
                    </Modal>
                    : null
            }
            <div className="extraTools">
                <div className="extraTools__container">
                    {
                        changeItem.item ?
                            <ChangeItem
                                setChangeItem={setChangeItem}
                                extraTools={extraTools}
                                setActiveModal={setAddInputModal}
                                items={items}
                                setItems={setItems}
                                setExtraTools={setExtraTools}
                                changeItem={changeItem}
                            />
                            :
                            <AddInputForm
                                extraTools={extraTools}
                                setActiveModal={setAddInputModal}
                                setExtraTools={setExtraTools}
                                setItems={setItems}
                                items={items}
                            />
                    }
                    {/*<AddListForm/>*/}
                </div>
                <div className="extraTools__container column">
                    {renderItems()}
                </div>

            </div>


        </>
    )
}

const AddInputForm = ({extraTools,setActiveModal,setExtraTools,setItems,items}) => {

    const {
        register,
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur"
    })
    const onItemSubmit = (data,e) => {
        e.preventDefault()
        setItems([...items,data])
        e.target.reset()
    }
    const addExtraInfo = useCallback( () => {
        return extraTools.map((item,index) => {
            return (
                <div className="addInput__extraInput">
                    <InputForm
                        name={item.name}
                        title={item.name}
                        type={"text"}
                        required={true}
                        register={register}
                    />
                    <i onClick={() => {
                        deleteItem(index, extraTools, setExtraTools)
                        reset()
                    }} className="fas fa-times" />
                </div>
            )
        })
    },[extraTools])


    const deleteItem = (index,list,setFunc) => {
        const newData = list.filter((_,i) => i !== index)
        setFunc(newData)
    }


    return (
        <div className="addInput">
            <h1>Create Item</h1>
            <form action="" onSubmit={handleSubmit(onItemSubmit)}>
                <InputForm
                    name={"name"}
                    title={"Name Of Item"}
                    type={"text"}
                    required={true}
                    register={register}
                />
                {addExtraInfo()}
                <i
                    onClick={() => {
                        setActiveModal(true)
                    }}
                   className="fas fa-plus addInput-icon" />
                <input type="submit" className="input-submit" />
            </form>
        </div>
    )
}







const ChangeItem = React.memo(({items,setChangeItem,setItems,extraTools,setExtraTools,setActiveModal,changeItem}) => {
    const {
        register,
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur"
    })
    const onItemSubmit = (data,e) => {
        e.preventDefault()
        setItems(elems =>{
            return elems.map((item,index) => {
                if (index === changeItem.index) {
                    return {...data,id:changeItem.item.id}
                }
                return item
            })
        })
        e.target.reset()
        setChangeItem({item: null,index: null})

    }
    const addExtraInfo = useCallback( () => {
        return extraTools.map((item,index) => {
            return (
                <div className="addInput__extraInput">
                    <InputForm
                        name={item.name}
                        title={item.name}
                        type={"text"}
                        required={true}
                        register={register}
                    />
                    <i onClick={() => {
                        deleteItem(index, extraTools, setExtraTools)
                        reset()
                    }} className="fas fa-times" />
                </div>
            )
        })
    },[extraTools])


    const deleteItem = (index,list,setFunc) => {
        const newData = list.filter((_,i) => i !== index)
        setFunc(newData)
    }

    const renderChangeItem = useCallback(() => {
        
        if (changeItem) {
            
            const keys = Object.keys(changeItem?.item)
            return keys?.map(key => {
                if (key === "id") return
                if (key === "name") {
                    return (
                        <InputForm
                            name={key}
                            title={key}
                            type={"text"}
                            required={true}
                            register={register}
                            defaultValue={changeItem.item[key]}
                        />
                    )
                }
                return (
                    <InputForm
                        name={key}
                        title={key}
                        type={"text"}
                        required={true}
                        register={register}
                        defaultValue={changeItem.item[key]}
                    />
                )
            })
        }

    },[changeItem,register])
    
    useEffect(() =>{
        reset()
    },[changeItem])
    
    const rendereditems = renderChangeItem()

    return (
        <div className="addInput">
            <h1>Change Item</h1>
            <form action="" onSubmit={handleSubmit(onItemSubmit)}>
                {/*<InputForm*/}
                {/*    name={"name"}*/}
                {/*    title={"Name Of Item"}*/}
                {/*    type={"text"}*/}
                {/*    required={true}*/}
                {/*    register={register}*/}
                {/*/>*/}
                {rendereditems}
                {addExtraInfo()}
                <i
                    onClick={() => {
                        setActiveModal(true)
                    }}
                    className="fas fa-plus addInput-icon" />
                <input type="submit" className="input-submit" />
            </form>
        </div>
    )
})



const AddListForm = () => {

    const [list,setList] = useState(null)

    const [createItem,setCreateItem] = useState(null)


    const onCreateSubmit = () => {
        console.log("hello")
        // setList({[name]: [...list.name,createItem]})
    }

    useEffect(()=> {
        console.log(createItem)
    },[createItem])






    return (
        <div className="addList">
            <h1>List name:</h1>
            <form className="addList__item">
                <Input onChange={setCreateItem} name={"Name"} type={"text"} title={"name"}/>
                <input  type="submit" className="input-submit" value="create"/>
            </form>

        </div>
    )
}


export default CreateConstant;