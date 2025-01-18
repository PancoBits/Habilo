import "./App.css"
import { Card } from "./Card";
import Task from "./components/TaskTarget"
import DialogAdd from "./components/DialogAdd";
import DropArea from "./components/dropArea"
import {Fragment,useState, useRef } from "react";

/* eslint-disable react/prop-types */

const ButtonAdd = ({content,activateModal}) => {
    return(
        <button className="at-button" onClick={() => activateModal(content)}>{content}</button>
    )
};

const ShowCards = ({data,modify,activeCard,setActiveCard,onDrop}) => {
    const display = () => {
        return data.map(card => 
         (
            <Fragment  key={card.id}>
                <Task card={card} modify={modify} setActiveCard={setActiveCard}/>
                <DropArea position={card.position+1} type={card.type} activeCard={activeCard} onDrop={() => onDrop(card.position+1,card.type)}></DropArea>
            </Fragment>
        )
        )
    };
    return <>{display()}</>
}

export function App(){

    const dialogModal = useRef();
    const [dialogOpen, setDialog] = useState(false)
    const [startDate, setStartDate] = useState(new Date())
    const [isTask, setIsTask] = useState(false)
    const [isModified, setIsModified] = useState(false)
    const [actualCard, setActualCard] = useState(new Card())
    const [activeCard, setActiveCard] = useState(null)
    
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
        0
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
        0
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
        1
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

    const taskMessage = "Nuevo por hacer"
    const habitMessage = "Nuevo hábito"

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
                                        .map((task,i) => {task.setposition = i; return task}))
                        : setHabits(habits.filter((_,id) => id !== habits.indexOf(actualCard))
                                        .map((habit,i) => {habit.setposition = i; return habit}))
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

    const onDrop = (position,cardType) => {
        if(position !== activeCard.position && position !== activeCard.position+1){
            let cardsChange = (cardType === "task") ? [...tasks] : [...habits]

            cardsChange.splice(position,0,activeCard)
            cardsChange.splice(cardsChange.findIndex((card,i) =>
            card.id === activeCard.id ? (i!=position ? true : false) : false),1)
            
            cardType === "task" ? setTasks(cardsChange.map((card,i) => {
                                    card.setposition = i
                                    return card
                                }))
                                : setHabits(cardsChange.map((card,i) => {
                                    card.setposition = i
                                    return card
                                }))
        }
    }

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
                            <ShowCards activeCard={activeCard} data={tasks} modify={modifyCard} setActiveCard={setActiveCard} onDrop={onDrop}/>
                        </section>
                    </article>
                    <article>
                        <h1>Hábitos</h1>
                        <section id="at-box">
                        <ButtonAdd content={habitMessage} activateModal={activateModal}/>
                        <DropArea position={0} type={"habit"} activeCard={activeCard} onDrop={() => onDrop(0,"habit")}></DropArea>
                        <ShowCards activeCard={activeCard} data={habits} modify={modifyCard} setActiveCard={setActiveCard} onDrop={onDrop}/>
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