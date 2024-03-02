const baseUrl = "http://localhost:8000"
//1.Get all users
window.onload = async () => {
    await reload()
}
// delete

const reload = async () => {
    const response = await axios.get(`${baseUrl}/users`)
    console.log(response.data)
    const usersDOM = document.getElementById("users")
    let buildHTML = ""
    for (let i = 0; i<response.data.length;i++) {
        buildHTML += "<div>"
        let user = response.data[i]
        for (let j in user) {
            buildHTML += `${j}: ${user[j]} `
        }
        buildHTML += `<a href="index.html?id=${user.id}"><button>Edit</button></a>`
        buildHTML += `<button class='delete' data-id='${user.id}'>Delete</button>`
        buildHTML += "</div>"
    }
    usersDOM.innerHTML += buildHTML
    // usersDOM.innerHTML += "</ul>"
    const deleteDoms = document.getElementsByClassName("delete");
    for (let index = 0; index < deleteDoms.length; index++) {
        deleteDoms[index].addEventListener("click",async (event)=>{
          const id = event.target.dataset.id
          //data-xyz => dataset 
          try {
            await axios.delete(`${baseUrl}/user/${id}`)
            usersDOM.innerHTML = ""
            reload()
            console.log("test")
        } catch (error) {
            console.log(error)
          }
        })
    }
}