import { useState,forwardRef, useEffect } from "react";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {es}from 'date-fns/locale';
registerLocale("es",es)

/* eslint-disable react/prop-types */
const DialogAdd = forwardRef (function DialogAdd({closeModal,dialogOpen,startDate,setStartDate,isTask,isModified,actualCard,stats},ref) {
    const [sendButton, setSendButton] = useState([false,false]);
    const [checkboxes,setCheckboxes] = useState(stats)
    
    useEffect(() => {
        if(actualCard.stats !== undefined){
            setStartDate(actualCard.due)
            actualCard.stats.forEach(cardStat => {
                setCheckboxes(checks => checks.map(stat => 
                    stat.name === cardStat ? {...stat,check:!stat.check} : stat
                ))
            });
            setSendButton([true,true])
            document.querySelector("#send").disabled = false
        }
    },[actualCard])

    const sendForm = (event) => {
        setStartDate(new Date());
        setSendButton([false,false])
        setCheckboxes(stats)
        closeModal(event)
    }

    const isFilled = (event) => {
        let actualButton = [];
        if(event.target.type === "textarea"){
            if(!(event.target.value === "" || event.target.value.trim() === "")) actualButton=[].concat(sendButton.map((e,i) => i === 0 ? true : e));
            else actualButton=[].concat(sendButton.map((e,i) => i === 0 ? false : e));
        }else{
            if(Array.prototype.some.call(document.querySelectorAll("input[name='stat']"), (e) => e.checked)) actualButton=[].concat(sendButton.map((e,i) => i === 1 ? true : e));
            else actualButton=[].concat(sendButton.map((e,i) => i === 1 ? false : e));
            setCheckboxes(checkboxes.map(stat => 
                stat.id === event.target.id ? {...stat,check:!stat.check} : stat
            ))
        }
        setSendButton(actualButton)
        if(actualButton[0] && actualButton[1]) document.querySelector("#send").disabled = false
        else document.querySelector("#send").disabled = true
    }

    const confirmation = () => {
        let message = "Estás seguro de eliminar "
        isTask ? message=message+`la tarea: ${actualCard.name}` 
               : message=message+`el hábito: ${actualCard.name}` 
        return confirm(message)
    }

    const noExit = (event) =>{
        if(event.key === "Escape"){
            event.preventDefault();
            (confirm("Estás seguro de cerrar? se perderá cualquier progreso")) && sendForm()
        }
    }

    return( 
            <dialog ref={ref} className="add-item" onKeyDown={noExit}>
                <form key={dialogOpen} onSubmit={sendForm} className="info-item">
                    <h1>Nombre</h1>
                    <textarea id="name" autoComplete="on" autoFocus placeholder="Ej: Hacer ejercicio" onChange={isFilled} defaultValue={actualCard.name}></textarea>
                    <h1>Descrición</h1>
                    <textarea id="description" defaultValue={actualCard.description}></textarea>
                    {isTask && <h1>Finaliza</h1>}
                    {isTask && <DatePicker
                        id="date"
                        showIcon
                        toggleCalendarOnIconClick
                        isClearable
                        closeOnScroll={true}
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        locale="es"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Sin fecha de finalización"/>}
                    <h1>Prioridad</h1>

                    <select name="priority" defaultValue={actualCard.priority}>
                        <option value={""}>Seleccione Prioridad</option>
                        <option value={"Alta"}>Alta</option>
                        <option value={"Media"}>Media</option>
                        <option value={"Baja"}>Baja</option>
                    </select>
                    
                    <h1>Etiqueta</h1>
                    <textarea name="tags" defaultValue={typeof(actualCard.tags) === "undefined" ? undefined : actualCard.tags.join(", ")}></textarea>

                    <div>
                        {stats.map(stat => <input key={stat.id} type="checkbox" id={stat.id} name="stat" value={stat.name} checked={checkboxes[stat.id].check} onChange={isFilled}/>) }
                    </div>
                    <button type="button" onClick={() => confirm("Estás seguro de cerrar? se perderá cualquier progreso") && sendForm()}>Cancelar</button>
                    <button type="submit" id="send" disabled>Guardar</button>
                    {isModified && <button type="button" onClick={event => confirmation() && sendForm(event)}>Eliminar</button>}
                </form>
            </dialog>
    )
})

export default DialogAdd