import { useState, useEffect } from "react";
import styles from "./TaskTarget.module.css";

const Task = ({ card, modify, checkCard, setActiveCard, openContextMenu }) => {
  const [isChecked, setIsChecked] = useState(card.isFinished);

  useEffect(()=>{
    setIsChecked(card.isFinished)
  },[card])

  const cardPriority = () => {
    switch (card.priority) {
      case "Alta":
        return "red";
      case "Media":
        return "orange";
      case "Baja":
        return "green";
      default:
        return "gray";
    }
  };

  const cardDue = () => {
    if (card.due) {
      if (
        new Date().getMonth() === new Date(card.due).getMonth() &&
        new Date().getDate() === new Date(card.due).getDate()
      )
        return "navy";
      else return new Date() < new Date(card.due) ? "black" : "red";
    } else return "black";
  };

  const actIsFinished = (e) => {
    setIsChecked(e.target.checked);
    checkCard(card, e.target.checked);
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        setActiveCard(card);
        e.target.classList.add("dragging");
      }}
      onDragEnd={(e) => {
        setActiveCard(null);
        e.target.classList.remove("dragging");
      }}
      className={styles.Task}
      style={{ opacity: `${isChecked ? 0.3 : 1}` }}
    >
      <article onClick={() => modify(card)}>
        <h3>{card.name}</h3>
        <p>{card.description}</p>
        <abbr
          className={styles.element_cover}
          title={card.priority ? `${card.priority} Priority` : "No priority"}
        >
          <div
            className={styles.triangulo}
            style={{ borderLeft: `20px solid ${cardPriority()}` }}
          ></div>
        </abbr>
        <abbr
          className={styles.element_cover}
          title={card.tags ? `Tags: ${card.tags}` : "No tags"}
        >
          <div className={styles.message}></div>
        </abbr>
        <abbr className={styles.element_cover} title={`Stats: ${card.stats}`}>
          <div className={styles.circle}></div>
        </abbr>
        <p>{card.isFinished}</p>
        {card.due && (
          <h4 style={{ color: `${cardDue()}` }}>
            {new Date(card.due).toLocaleDateString("es-ES")}
          </h4>
        )}
      </article>
      <div
        className={styles.Task_check}
        style={{ backgroundColor: `${isChecked ? "gray" : card.color}` }}
        onContextMenu={(e) => openContextMenu(e, card)}
      >
        <input
          checked={isChecked}
          type="checkbox"
          onChange={actIsFinished}
          name="check"
        ></input>
      </div>
    </div>
  );
};

export default Task;
