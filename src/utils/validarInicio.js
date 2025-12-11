const userid = sessionStorage.getItem("Id");
const role = sessionStorage.getItem("Role");

export function validarInicioProfesional() {
    if (role !== "profesional" || !userid) {
        location.href = "/";
    }
}
export function validarInicioCliente() {
    if (role !== "cliente" || !userid) {
        location.href = "/";
    }
}


