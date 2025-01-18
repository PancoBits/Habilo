import { useState } from "react"

/* eslint-disable react/prop-types */
const Task = ({card,modify,setActiveCard}) => {
    const [isChecked, setIsChecked] = useState(card.isFinished)
    const actIsFinished = (e) => {
        setIsChecked(e.target.checked)
        card.setfinished = e.target.checked;
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
                {card.due !== null && <h4 style={{margin: "initial"}}>{card.due.toLocaleDateString("es-ES")}</h4>}
            </article>
            <div className="task-check">
                <input checked={isChecked} type="checkbox" onChange={actIsFinished} name="check"></input>
            </div>
        </div>
    )
}

export default Task