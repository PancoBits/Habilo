import styles from "./DialogAdd.module.css";
import { useState,useRef, forwardRef, useEffect } from "react";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {es}from 'date-fns/locale';
registerLocale("es",es)

const DialogAdd = forwardRef (function DialogAdd({closeModal,dialogOpen,startDate,setStartDate,isTask,isModified,actualCard,stats},ref) {
    const [sendButton, setSendButton] = useState([false,false]);
    const [checkboxes,setCheckboxes] = useState(stats)
    const buttonSendRef = useRef(null);
    const checkboxesRef = useRef([]);
    
    useEffect(() => {
        if(actualCard.stats !== undefined){
            setStartDate(actualCard.due)
            actualCard.stats.forEach(cardStat => {
                setCheckboxes(checks => checks.map(stat => 
                    stat.name === cardStat ? {...stat,check:!stat.check} : stat
                ))
            });
            setSendButton([true,true])
            buttonSendRef.current.disabled = false
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
            if(checkboxesRef.current.some((e) => e.checked)) actualButton=[].concat(sendButton.map((e,i) => i === 1 ? true : e));
            else actualButton=[].concat(sendButton.map((e,i) => i === 1 ? false : e));
            setCheckboxes(checkboxes.map(stat => 
                stat.id === event.target.id ? {...stat,check:!stat.check} : stat
            ))
        }
        setSendButton(actualButton)
        if(actualButton[0] && actualButton[1]) buttonSendRef.current.disabled = false
        else buttonSendRef.current.disabled = true
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
            <dialog ref={ref} className={styles.add_item} onKeyDown={noExit}>
                <form key={dialogOpen} onSubmit={sendForm} className={styles.info_item}>
                    <h2>Nombre</h2>
                    <textarea id={styles.name} name="name" autoComplete="on" autoFocus placeholder="Ej: Hacer ejercicio" onChange={isFilled} defaultValue={actualCard.name}></textarea>
                    <h2>Descrición</h2>
                    <textarea id="description" defaultValue={actualCard.description}></textarea>
                    {isTask && <h2>Finaliza</h2>}
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
                    <h2>Prioridad</h2>

                    <select name="priority" defaultValue={actualCard.priority}>
                        <option value={""}>Seleccione Prioridad</option>
                        <option value={"Alta"}>Alta</option>
                        <option value={"Media"}>Media</option>
                        <option value={"Baja"}>Baja</option>
                    </select>
                    
                    <h2>Etiqueta</h2>
                    <textarea name="tags" defaultValue={typeof(actualCard.tags) === "undefined" ? undefined : actualCard.tags.join(", ")}></textarea>

                    <div>
                        {stats.map(stat => <input key={stat.id} type="checkbox" id={stat.id} name="stat" ref={(element)=>(checkboxesRef.current[stat.id] = element)} value={stat.name} checked={checkboxes[stat.id].check} onChange={isFilled}/>) }
                    </div>
                    <button type="button" onClick={() => confirm("Estás seguro de cerrar? se perderá cualquier progreso") && sendForm()}>Cancelar</button>
                    <button ref={buttonSendRef} type="submit" disabled>Guardar</button>
                    {isModified && <button type="button" onClick={event => confirmation() && sendForm(event)}>Eliminar</button>}
                </form>
            </dialog>
    )
})

export default DialogAdd