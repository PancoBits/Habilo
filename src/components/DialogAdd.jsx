import styles from "./DialogAdd.module.css";
import { useState,useRef, useEffect } from "react";
import {Popup, TextArea, Input,Button} from 'pixel-retroui'
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {es}from 'date-fns/locale';
registerLocale("es",es)

const DialogAdd = ({closeModal,dialogOpen,startDate,setStartDate,isTask,isModified,actualCard,stats}) => {
    const [sendButton, setSendButton] = useState([false,false]);
    const [checkboxes,setCheckboxes] = useState(stats)
    const [buttonDisabled, setButtonDisabled] = useState(true)
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
            document.querySelector(`.${styles.buttonSave}`).classList.remove(styles.buttonSave);
            setButtonDisabled(false)
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
        if(event.target.name === "name"){
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
        if(actualButton[0] && actualButton[1]) {document.querySelector(`.${styles.buttonSave}`).classList.remove(styles.buttonSave); setButtonDisabled(false)}
        else {document.querySelector(`button[type="submit"]`).classList.add(styles.buttonSave); setButtonDisabled(true)}
    }

    const confirmation = () => {
        let message = "Estás seguro de eliminar "
        isTask ? message=message+`la tarea: ${actualCard.name}` 
               : message=message+`el hábito: ${actualCard.name}` 
        return confirm(message)
    }

    return( 
            <Popup
            className="text-center"
            isOpen={dialogOpen}
            onClose={(e) => confirm("Estás seguro de cerrar? se perderá cualquier progreso") && sendForm(e)}
             baseBg="#a900ff"
            bg="#f6e6ff"
            >
                <form key={dialogOpen} onSubmit={(e)=>!buttonDisabled ? sendForm(e) : e.preventDefault()} className={styles.info_item}>
                    <h2>Nombre</h2>
                    <Input bg="#fff6e6"
    textColor="black"
    borderColor="#ffa900" id={styles.name} name="name" autoComplete="on" autoFocus placeholder="Ej: Hacer ejercicio" onChange={isFilled} defaultValue={actualCard.name}></Input>
                    <h2>Descripción</h2>
                    <TextArea bg="#fff6e6"
    textColor="black"
    borderColor="#ffa900" className={styles.textAreas} id="description" defaultValue={actualCard.description}></TextArea>
                    {isTask && <h2>Finaliza</h2>}
                    {isTask && <div><DatePicker
                        id="date"
                        className={styles.datePicker}
                        showIcon
                        toggleCalendarOnIconClick
                        isClearable
                        closeOnScroll={true}
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        locale="es"
                        showMonthDropdown
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Sin fecha de finalización"/></div>}
                    <h2>Prioridad</h2>

                    <select name="priority" defaultValue={actualCard.priority} id={styles.selector}>
                        <option value={""}>Seleccione Prioridad</option>
                        <option value={"Alta"}>Alta</option>
                        <option value={"Media"}>Media</option>
                        <option value={"Baja"}>Baja</option>
                    </select>
                    
                    <h2>Etiqueta</h2>
                    <TextArea  bg="#fff6e6"
                    textColor="black"
                    borderColor="#ffa900" name="tags" className={styles.textAreas} defaultValue={typeof(actualCard.tags) === "undefined" ? undefined : actualCard.tags.join(", ")}></TextArea>

                    <h2>Tipo</h2>
                    <div className={styles.selectorStats}>
                        {stats.map(stat => <label className={styles.checkImg} key={stat.id}  > <input type="checkbox" id={stat.id} name="stat" ref={(element)=>(checkboxesRef.current[stat.id] = element)}  value={stat.name} checked={checkboxes[stat.id].check} onChange={isFilled}/> <h3>{stat.name}</h3> <img src={stat.src}/> </label>) }
                    </div>
                    <Button bg="#ff2900" textColor="white" type="button" onClick={() => confirm("Estás seguro de cerrar? se perderá cualquier progreso") && sendForm()}>Cancelar</Button>
                    <Button className={styles.buttonSave}  bg="#00ff29" textColor="white"  type="submit">Guardar</Button>
                    {isModified && <Button type="button" bg="#00d5ff" textColor="white" onClick={event => confirmation() && sendForm(event)}>Eliminar</Button>}
                </form>
            </Popup>
    )
};

export default DialogAdd