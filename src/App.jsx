import styles from "./App.module.css";
import { Card } from "./Card";
import Task from "./components/TaskTarget";
import DialogAdd from "./components/DialogAdd";
import DropArea from "./components/DropArea";
import ContextMenu from "./components/ContextMenu";
import { Fragment, useState, useRef, useEffect, useCallback } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useLocalStorage } from "./components/useLocalStorage";

const ButtonAdd = ({ content, activateModal }) => {
  return (
    <button className={styles.at_button} onClick={() => activateModal(content)}>
      {content}
    </button>
  );
};

const ShowCards = ({
  data,
  modify,
  checkCard,
  activeCard,
  setActiveCard,
  onDrop,
  openContextMenu,
}) => {
  const display = () => {
    return (
      data &&
      data.map((card) => (
        <Fragment key={card.id}>
          <Task
            card={card}
            modify={modify}
            checkCard={checkCard}
            setActiveCard={setActiveCard}
            openContextMenu={openContextMenu}
          />
          <DropArea
            position={card.position + 1}
            type={card.type}
            activeCard={activeCard}
            onDrop={() => onDrop(card.position + 1, card.type)}
          ></DropArea>
        </Fragment>
      ))
    );
  };
  return <>{display()}</>;
};

export function App() {
  const [tasks, setTasks] = useLocalStorage(
    "tasks",
    [
      new Card(
        0,
        "Estudiar robótica",
        "Para el proyecto final",
        new Date(2025, 0, 22).toDateString(),
        "Media",
        ["estudio"],
        ["Intelligence"],
        false,
        "task",
        0,
        "red"
      ),
      new Card(
        1,
        "Prepararme para entrevista",
        "Por fin se va a conseguir trabajo",
        new Date().toDateString(),
        "Alta",
        ["personal"],
        ["Intelligence", "Social"],
        false,
        "task",
        1,
        "black"
      ),
    ],
    "card"
  );
  const [habits, setHabits] = useLocalStorage(
    "habits",
    [
      new Card(
        0,
        "Leer un libro al mes",
        "Final del año con 12 libros leídos",
        null,
        "Alta",
        ["personal", "habilidad"],
        ["Intelligence", "Welfare"],
        false,
        "habit",
        0,
        "aquamarine"
      ),
    ],
    "card"
  );

  /**[
   [{ date: "2025-12-29", type: "task", id: 0 }],
    [{ date: "2025-12-31", type: "task", id: 0 }],
    [{ date: "2025-01-01", type: "task", id: 0 }],
    [{ date: "2025-01-02", type: "task", id: 0 }],
    [{ date: "2025-01-03", type: "task", id: 0 }],
    [{ date: "2025-01-04", type: "task", id: 0 }],
    [{ date: "2025-01-05", type: "task", id: 0 }],
    [{ date: "2025-01-06", type: "task", id: 0 }],
    [{ date: "2025-01-07", type: "task", id: 0 }],
    [{ date: "2025-01-08", type: "task", id: 0 }],
    [{ date: "2025-01-09", type: "task", id: 0 }],
    [{ date: "2025-01-10", type: "task", id: 0 }],
    [{ date: "2025-01-11", type: "task", id: 0 }],
    [{ date: "2025-01-12", type: "task", id: 0 }],
  ] */

  const [record, setRecord] = useLocalStorage("record", []);

  const [slime, setSlime] = useLocalStorage("slime", {
    name: "Habilo",
    level: { level: 1, progress: 0 },
    life: 100,
    gel: 1000,
    Strength: { level: 1, progress: 0 },
    Intelligence: { level: 1, progress: 0 },
    Social: { level: 1, progress: 0 },
    Welfare: { level: 1, progress: 0 },
  });

  const sameDate = (date1, date2) => {
    if (date1 && date2) {
      return (
        date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate()
      );
    } else {
      return false;
    }
  };

  const updateDates = useCallback(() => {
    let aux = [];
    record.forEach((e) => {
      if (e && e[0]) {
        let auxObjet = { date: e[0].date, count: e.length };
        aux.push(auxObjet);
      }
    });
    return aux;
  }, [record]);

  const calculateStreak = useCallback(() => {
    const fechas = record
      .filter((e) => e.length !== 0)
      .map((fecha) => {
        if (fecha[0]) return new Date(fecha[0].date);
      })
      .sort((a, b) => a - b);
    let fechaActual = fechas[fechas.length - 1];
    let contador = sameDate(fechaActual, new Date()) ? 1 : 0;

    for (let i = fechas.length - 2; i >= 0; i--) {
      const fechaAnterior = fechas[i];
      const diferencia = (fechaActual - fechaAnterior) / (1000 * 3600 * 24);

      if (diferencia === 1) {
        contador++;
        fechaActual = fechaAnterior;
      } else if (diferencia > 1) {
        break;
      }
    }
    return contador;
  }, [record]);

  const dialogModal = useRef();
  const contextMenuRef = useRef();
  const [dialogOpen, setDialog] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [isTask, setIsTask] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [actualCard, setActualCard] = useState(new Card());
  const [activeCard, setActiveCard] = useState(null);
  const [datesCalendar, setDatesCalendar] = useState(updateDates());
  const [allStreak, setAllStreak] = useState(calculateStreak());
  const [contextMenu, setContextMenu] = useState({
    open: false,
    x: 0,
    y: 0,
  });
  const stats = [
    {
      id: "0",
      name: "Strength",
      check: false,
    },
    {
      id: "1",
      name: "Intelligence",
      check: false,
    },
    {
      id: "2",
      name: "Social",
      check: false,
    },
    {
      id: "3",
      name: "Welfare",
      check: false,
    },
  ];

  const colors = [
    { id: 0, color: "#000000" },
    { id: 1, color: "#FF0000" },
    { id: 2, color: "#000080" },
    { id: 3, color: "#800080" },
    { id: 4, color: "#FF8C00" },
    { id: 5, color: "#228B22" },
    { id: 6, color: "#8B4513" },
    { id: 7, color: "#7fffd4" },
  ];

  const taskMessage = "Nuevo por hacer";
  const habitMessage = "Nuevo hábito";

  useEffect(() => {
    setDatesCalendar(updateDates());
  }, [record, updateDates]);

  useEffect(() => {
    setAllStreak(calculateStreak());
  }, [record, calculateStreak]);

  useEffect(() => {
    document.addEventListener("click", closeContextMenu);
    document.addEventListener("scroll", closeContextMenu);
    document.addEventListener("keydown", closeContextMenu);
    document.addEventListener("visibilitychange", closeContextMenu);
    document.addEventListener("dragstart", closeContextMenu);
    return () => {
      document.removeEventListener("click", closeContextMenu);
      document.removeEventListener("scroll", closeContextMenu);
      document.removeEventListener("keydown", closeContextMenu);
      document.removeEventListener("visibilitychange", closeContextMenu);
      document.removeEventListener("dragstart", closeContextMenu);
    };
  }, [contextMenu]);

  useEffect(() => {
    document.getElementById(
      `${styles.level}`
    ).style.width = `${slime.level.progress}%`;
    document.getElementById(`${styles.life}`).style.width = `${slime.life}%`;

    function createProgressBar(name, divisions, progress) {
      const progressBar = document.getElementById(`${styles[name]}`);
      progressBar.innerHTML = "";
      for (let i = 0; i < divisions; i++) {
        const segment = document.createElement("div");
        segment.classList.add(`${styles.progress_segment}`);
        progressBar.appendChild(segment);
      }
      [].filter
        .call(
          document.querySelectorAll(
            `#${styles[name]} .${styles.progress_segment}`
          ),
          (_, id) => id < progress
        )
        .forEach((e) => (e.style.backgroundColor = "#7fffd4"));
    }
    stats.forEach((e) =>
      createProgressBar(e.name, slime[e.name].level, slime[e.name].progress)
    );
  }, [slime]);

  const changeName = (event) => {
    console.log("a", event.target);
    //setSlime({...slime,name:event.target.value})
  };

  const addNewCardInRecord = (type, id) => {
    let auxObj = {
      date: new Date().toLocaleDateString("sv-SE"),
      type: type,
      id: id,
    };

    if (
      (record.length > 0 &&
        sameDate(new Date(record[record.length - 1]?.[0]?.date), new Date())) ||
      sameDate(
        new Date(record[record.length - 1]?.[0]?.date),
        record[record.length - 2]?.[0]?.date
      )
    ) {
      let idSame = 0;
      if (
        record[record.length - 1].some((e, id) => {
          if (e.type === auxObj.type && e.id === auxObj.id) {
            idSame = id;
            return true;
          } else return false;
        })
      ) {
        const auxRecord = JSON.parse(JSON.stringify(record));
        auxRecord[auxRecord.length - 1].splice(idSame, 1);
        setRecord(auxRecord);
      } else {
        const auxRecord = JSON.parse(JSON.stringify(record));
        auxRecord[auxRecord.length - 1].push(auxObj);
        setRecord(auxRecord);
      }
    } else {
      setRecord(JSON.parse(JSON.stringify(record)).concat([[auxObj]]));
    }
  };

  const activateModal = (content) => {
    content === habitMessage ? setIsTask(false) : setIsTask(true);
    setDialog(!dialogOpen);
    dialogModal.current.showModal();
  };

  const closeModal = (event) => {
    if (typeof event !== "undefined") {
      if (event.type === "submit") {
        event.preventDefault();
        let id = 0,
          date,
          type,
          position;

        if (isTask) {
          tasks.forEach((task) => task.id >= id && (id = task.id + 1));
          date = startDate;
          type = "task";
          position = tasks.length;
        } else {
          habits.forEach((habit) => habit.id >= id && (id = habit.id + 1));
          date = null;
          type = "habit";
          position = habits.length;
        }

        const newCard = new Card(
          isModified ? actualCard.id : id,
          event.target.name.value,
          event.target.description.value,
          date,
          event.target.priority.value,
          event.target.tags.value
            .trim()
            .split(",")
            .map((e) => e.trim()),
          [].filter
            .call(event.target.stat, (e) => e.checked)
            .map((element) => element.value),
          isModified ? actualCard.isFinished : false,
          type,
          position
        );

        if (isModified) {
          isTask
            ? setTasks(
                tasks.map((task) => (task.id == actualCard.id ? newCard : task))
              )
            : setHabits(
                habits.map((habit) =>
                  habit.id == actualCard.id ? newCard : habit
                )
              );
        }

        !isModified &&
          (isTask
            ? setTasks(tasks.concat(newCard))
            : setHabits(habits.concat(newCard)));
      } else {
        isTask
          ? setTasks(
              tasks
                .filter(
                  (_, id) =>
                    id !== tasks.findIndex((task) => task.id === actualCard.id)
                )
                .map((task, i) => task.cloneWithChanges({ position: i }))
            )
          : setHabits(
              habits
                .filter(
                  (_, id) =>
                    id !==
                    habits.findIndex((habit) => habit.id === actualCard.id)
                )
                .map((habit, i) => habit.cloneWithChanges({ position: i }))
            );
      }
    }
    setDialog(!dialogOpen);
    setActualCard(new Card());
    isModified && setIsModified(!isModified);
    dialogModal.current.close();
  };

  const modifyCard = (card) => {
    card.type === "task" ? setIsTask(true) : setIsTask(false);
    setActualCard(card);
    setIsModified(!isModified);
    setDialog(!dialogOpen);
    dialogModal.current.showModal();
  };

  const checkCard = (card, isCheck) => {
    let auxArray = [];
    if (card.type === "task") {
      const cardIndex = tasks.indexOf(card);
      setTasks(
        (auxArray = tasks.map((task, i) => {
          if (i === cardIndex) {
            return task.cloneWithChanges({ isFinished: isCheck });
          }
          return task;
        }))
      );
    } else {
      const cardIndex = habits.indexOf(card);
      setHabits(
        (auxArray = habits.map((habit, i) => {
          if (i === cardIndex) {
            return habit.cloneWithChanges({ isFinished: isCheck });
          }
          return habit;
        }))
      );
    }
    addNewCardInRecord(card.type, card.id);
    if (isCheck) {
      if (typeof card.awards === "undefined") {
        let value, award, level;

        switch (card.priority) {
          case "Baja":
            award = Math.floor(Math.random() * (200 - 1 + 1)) + 1;
            value = 0.2;
            break;
          case "Media":
            award = Math.floor(Math.random() * (600 - 200 + 1)) + 200;
            value = 0.6;
            break;
          case "Alta":
            award = Math.floor(Math.random() * (800 - 600 + 1)) + 600;
            value = 0.8;
            break;
          default:
            award = Math.floor(Math.random() * (400 - 200 + 1)) + 200;
            value = 0.4;
        }
        let progress = Math.round((100 * value) / slime.level.level);

        progress + slime.level.progress >= 100
          ? (level = { level: slime.level.level + 1, progress: 0 })
          : (level = {
              level: slime.level.level,
              progress: slime.level.progress + progress,
            });

        let auxSlime = { ...slime, level: level, gel: slime.gel + award };

        card.stats.forEach((e) => {
          let { level, progress } = slime[e];

          if (progress + 1 >= level) {
            level++;
            progress = 0;
          } else {
            progress++;
          }
          auxSlime = { ...auxSlime, [e]: { level: level, progress: progress } };
        });

        setSlime(auxSlime);

        if (card.type === "task") {
          const cardIndex = tasks.indexOf(card);
          setTasks(
            auxArray.map((task, i) => {
              if (i === cardIndex) {
                return task.cloneWithChanges({
                  awards: { award: award, progress: progress },
                });
              }
              return task;
            })
          );
        } else {
          const cardIndex = habits.indexOf(card);
          setHabits(
            auxArray.map((habit, i) => {
              if (i === cardIndex) {
                return habit.cloneWithChanges({
                  awards: { award: award, progress: progress },
                });
              }
              return habit;
            })
          );
        }
      } else {
        let level;
        if (card.awards.progress + slime.level.progress >= 100)
          level = { level: slime.level.level + 1, progress: 0 };
        else
          level = {
            level: slime.level.level,
            progress: slime.level.progress + card.awards.progress,
          };
        setSlime({
          ...slime,
          level: level,
          gel: slime.gel + card.awards.award,
        });
      }
    } else {
      let level = {
        level: slime.level.level,
        progress: slime.level.progress - card.awards.progress,
      };
      setSlime({ ...slime, level: level, gel: slime.gel - card.awards.award });
    }
  };

  const onDrop = (position, cardType) => {
    if (
      position !== activeCard.position &&
      position !== activeCard.position + 1
    ) {
      let cardsChange = cardType === "task" ? [...tasks] : [...habits];

      cardsChange.splice(position, 0, activeCard);
      cardsChange.splice(
        cardsChange.findIndex((card, i) =>
          card.id === activeCard.id ? (i != position ? true : false) : false
        ),
        1
      );

      cardType === "task"
        ? setTasks(
            cardsChange.map((card, i) => card.cloneWithChanges({ position: i }))
          )
        : setHabits(
            cardsChange.map((card, i) => card.cloneWithChanges({ position: i }))
          );
    }
  };

  const openContextMenu = (event, card) => {
    event.preventDefault();
    let x,
      y = event.pageY;
    event.pageX < window?.innerWidth / 2
      ? (x = event.pageX)
      : (x =
          event.pageX - contextMenuRef.current.getBoundingClientRect().width);
    setContextMenu({ open: true, x: x, y: y });
    setActiveCard(card);
    contextMenuRef.current.focus();
  };

  const closeContextMenu = useCallback(
    (event) => {
      if (event._reactName === "onClick" && activeCard) {
        let activeCardIndex;
        if (activeCard.type === "task") {
          activeCardIndex = tasks.findIndex(
            (task) => task.id === activeCard.id
          );
          setTasks(
            tasks.map((task, i) => {
              if (i === activeCardIndex) {
                return task.cloneWithChanges({
                  color: window.getComputedStyle(event.target).backgroundColor,
                });
              }
              return task;
            })
          );
        } else {
          activeCardIndex = tasks.findIndex(
            (habit) => habit.id === activeCard.id
          );
          setHabits(
            habits.map((habit, i) => {
              if (i === activeCardIndex) {
                return habit.cloneWithChanges({
                  color: window.getComputedStyle(event.target).backgroundColor,
                });
              }
              return habit;
            })
          );
        }
        setActiveCard(null);
      }
      contextMenu.open && setContextMenu({ ...contextMenu, open: false });
    },
    [activeCard, contextMenu, habits, tasks]
  );

  return (
    <>
      <DialogAdd
        ref={dialogModal}
        dialogOpen={dialogOpen}
        closeModal={closeModal}
        startDate={startDate}
        setStartDate={setStartDate}
        isTask={isTask}
        isModified={isModified}
        actualCard={actualCard}
        stats={stats}
      />
      <ContextMenu
        ref={contextMenuRef}
        colors={colors}
        open={contextMenu.open}
        ContextMenuX={contextMenu.x}
        ContextMenuY={contextMenu.y}
        closeContextMenu={closeContextMenu}
      />
      <header id={styles.App_header}>
        <h1>Administrador de Tareas</h1>
        <div>
          <img src="./src/assets/a.svg" alt="Slime" />
        </div>
        {/*<div>
                    <img src="./src/assets/store.svg" alt="Store"/>
                </div>
                <div>
                <img src="./src/assets/user.svg" alt="User"/>
                </div>*/}
      </header>

      <div style={{ background: "white" }}>
        <section className={styles.App}>
          <article className={styles.App_info}>
            <h2>
              Lvl.{" "}
              {slime.level.level < 10
                ? `0${slime.level.level}`
                : `${slime.level.level}`}{" "}
              {slime.level.progress}/100
            </h2>
            <div className={styles.status_bar}>
              <div id={styles.level}></div>
            </div>
            <h2>{slime.life}/100</h2>
            <div className={styles.status_bar}>
              <div id={styles.life}></div>
            </div>
            <h2>Gel:</h2>
            <div className={styles.status_bar}>
              <div id={styles.gel}>
                <span>{slime.gel}</span>
              </div>
            </div>
          </article>

          <article id={styles.slime} className={styles.App_info}>
            <div id={styles.slime_img}>
              <img src="./src/assets/a.svg" alt="Slime" />
            </div>
            <input
              type="text"
              id={styles.name}
              onClick={changeName}
              autoComplete="off"
              readOnly
              value={slime.name}
            />
          </article>

          <article id={styles.App_stats} className={styles.App_info}>
            {stats.map((e) => {
              return (
                <article key={e.id}>
                  <h2>
                    {e.name} Lvl.{" "}
                    {slime[e.name].level < 10
                      ? `0${slime[e.name].level}`
                      : `${slime[e.name].level}`}
                  </h2>
                  <div className={styles.status_bar}>
                    <div id={styles[e.name]}></div>
                  </div>
                </article>
              );
            })}
          </article>
        </section>
      </div>

      <section id={styles.App_tracker}>
        <article className={styles.App_info}>
          <h2>Por Hacer</h2>
          <section className={styles.at_box}>
            <ButtonAdd content={taskMessage} activateModal={activateModal} />

            <DropArea
              position={0}
              type={"task"}
              activeCard={activeCard}
              onDrop={() => onDrop(0, "task")}
            ></DropArea>
            <ShowCards
              data={tasks}
              modify={modifyCard}
              checkCard={checkCard}
              activeCard={activeCard}
              setActiveCard={setActiveCard}
              onDrop={onDrop}
              openContextMenu={openContextMenu}
            />
          </section>
        </article>
        <article className={styles.App_info}>
          <h2>Hábitos</h2>
          <section className={styles.at_box}>
            <ButtonAdd content={habitMessage} activateModal={activateModal} />
            <DropArea
              position={0}
              type={"habit"}
              activeCard={activeCard}
              onDrop={() => onDrop(0, "habit")}
            ></DropArea>
            <ShowCards
              data={habits}
              modify={modifyCard}
              checkCard={checkCard}
              activeCard={activeCard}
              setActiveCard={setActiveCard}
              onDrop={onDrop}
              openContextMenu={openContextMenu}
            />
          </section>
        </article>
        <article className={styles.App_info}>
          <h2>Calendario</h2>
          <section className={styles.at_box} id={styles.calendar}>
            <CalendarHeatmap
              startDate={
                new Date(new Date().getFullYear(), new Date().getMonth(), 0)
              }
              endDate={
                new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
              }
              showMonthLabels={false}
              horizontal={false}
              weekdayLabels={["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]}
              showWeekdayLabels={true}
              classForValue={(value) => {
                if (!value) {
                  return "color-empty";
                }
                if (value.count > 5) return `color-scale-5`;
                return `color-scale-${value.count}`;
              }}
              titleForValue={(value) =>
                value && `Fecha: ${value.date} - Terminadas: ${value.count}`
              }
              values={datesCalendar}
            />
            <h2>Racha de: {allStreak}</h2>
          </section>
        </article>
      </section>
    </>
  );
}
