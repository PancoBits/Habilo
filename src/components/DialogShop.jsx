import { Popup,Card } from "pixel-retroui";
import styles from "./DialogShop.module.css"

const DialogShop = ({closeModal,dialogOpen,itemsShop,purchaseItem,gel}) => {
    const buyItem = (item) =>{
        if(item.price <= gel){
            window.confirm("¿Estás seguro de comprar "+item.name+" por "+item.price+" G?") && purchaseItem(item)
        }else if(item.price > gel){
            alert("No se tiene la suficiente cantidad de Gel para comprarlo, faltan "+(item.price-gel)+" G")
        }
    }
    return (
        <Popup
            isOpen={dialogOpen}
            onClose={closeModal}
            title="Tienda"
            bg="rgb(255, 196, 118)"
            baseBg="rgb(107, 61, 0)"
        >
            <div className={styles.shopContainer}>
            {itemsShop.map((item) => {
                return (
                    <Card
                        key={item.id}
                        onClick={() => buyItem(item)}
                        bg={isNaN(item.price) && "rgb(190, 255, 160)"}
                        className={`${styles.shopItem} ${(item.price > gel || item.bought) && styles.itemDisabled}`}
                    >
                        <h3>{item.name}</h3>
                        <img src={"../src/assets/"+item.src}/>
                        <p>{item.price} {!isNaN(item.price) && <span>G</span>}</p>
                    </Card>);
            })}
            </div>
        </Popup>
    );
}

export default DialogShop;