import { forwardRef } from "react"

const ContextMenu = forwardRef (function ContextMenu ({colors,open,ContextMenuX,ContextMenuY,closeContextMenu},ref){
    return (
        <div ref={ref} style={{top: ContextMenuY + 2 + "px",left: ContextMenuX + 2 + "px"}}
            className={open ? "CM-show" : "CM-notshow"}>
            {colors.map((color,id) => {
                return (
                        <button
                            key={color.id}
                            className="cm-button"
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