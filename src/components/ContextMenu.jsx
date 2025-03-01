import { forwardRef } from "react"
import styles from "./ContextMenu.module.css"

const ContextMenu = forwardRef (function ContextMenu ({colors,open,ContextMenuX,ContextMenuY,closeContextMenu},ref){
    return (
        <div ref={ref} style={{top: ContextMenuY + 2 + "px",left: ContextMenuX + 2 + "px"}}
            className={open ? styles.CM_show : styles.CM_notshow}>
            {colors.map((color,id) => {
                return (
                        <button
                            key={color.id}
                            className={styles.cm_button}
                            onClick={closeContextMenu}
                            style={{backgroundColor:`${color.color}`}}>
                        </button>
                    )
                }
            )}
        </div> 
    )
})

export default ContextMenu