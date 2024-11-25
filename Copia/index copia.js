// URL del servidor
const SERVER_URL = 'http://localhost:9000';

// Función para manejar el inicio de sesión
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("loginFailed");

    if (!username || !password) {
        error.style.display = "block";
        error.textContent = "Por favor, rellene ambos campos.";
        return;
    }

    fetch(`http://127.0.0.1:9000/students?student_id=${encodeURIComponent(password)}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la solicitud");
            }
            return response.json();
        })
        .then((data) => {
            if (data.students && data.students.length > 0) {
                // Guardar student_id en localStorage
                localStorage.setItem("student_id", password);

                // Verificar si se guardó correctamente
                console.log("Student ID guardado:", localStorage.getItem("student_id"));

                window.location.href = "menu.html";
            } else {
                throw new Error("Credenciales incorrectas");
            }
        })
        .catch((err) => {
            error.style.display = "block";
            error.textContent = "Nombre o contraseña incorrectos.";
            console.error("Error de inicio de sesión:", err);
        });
}



// Función para realizar una búsqueda
function search() {
    const query = document.getElementById("search").value.trim();
    const student_id = localStorage.getItem("student_id");

    if (!query) {
        alert("Por favor, ingrese un término de búsqueda.");
        return;
    }

    if (!student_id) {
        alert("No se ha iniciado sesión correctamente. Por favor, vuelva a iniciar sesión.");
        return;
    }

    fetch(`http://localhost:9000/${query}?student_id=${student_id}`)
        .then((response) => {
            console.log("Estado de la respuesta:", response.status);
            if (!response.ok) {
                throw new Error("Error en la solicitud");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Datos recibidos del servidor:", data);
            displayResults(data, query);
        })
        .catch((err) => {
            alert("Error al conectar con el servidor. Inténtelo más tarde.");
            console.error("Error al conectar con el servidor:", err);
        });
}




// Función para mostrar los resultados en una tabla
function displayResults(data, query) {
    const titulo = Object.keys(data)[0];
    if (!data[titulo] || data[titulo].length === 0) {
        alert(`No se encontraron resultados para la consulta: ${query}`);
        return;
    }

    const headers = Object.keys(data[titulo][0]);
    headers.pop();

    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    const tr = document.createElement("tr");
    headers.forEach((encabezado) => {
        const th = document.createElement("th");
        th.innerText = encabezado;
        th.classList.add("table_headers");
        tr.appendChild(th);
    });
    grid.appendChild(tr);

    data[titulo].forEach((item) => {
        const tr = document.createElement("tr");
        headers.forEach((header) => {
            if (header === "date") {
                item[header] = item[header].split("T")[0];
            }
            if (header === "day") {
                const dayss = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
                item[header] = dayss[item[header] - 1];
            }
            const td = document.createElement("td");
            td.innerText = item[header];
            tr.appendChild(td);
        });
        grid.appendChild(tr);
    });
}



// Función para mostrar mensajes de error
function showError(element, message) {
    element.style.display = "block";
    element.textContent = message;
}

// Cambiar el texto del nombre de usuario en el menú
function changeName() {
    const username = localStorage.getItem("username");
    document.getElementById("welcomeText").textContent += username;
}

// Función para cerrar sesión
function logout() {
    localStorage.clear();
    fetch(`${SERVER_URL}/logout`)
        .then(() => {
            window.location.href = "index.html";
        })
        .catch((err) => {
            console.error("Error al cerrar sesión:", err);
        });
}
