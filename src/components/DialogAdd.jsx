import { useState,forwardRef, act } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DialogAdd = forwardRef (function DialogAdd({closeModal,dialogOpen},ref) {
    const [startDate, setStartDate] = useState(new Date());
    const [sendButton, setSendButton] = useState([false,false]);
    
    const sendForm = (event) => {
        setStartDate(new Date());
        setSendButton([false,false])
        closeModal(event)
    }

    const isFilled = (event) => {
        let actualButton = [];
        if(event.target.type === "textarea"){
            if(!(event.target.value === "" || event.target.value.trim() === "")){
                actualButton=[].concat(sendButton.map((e,i) => i === 0 ? true : e));
                setSendButton(actualButton)   
            }else{
                actualButton=[].concat(sendButton.map((e,i) => i === 0 ? false : e));
                setSendButton(actualButton)
            }
        }else{
            if(Array.prototype.some.call(document.querySelectorAll("input[name='skill']"), (e) => e.checked)){
                actualButton=[].concat(sendButton.map((e,i) => i === 1 ? true : e));
                setSendButton(actualButton)
            }else{
                actualButton=[].concat(sendButton.map((e,i) => i === 1 ? false : e));
                setSendButton(actualButton)
            }
        }
        if(actualButton[0] && actualButton[1]) document.querySelector("#send").disabled = false
        else document.querySelector("#send").disabled = true
    }
    
    return( 
        <>
            <dialog ref={ref} className="add-item">
                <form key={dialogOpen} onSubmit={sendForm}>
                    <h1>Nombre</h1>
                    <textarea placeholder="Ej: Hacer ejercicio" id="name" onChange={isFilled}></textarea>
                    <h1>Descrición</h1>
                    <textarea id="description"></textarea>
                    <h1>Finaliza</h1>
                    <DatePicker showIcon toggleCalendarOnIconClick selected={startDate} onChange={(date) => setStartDate(date)} id="date"/>
                    <h1>Prioridad</h1>

                    <select name="priority">
                        <option value={""}>Seleccione Prioridad</option>
                        <option value={"Alta"}>Alta</option>
                        <option value={"Media"}>Media</option>
                        <option value={"Baja"}>Baja</option>
                    </select>
                    
                    <h1>Etiqueta</h1>
                    <textarea></textarea>

                    <input type="checkbox" id="skill1" name="skill" value="Fuerza" onChange={isFilled}/>
                    <label htmlFor="skill1">Fuerza</label>

                    <input type="checkbox" id="skill2" name="skill" value="Inteligencia" onChange={isFilled}/>
                    <label htmlFor="skill2">Inteligencia</label>

                    <input type="checkbox" id="skill3" name="skill" value="Social" onChange={isFilled}/>
                    <label htmlFor="skill3">Social</label>

                    <input type="checkbox" id="skill4" name="skill" value="Bienestar" onChange={isFilled}/>
                    <label htmlFor="skill4">Bienestar</label>

                    <button type="button" onClick={() => sendForm()}>Cancelar</button>
                    <button type="submit" id="send" disabled>Ok</button>
                </form>
            </dialog>
        </>
    )
})

export default DialogAdd