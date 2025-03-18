import { Popup,Button,Input } from "pixel-retroui";
import styles from "./DialogChangeName.module.css"
import {useState,useEffect} from "react"

const DialogChangeName = ({closeModal,dialogOpen,slime,changeName}) => {
    const [inputValue,setInputValue] = useState(slime.name) 
    useEffect(()=>{
        setInputValue(slime.name)
    },[slime])
    const insertInput = () => {
        if(inputValue !== "" && inputValue.trim() !== "" && inputValue !== slime.name){
            changeName(inputValue)
        }else{
            alert("No se ha podido cambiar el nombre")
        }
    }

    return (
        <Popup
            isOpen={dialogOpen}
            onClose={closeModal}
            title="Apodo"
            bg="rgb(255, 253, 118)"
            baseBg="rgb(107, 96, 0)"
        >
            <div className={styles.userContainer}>
                <Input placeholder="Nuevo Nombre" bg="white" textColor="black" value={inputValue} onChange={(e) => setInputValue(e.target.value)}>
                
                </Input>
            <Button className={`${(inputValue === "" || inputValue.trim() === "" || inputValue === slime.name) && styles.buttonChange}`} onClick={insertInput} bg="#b0f" textColor="white">Cambiar Nombre</Button>
            </div>
        </Popup>
    );
}

export default DialogChangeName;