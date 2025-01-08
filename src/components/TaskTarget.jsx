import { useState } from "react"

/* eslint-disable react/prop-types */
const Task = ({card,modify}) => {
    const [isChecked, setIsChecked] = useState(card.isFinished)
    const actIsFinished = (e) => {
        setIsChecked(e.target.checked)
        card.finished = e.target.checked;
    }
    return(
        <div className="Task">
            <article onClick={()=>modify(card)}>
            <h1 style={{margin: "initial"}}>{card.name}</h1>
            <p style={{margin: "initial"}}>{card.description}</p>
            <p style={{margin: "initial"}}>{card.priority}</p>
            <p style={{margin: "initial"}}>{card.tags}</p>
            <p style={{margin: "initial"}}>{card.stats}</p>
            <p style={{margin: "initial"}}>{card.isFinished}</p>
            <h4 style={{margin: "initial"}}>{card.due}</h4>
            </article>
            <div className="task-check">
                <input checked={isChecked} type="checkbox" onChange={actIsFinished}></input>
            </div>
        </div>
    )
}

export default Task