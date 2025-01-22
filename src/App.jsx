import "./App.css"
import { Card } from "./Card";
import Task from "./components/TaskTarget"
import DialogAdd from "./components/DialogAdd";
import DropArea from "./components/dropArea"
import ContextMenu from "./components/ContextMenu";
import {Fragment,useState, useRef, useEffect, useCallback } from "react";

const ButtonAdd = ({content,activateModal}) => {
    return(
        <button className="at-button" onClick={() => activateModal(content)}>{content}</button>
    )
};

const ShowCards = ({data,modify,checkCard,activeCard,setActiveCard,onDrop,openContextMenu}) => {
    const display = () => {
        return data.map(card => 
         (
            <Fragment  key={card.id}>
                <Task card={card} modify={modify} checkCard={checkCard} setActiveCard={setActiveCard} openContextMenu={openContextMenu}/>
                <DropArea position={card.position+1} type={card.type} activeCard={activeCard} onDrop={() => onDrop(card.position+1,card.type)}></DropArea>
            </Fragment>
        )
        )
    };
    return <>{display()}</>
}

export function App(){

    const dialogModal = useRef();
    const contextMenuRef = useRef();
    const [dialogOpen, setDialog] = useState(false)
    const [startDate, setStartDate] = useState(new Date())
    const [isTask, setIsTask] = useState(false)
    const [isModified, setIsModified] = useState(false)
    const [actualCard, setActualCard] = useState(new Card())
    const [activeCard, setActiveCard] = useState(null)
    const [contextMenu,setContextMenu] = useState({
        open: false,
        x: 0,
        y: 0
    })

    const [habits, setHabits] = useState([new Card(
        0,
        "Leer un libro al mes",
        "Final del año con 12 libros leídos",
        null,
        "Alta",
        ["personal","habilidad"],
        ["Inteligencia", "Bienestar"],
        true,
        "habit",
        0,
        "aquamarine"
    )])

    const [tasks, setTasks] = useState([new Card(
        0,
        "Estudiar robótica",
        "Para el proyecto final",
        new Date(),
        "Media",
        ["estudio"],
        ["Inteligencia"],
        true,
        "task",
        0,
        "red"
    ),new Card(
        1,
        "Prepararme para entrevista",
        "Por fin se va a conseguir trabajo",
        new Date(),
        "Alta",
        ["personal"],
        ["Inteligencia","Social"],
        false,
        "task",
        1,
        "black"
    )])

    const stats = [{
        id: "0",
        name: "Fuerza",
        check: false
    },{
        id: "1",
        name: "Inteligencia",
        check: false
    },{
        id: "2",
        name: "Social",
        check: false
    },{
        id: "3",
        name: "Bienestar",
        check: false
    }]

    const colors = [
        { id: 0, color: "#000000" },
        { id: 1, color: "#FF0000" },
        { id: 2, color: "#000080" },
        { id: 3, color: "#800080" },
        { id: 4, color: "#FF8C00" },
        { id: 5, color: "#228B22" },
        { id: 6, color: "#8B4513" },
        { id: 7, color: "#7fffd4" }
    ]
    
    const taskMessage = "Nuevo por hacer"
    const habitMessage = "Nuevo hábito"

    useEffect(()=>{
        document.addEventListener("click",closeContextMenu)
        document.addEventListener("scroll",closeContextMenu)
        document.addEventListener("keydown",closeContextMenu)
        document.addEventListener("visibilitychange",closeContextMenu)
        document.addEventListener("dragstart",closeContextMenu)
        return () => {
            document.removeEventListener("click",closeContextMenu)
            document.removeEventListener("scroll",closeContextMenu)
            document.removeEventListener("keydown",closeContextMenu)
            document.removeEventListener("visibilitychange",closeContextMenu)
            document.removeEventListener("dragstart",closeContextMenu)
        }
    },[contextMenu])

    const activateModal = (content) => {
        content === habitMessage ? setIsTask(false) : setIsTask(true)
        setDialog(!dialogOpen);
        dialogModal.current.showModal();
    };

    const closeModal = (event) => {
        if(typeof(event) !== "undefined"){
            
            if(event.type === "submit"){
                event.preventDefault();
                let id=0,date,type,position;

                if(isTask){
                    tasks.forEach(task => 
                        task.id>=id && (id=task.id+1)
                    )
                    date = startDate;
                    type = "task";
                    position = tasks.length;
                }else{
                    habits.forEach(habit => 
                        habit.id>=id && (id=habit.id+1)
                    )
                    date = null;
                    type = "habit";
                    position = habits.length;
                }

                const newCard = new Card(
                    isModified ? actualCard.id : id,
                    event.target.name.value,
                    event.target.description.value,
                    date,
                    event.target.priority.value,
                    event.target.tags.value.trim().split(",").map(e => e.trim()),
                    [].filter.call(event.target.stat,e => e.checked).map(element => element.value),
                    isModified ? actualCard.isFinished : false,
                    type,
                    position
                )

                if(isModified){
                    isTask ? setTasks(tasks.map(task => task.id == actualCard.id ? newCard : task))
                            : setHabits(habits.map(habit => habit.id == actualCard.id ? newCard : habit))
                }
                
                !isModified && (isTask ? setTasks(tasks.concat(newCard)) : setHabits(habits.concat(newCard)))
            }else{
                isTask ? setTasks(tasks.filter((_,id) => id !== tasks.indexOf(actualCard))
                                        .map((task,i) => task.cloneWithChanges({position:i})))
                        : setHabits(habits.filter((_,id) => id !== habits.indexOf(actualCard))
                                        .map((habit,i) => habit.cloneWithChanges({position:i})))
            }
        }
        setDialog(!dialogOpen)
        setActualCard(new Card())
        isModified && setIsModified(!isModified)
        dialogModal.current.close();
    };

    const modifyCard = (card) => {
        card.type === "task" ? setIsTask(true) : setIsTask(false)
        setActualCard(card);
        setIsModified(!isModified)
        setDialog(!dialogOpen);
        dialogModal.current.showModal();
    }

    const checkCard = (card,isCheck) => {
        if(card.type === "task"){
            const cardIndex = tasks.indexOf(card)
            setTasks(tasks.map((task,i) => {
                if(i === cardIndex){
                    return task.cloneWithChanges({isFinished: isCheck})
                }
                return task
            }))
        }else {
            const cardIndex = habits.indexOf(card)
            setHabits(habits.map((habit,i) => {
                if(i === cardIndex){
                    return habit.cloneWithChanges({isFinished: isCheck})
                }
                return habit
            }))
        }
    } 

    const onDrop = (position,cardType) => {
        if(position !== activeCard.position && position !== activeCard.position+1){
            let cardsChange = (cardType === "task") ? [...tasks] : [...habits]

            cardsChange.splice(position,0,activeCard)
            cardsChange.splice(cardsChange.findIndex((card,i) =>
            card.id === activeCard.id ? (i!=position ? true : false) : false),1)
            
            cardType === "task" ? setTasks(cardsChange.map((card,i) => card.cloneWithChanges({position:i})))
                                : setHabits(cardsChange.map((card,i) => card.cloneWithChanges({position:i})))
        }
    }

    const openContextMenu = (event,card) => {
        event.preventDefault();
        let x,y = event.pageY;
        (event.pageX < window?.innerWidth / 2) ?
        x = event.pageX :
        x = event.pageX - contextMenuRef.current.getBoundingClientRect().width;
        setContextMenu({open:true,x:x,y:y})
        setActiveCard(card)
        contextMenuRef.current.focus()
    }

    const closeContextMenu = useCallback((event) => {
        if(event._reactName === "onClick" && activeCard){
            let activeCardIndex;
            if(activeCard.type === "task"){
                activeCardIndex = tasks.indexOf(activeCard)
                setTasks(tasks.map((task,i) => {
                    if(i === activeCardIndex){
                        return task.cloneWithChanges({color: window.getComputedStyle(event.target).backgroundColor})
                    }
                    return task
                }))
            }else {
                activeCardIndex = habits.indexOf(activeCard)
                setHabits(habits.map((habit,i) => {
                    if(i === activeCardIndex){
                        return habit.cloneWithChanges({color: window.getComputedStyle(event.target).backgroundColor})
                    }
                    return habit
                }))
            }
            setActiveCard(null)
        }
        contextMenu.open && setContextMenu({...contextMenu,open:false})
    },[activeCard, contextMenu, habits, tasks])

    return(
        <>
            <DialogAdd
                ref={dialogModal}
                dialogOpen={dialogOpen}
                closeModal={closeModal}
                startDate={startDate}
                setStartDate={setStartDate}
                isTask={isTask}
                isModified={isModified}
                actualCard={actualCard}
                stats={stats}
            />
            <ContextMenu
                ref={contextMenuRef}
                colors={colors}
                open={contextMenu.open}
                ContextMenuX={contextMenu.x}
                ContextMenuY={contextMenu.y}
                closeContextMenu={closeContextMenu}
            /> 
            <header id="App-header">
                <h1>Administrador de Tareas</h1>
                <div>
                    <img id="logo" src="./src/assets/a.svg" alt="Slime"/>
                </div>
                <div>
                    <img src="./src/assets/store.svg" alt="Store"/>
                </div>
                <div>
                <img src="./src/assets/user.svg" alt="User"/>
                </div>
            </header>
            
            <main>
                <section className="App">
                    <article id="status">
                        <h3>Nivel de Mascota</h3>
                        <div className="status-bar">
                            <div id="level"></div>
                        </div>
                        <h3>Vida de Mascota</h3>
                        <div className="status-bar">
                            <div id="life"></div>
                        </div>
                        <h3>Gelatina</h3>
                        <div className="status-bar">
                            <div id="gelatine"></div>
                        </div>
                    </article>

                    <article>
                        <div id="pet">
                            <img src="./src/assets/a.svg" alt="Slime"/>
                        </div>
                        <h3>Nombre Mascota</h3>
                    </article>

                    <article>
                        <h3>Fuerza</h3>
                        <h3>Inteligencia</h3>
                        <h3>Social</h3>
                        <h3>Bienestar</h3>
                    </article>
                </section>

                <section id="App-tracker">
                    <article>
                        <h1>Por Hacer</h1>
                        <section id="at-box">
                            <ButtonAdd content={taskMessage} activateModal={activateModal}/>
                            <DropArea position={0} type={"task"} activeCard={activeCard} onDrop={() => onDrop(0,"task")}></DropArea>
                            <ShowCards
                                data={tasks}
                                modify={modifyCard}
                                checkCard={checkCard}
                                activeCard={activeCard}
                                setActiveCard={setActiveCard}
                                onDrop={onDrop}
                                openContextMenu={openContextMenu}
                            />
                        </section>
                    </article>
                    <article>
                        <h1>Hábitos</h1>
                        <section id="at-box">
                            <ButtonAdd content={habitMessage} activateModal={activateModal}/>
                            <DropArea position={0} type={"habit"} activeCard={activeCard} onDrop={() => onDrop(0,"habit")}></DropArea>
                            <ShowCards
                                data={habits}
                                modify={modifyCard}
                                checkCard={checkCard}
                                activeCard={activeCard}
                                setActiveCard={setActiveCard}
                                onDrop={onDrop}
                                openContextMenu={openContextMenu}
                            />
                        </section>
                    </article>
                    <article>
                        <h1>Calendario</h1>
                        <section id="at-box">
                        </section>
                    </article>
                </section>

            </main>
        </>
    )
}