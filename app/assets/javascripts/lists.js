class List {

  constructor(data) {
    this.bulkSet(data);
    return this
  };

  bulkSet(data = {}) {
    List.attributes.forEach(attribute => {
      if (typeof data[attribute] !== "undefined"){
        this[attribute] = data[attribute]
      }
    })
  };

  static async fetchAll() {
    let query = await document.getElementById("query").value
    let response = await fetch(
      `/lists.json?query=${query}`,
      {
        method: "GET",
        headers: {
          "Accepts": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": document.getElementsByName("csrf-token")[0].content
        }
      }
    );

    if (!response.ok) {
        console.error(`Error ${response.status} saving list`, request, response)
        throw Error(`Error ${response.status} saving list`)
    }

    let listsJson = await response.json()
    List.all = await listsJson.map(listJson => new List(listJson))
    return List.all
  }

  static async allHTML(){

    if (List.all.length === 0){
      let lists = await List.fetchAll()
    }
    return await List.all.map(list => `
      <div class="list flex items-center mh2 mv1 ph2 pv1">
        <a class="ma2 pa2" href="/lists/${list.id}">${list.name}</a>
      
        <div class="ma2 pa2">by ${list.ownerName}</div>
      
        <a class="ma2 pa2" href="/lists/${list.id}/users">
          <i class="material-icons">${this.isShared ? "people" : "lock"}</i>
        </a>
      
        <a class="ma2 pa2"
            data-confirm="Are you sure you want to delete the ${list.name} list?"
            rel="nofollow" data-method="delete" href="/lists/${list.id}">
          <i class="material-icons">delete</i>
        </a>
      </div>
    `).join("")
  }

  static async renderAll() {
    let html = List.allHTML()

    let listsElement = await document.getElementById("lists")
    if (listsElement){
      listsElement.innerHTML = await html
    }
  }

}

List.attributes = ["id", "name", "ownerName", "isShared"];
List.all = [];

document.addEventListener("turbolinks:load", () => {
  List.renderAll()

  document.getElementsByClassName("search_form")[0].addEventListener("submit", async (e) => {
    await e.preventDefault()
    await List.fetchAll()
    await List.renderAll()
    document.querySelector("input[type=submit]").disabled = false
  })
})