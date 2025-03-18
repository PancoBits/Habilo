import { Popup,Card } from "pixel-retroui";
import styles from "./DialogShop.module.css"

const DialogCustomize = ({closeModal,dialogOpen,itemsUser,equipItem}) => {
    return (
        <Popup
            isOpen={dialogOpen}
            onClose={closeModal}
            title="Personalización"
            bg="rgb(180, 227, 255)"
            baseBg="rgb(0, 11, 107)"
        >
            <div className={styles.shopContainer}>
            {itemsUser.map((item) => {
                return (
                    <Card
                        key={item.id}
                        className={styles.shopItem}
                        bg={item.active && "rgb(190, 255, 160)"}
                        onClick={()=>equipItem(item)}
                    >
                        <h3>{item.name}</h3>
                        <img src={"../src/assets/"+item.src}/>
                        <p>{item.active ? "Equipado" : "Equipar"}</p>
                    </Card>
                );
            })}
            {itemsUser.length === 0 && <h2>No se ha comprado nada</h2>}
            </div>
        </Popup>
    );
}

export default DialogCustomize;