const userid = sessionStorage.getItem("Id");
const role = sessionStorage.getItem("Role");

if (role !== "profesional") {
    location.href = "/";
}
if (!userid) {
    location.href = "/";
}

// console.log('Id: ', userid);
// console.log('Role: ', role);
