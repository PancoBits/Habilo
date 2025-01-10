import "./App.css"
import { Card } from "./Card";
import Task from "./components/TaskTarget"
import DialogAdd from "./components/DialogAdd";
import { useState, useRef } from "react";

/* eslint-disable react/prop-types */

const ButtonAdd = ({content,activateModal}) => {
    return(
        <button className="at-button" onClick={() => activateModal(content)}>{content}</button>
    )
};

const ShowCards = ({data,modify}) => {
    const display = () => {
        return data.map(card => 
         (
            <Task key={card.id} card={card} modify={modify}/>
        )
        )
    };
    return <>{display()}</>
}

export function App(){

    const dialogModal = useRef();
    const [dialogOpen, setDialog] = useState(false)
    const [isTask, setIsTask] = useState(false)
    const [isModified, setIsModified] = useState(false)
    const [actualCard, setActualCard] = useState(new Card())
    const [habits, setHabits] = useState([new Card(
        0,
        "Leer un libro al mes",
        "Final del año con 12 libros leídos",
        null,
        "Alta",
        ["personal","habilidad"],
        ["Inteligencia", "Bienestar"],
        true,
        "habit"
    )])

    const [tasks, setTasks] = useState([new Card(
        0,
        "Estudiar robótica",
        "Para el proyecto final",
        `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
        "Media",
        ["estudio"],
        ["Inteligencia"],
        true,
        "task"
    ),new Card(
        1,
        "Prepararme para entrevista",
        "Por fin se va a conseguir trabajo",
        `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
        "Alta",
        ["personal"],
        ["Inteligencia","Social"],
        false,
        "task"
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
        if(content === habitMessage) setIsTask(false)
        else setIsTask(true)
        
        setDialog(!dialogOpen);
        dialogModal.current.showModal();
    };

    const closeModal = (event) => {
        if(typeof(event) !== "undefined"){
            
            if(event.type === "submit"){
                event.preventDefault();
                let id=0,date,type;

                if(isTask){
                    tasks.forEach(task => 
                    task.id>=id && (id=task.id+1)
                    )
                    date = event.target.date.value;
                    type = "task";
                }else{
                    habits.forEach(habit => 
                        habit.id>=id && (id=habit.id+1)
                    )
                    date = null;
                    type = "habit";
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
                    type
                )

                if(isModified){
                    isTask ? setTasks(tasks.map(task => task.id == actualCard.id ? newCard : task))
                        : setHabits(habits.map(habit => habit.id == actualCard.id ? newCard : habit))
                }
                
                !isModified && (isTask ? setTasks(tasks.concat(newCard)) : setHabits(habits.concat(newCard)))
            }else{
                isTask ? setTasks(tasks.filter((_,id) => id !== tasks.indexOf(actualCard)))
                    : setHabits(habits.filter((_,id) => id !== habits.indexOf(actualCard)))
            }
        }
        setDialog(!dialogOpen)
        setActualCard(new Card())
        isModified && setIsModified(!isModified)
        dialogModal.current.close();
    };

    const modifyCard = (card) => {
        if(card.type === "task") setIsTask(true)
        else setIsTask(false)

        setActualCard(card);
        setIsModified(!isModified)
        setDialog(!dialogOpen);
        dialogModal.current.showModal();
    }

    return(
        <>
            <DialogAdd ref={dialogModal} dialogOpen={dialogOpen} closeModal={closeModal} isTask={isTask} isModified={isModified} actualCard={actualCard} stats={stats}/>
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
                    <article>
                        <h3>Nivel de Mascota</h3>
                        <h3>Vida de Mascota</h3>
                        <h3>Gelatina</h3>
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
                            <ShowCards data={tasks} modify={modifyCard}/>
                        </section>
                    </article>
                    <article>
                        <h1>Hábitos</h1>
                        <section id="at-box">
                        <ButtonAdd content={habitMessage} activateModal={activateModal}/>
                        <ShowCards data={habits} modify={modifyCard}/>
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