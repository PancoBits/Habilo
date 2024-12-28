/* eslint-disable react/prop-types */
const Task = ({name,priority,tags,stats,descripcion,due,isFinished}) => {
    return(
        <div className="Task">
            <h1 style={{margin: "initial"}}>{name}</h1>
            <p style={{margin: "initial"}}>{descripcion}</p>
            <h4 style={{margin: "initial"}}>{due.getDate()}/{due.getMonth() + 1}/{due.getFullYear()}</h4>
        </div>
    )
}

export default Task