import { Popup,Button,TextArea } from "pixel-retroui";
import {useRef} from "react";
import styles from "./DialogUser.module.css"

const DialogUser = ({closeModal,dialogOpen,saveData,loadData}) => {
    const textAreaRef = useRef(null)

    const incrustData = async () =>{
        const data = await saveData();
        data && (textAreaRef.current.value = data); 
    }

    const extractInfo = () =>{
        loadData(textAreaRef.current.value)
    }

    return (
        <Popup
            isOpen={dialogOpen}
            onClose={closeModal}
            title="Usuario"
            bg="rgb(255, 118, 118)"
            baseBg="rgb(107, 0, 0)"
        >
            <div className={styles.userContainer}>
            <Button onClick={incrustData} bg="#00df18" textColor="white">
                Exportar Data
            </Button>

            <TextArea ref={textAreaRef} className={styles.textAreaUser}>
                
            </TextArea>
            <Button onClick={extractInfo} bg="#b0f" textColor="white">Cargar Data</Button>
            </div>
        </Popup>
    );
}

export default DialogUser;