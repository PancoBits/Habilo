import { useState } from "react"

const Task = ({card,modify,checkCard,setActiveCard,openContextMenu}) => {
    const [isChecked, setIsChecked] = useState(card.isFinished)
    
    const cardDue = () => {
        if(card.due){
            if(new Date().getMonth() === card.due.getMonth() && new Date().getDate() === card.due.getDate())
                return "navy";
            else
                return new Date() < card.due ? "black" : "red"
        }else return "black"
    }
    
    const actIsFinished = (e) => {
        setIsChecked(e.target.checked)
        checkCard(card,e.target.checked)
    }

    return(
        <div draggable onDragStart={ e =>{setActiveCard(card); e.target.classList.add("dragging")}} onDragEnd={e => {setActiveCard(null); e.target.classList.remove("dragging")}} className="Task">
            <article onClick={()=>modify(card)}>
                <h1 style={{margin: "initial"}}>{card.name}</h1>
                <p style={{margin: "initial"}}>{card.description}</p>
                <p style={{margin: "initial"}}>{card.priority}</p>
                <p style={{margin: "initial"}}>{card.tags}</p>
                <p style={{margin: "initial"}}>{card.stats}</p>
                <p style={{margin: "initial"}}>{card.isFinished}</p>
                {card.due && <h4 style={{margin: "initial", color: `${cardDue()}`}}>{card.due.toLocaleDateString("es-ES")}</h4>}
            </article>
            <div className="task-check" style={{backgroundColor:`${card.color}`}} onContextMenu={ e => openContextMenu(e,card)}>
                <input checked={isChecked} type="checkbox" onChange={actIsFinished} name="check"></input>
            </div>
        </div>
    )
}

export default Task