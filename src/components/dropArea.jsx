import {useState} from "react";
import styles from "./DropArea.module.css";

const DropArea = ({position,type,activeCard,onDrop}) => {
    const [isDrop,setIsDrop] = useState(false)

    const differentPosition = () => (position !== activeCard.position && position !== activeCard.position+1);
    const sameType = (e) => (e.target.getAttribute('name') === activeCard.type);

    return <div
            name={type}
            onDragEnter={e => differentPosition() && (sameType(e) && setIsDrop(true))}
            onDragLeave={e => differentPosition() && (sameType(e) && setIsDrop(false))}
            onDrop={e => { if(differentPosition() && sameType(e)){
                            onDrop();
                            setIsDrop(false)
                        }}}
            onDragOver={e => differentPosition() && (sameType(e) && e.preventDefault())}
            className={isDrop ? styles.da_show : styles.da_notshow}>
            Dejar aquí</div>
} 

export default DropArea