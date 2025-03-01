import styles from "./App.module.css";
import { Card } from "./Card";
import Task from "./components/TaskTarget"
import DialogAdd from "./components/DialogAdd";
import DropArea from "./components/DropArea"
import ContextMenu from "./components/ContextMenu";
import {Fragment,useState, useRef, useEffect, useCallback } from "react";

const ButtonAdd = ({content,activateModal}) => {
    return(
        <button className={styles.at_button} onClick={() => activateModal(content)}>{content}</button>
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

    const [slime,setSlime] = useState({
        name: "Habilo",
        level: {level:2,progress:0},
        life: 100,
        gel: 1000,
        Strength: {level:2,progress:0},
        Intelligence: {level:2,progress:1},
        Social: {level:1,progress:0},
        Welfare: {level:1,progress:0}
    })

    const [habits, setHabits] = useState([new Card(
        0,
        "Leer un libro al mes",
        "Final del año con 12 libros leídos",
        null,
        "Alta",
        ["personal","habilidad"],
        ["Intelligence", "Welfare"],
        false,
        "habit",
        0,
        "aquamarine"
    )])

    const [tasks, setTasks] = useState([new Card(
        0,
        "Estudiar robótica",
        "Para el proyecto final",
        new Date(2025,0,22),
        "Media",
        ["estudio"],
        ["Intelligence"],
        false,
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
        ["Intelligence","Social"],
        false,
        "task",
        1,
        "black"
    )])

    const stats = [{
        id: "0",
        name: "Strength",
        check: false
    },{
        id: "1",
        name: "Intelligence",
        check: false
    },{
        id: "2",
        name: "Social",
        check: false
    },{
        id: "3",
        name: "Welfare",
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

    useEffect(()=>{
        document.getElementById(`${styles.level}`).style.width = `${slime.level.progress}%`;
        document.getElementById(`${styles.life}`).style.width = `${slime.life}%`

        function createProgressBar(name,divisions,progress) {
            const progressBar = document.getElementById(`${styles[name]}`);
            progressBar.innerHTML = '';
            for (let i = 0; i < divisions; i++) {
                const segment = document.createElement('div');
                segment.classList.add(`${styles.progress_segment}`);
                progressBar.appendChild(segment);
            }
            [].filter.call(document.querySelectorAll(`#${styles[name]} .${styles.progress_segment}`),(_,id) => id < progress).forEach(e => e.style.backgroundColor = "#7fffd4")
        }
        stats.forEach(e=> createProgressBar(e.name,slime[e.name].level,slime[e.name].progress))
    },[slime])

    const changeName = (event) =>{
        console.log("a",event.target)
        //setSlime({...slime,name:event.target.value})
    }

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
        if(isCheck){
            if(typeof(card.awards) === "undefined"){
                let value, award, level

                switch (card.priority) {
                    case "Baja":
                        award = Math.floor(Math.random() * (200 - 1 + 1)) + 1;
                        value = 0.20;
                        break;
                    case "Media":
                        award = Math.floor(Math.random() * (600 - 200 + 1)) + 200;
                        value = 0.60;
                        break;
                    case "Alta":
                        award = Math.floor(Math.random() * (800 - 600 + 1)) + 600;
                        value = 0.80;
                        break;
                    default:
                        award = Math.floor(Math.random() * (400 - 200 + 1)) + 200;
                        value = 0.40;
                }
                let progress = Math.round(100*value/slime.level.level);

                progress+slime.level.progress >= 100 ? level = {level:slime.level.level+1,progress:0}
                                                     : level = {level:slime.level.level,progress:slime.level.progress+progress}
                
                let auxSlime = {...slime,level:level,gel:slime.gel+award}
                
                card.stats.forEach(e => {
                    let {level,progress} = slime[e]

                    if(progress + 1 >= level){
                        level++;
                        progress = 0
                    }else{
                        progress++;
                    }
                    auxSlime = {...auxSlime,[e]: {level:level,progress:progress}};
                })

                setSlime(auxSlime)

                if(card.type === "task"){
                    const cardIndex = tasks.indexOf(card)
                    setTasks(tasks.map((task,i) => {
                        if(i === cardIndex){
                            return task.cloneWithChanges({awards: {award: award,progress: progress}})
                        }
                        return task
                    }))
                }else {
                    const cardIndex = habits.indexOf(card)
                    setHabits(habits.map((habit,i) => {
                        if(i === cardIndex){
                            return habit.cloneWithChanges({awards: {award: award,progress: progress}})
                        }
                        return habit
                    }))
                }
            }else{
                let level
                if(card.awards.progress+slime.level.progress >= 100)
                    level = {level:slime.level.level+1,progress:0}
                else
                    level = {level:slime.level.level,progress:slime.level.progress+card.awards.progress}
                setSlime({...slime,level:level,gel:slime.gel+card.awards.award})
            }
        }else{
            let level = {level:slime.level.level,progress:slime.level.progress-card.awards.progress}
            setSlime({...slime,level:level,gel:slime.gel-card.awards.award})
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
            <header id={styles.App_header}>
                <h1>Administrador de Tareas</h1>
                <div>
                    <img src="./src/assets/a.svg" alt="Slime"/>
                </div>
                {/*<div>
                    <img src="./src/assets/store.svg" alt="Store"/>
                </div>
                <div>
                <img src="./src/assets/user.svg" alt="User"/>
                </div>*/}
            </header>
            
            <div style={{background: "white"}}>
                <section className={styles.App}>
                    <article className={styles.App_info}>
                        <h2>Lvl. {slime.level.level < 10 ? `0${slime.level.level}` : `${slime.level.level}`} {slime.level.progress}/100</h2>
                        <div className={styles.status_bar}>
                            <div id={styles.level}></div>
                        </div>
                        <h2>{slime.life}/100</h2>
                        <div className={styles.status_bar}>
                            <div id={styles.life}></div>
                        </div>
                        <h2>Gel:</h2>
                        <div className={styles.status_bar}>
                            <div id={styles.gel}>
                                <span>{slime.gel}</span>
                            </div>            
                        </div>
                    </article>

                    <article id={styles.slime} className={styles.App_info}>
                        <div id={styles.slime_img}>
                            <img src="./src/assets/a.svg" alt="Slime"/>
                        </div>
                        <input type="text" id={styles.name} onClick={changeName} autoComplete="off" readOnly value={slime.name} />
                    </article>

                    <article id={styles.App_stats} className={styles.App_info}>
                    
                        {stats.map(e=>{
                            return (<article key={e.id}>
                                <h2>{e.name} Lvl. {slime[e.name].level < 10 ? `0${slime[e.name].level}` : `${slime[e.name].level}`}</h2>
                                <div className={styles.status_bar}>
                                <div id={styles[e.name]}></div>
                                </div>
                                </article>)
                        })}
                    
                        
                    </article>
                </section>
                </div>

                <section id={styles.App_tracker}>
                    <article className={styles.App_info}>
                        <h2>Por Hacer</h2>
                        <section id={styles.at_box}>
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
                    <article className={styles.App_info}>
                        <h2>Hábitos</h2>
                        <section id={styles.at_box}>
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
                    <article className={styles.App_info}>
                        <h2>Calendario</h2>
                        <section id={styles.at_box}>
                        </section>
                    </article>
                </section>
        </>
    )
}