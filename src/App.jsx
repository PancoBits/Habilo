import "./App.css"
import Task from "./components/TaskTarget"
import DialogAdd from "./components/DialogAdd";
import { useState, useRef } from "react";

const ButtonAdd = ({content,activateModal}) => {
    return(
        <button className="at-button" onClick={activateModal}>{content}</button>
    )
};

export function App(){

    const dialogModal = useRef();
    const [dialogOpen, setDialog] = useState(false)
    
    const activateModal = () => {
        setDialog(!dialogOpen)
        dialogModal.current.showModal();
    };

    const closeModal = (event) => {
        if(typeof(event) != "undefined"){
            event.preventDefault();
            console.log(event.target.name.value)
            console.log(event.target.description.value)
            console.log(event.target.date.value)
            console.log(event.target.priority.value)
            console.log([].filter.call(event.target.skill,e => e.checked).map(element => element.value))
        }else{
            alert('Pues no se guardará nada xd')
        }
        setDialog(!dialogOpen)
        dialogModal.current.close();
    };

    return(
        <>
            <DialogAdd ref={dialogModal} dialogOpen={dialogOpen} closeModal={closeModal}/>
            <header id="App-header">
                <h1>Administrador de Tareas</h1>
                <div>
                    <img id="logo" src="./src/assets/a.svg" alt="Slime"/>
                </div>
                <div>
                    <img src="./src/assets/store.svg" alt="Store"/>
                </div>
                <div>
                <img src="./src/assets/user.svg" alt="User"/>
                </div>
            </header>
            
            <main>
                <section className="App">
                    <article>
                        <h3>Nivel de Mascota</h3>
                        <h3>Vida de Mascota</h3>
                        <h3>Gelatina</h3>
                    </article>

                    <article>
                        <div id="pet">
                            <img src="./src/assets/a.svg" alt="Slime"/>
                        </div>
                        <h3>Nombre Mascota</h3>
                    </article>

                    <article>
                        <h3>Fuerza</h3>
                        <h3>Inteligencia</h3>
                        <h3>Social</h3>
                        <h3>Bienestar</h3>
                    </article>
                </section>

                <section id="App-tracker">
                    <article>
                        <h1>Por Hacer</h1>
                        <section id="at-box">
                            <ButtonAdd content="Nuevo por hacer" activateModal={activateModal}/>
                            <Task name="Estudiar Robótica" descripcion="Pues toca estudiar" due={new Date()}/>
                            <Task name="Estudiar Robótica" descripcion="Pues toca estudiar" due={new Date()}/>
                        </section>
                    </article>
                    <article>
                        <h1>Hábitos</h1>
                        <section id="at-box">
                        <ButtonAdd content="Nuevo hábito" activateModal={activateModal}/>
                        <Task name="Hacer Ejercicio" descripcion="Hay que ponerse mamamisimo" due={new Date()}/>
                        </section>
                    </article>
                    <article>
                        <h1>Calendario</h1>
                        <section id="at-box">
                            <Task name="Estudiar Robótica" descripcion="Pues toca estudiar" due={new Date()}/>
                        </section>
                    </article>
                </section>

            </main>
        </>
    )
}