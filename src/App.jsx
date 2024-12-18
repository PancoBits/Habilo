import "./App.css"
export function App(){
    return(
        <>
        <header className="App">
            <h1>Administrador de Tareas</h1>
            <img id="logo" src="./src/assets/a.svg" alt="Slime" width="107px" height="78px" />
            <img src="./src/assets/store.svg" alt="Store" />
            <img src="./src/assets/user.svg" alt="User" />
        </header>
        <main>
            <section className="App">
                <article>
                    <h3>Nivel de Mascota</h3>
                    <h3>Vida de Mascota</h3>
                    <h3>Gelatina</h3>
                </article>

                <article style={{textAlign: "center"}}>
                    <img id="logo" src="./src/assets/a.svg" alt="Slime"/>
                    <h3>Nombre Mascota</h3>
                </article>

                <article>
                    <h3>Fuerza</h3>
                    <h3>Inteligencia</h3>
                    <h3>Social</h3>
                    <h3>Bienestar</h3>
                </article>
            </section>

            <section className="App">
                <article>
                    <h1>Por Hacer</h1>
                </article>
                <article>
                    <h1>Hábitos</h1>
                </article>
                <article>
                    <h1>Calendario</h1>
                </article>
            </section>

        </main>
        </>
    )
}