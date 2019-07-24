class List {

  constructor(data) {
    this.bulkSet(data);
    return this
  };

  bulkSet(data = {}) {
    List.attributes.forEach(attribute => {
      if (typeof data[attribute] !== "undefined") {
        this[attribute] = data[attribute]
      }
    })
    return this
  };

  findForm() {
    if (!this.form) {
      this.form = document.getElementsByClassName("new_list")[0]
    }

    if (!this.form) {
      this.form = document.getElementsByClassName("edit_list")[0]
    }

    return this
  }

  setFromForm() {
    this.findForm()
    if (!this.form) {
      return false
    }

    let id = Number(this.form.action.split("/").pop())
    if (id > 0) {
      this.id = id
    }

    this.name = document.getElementById("list_name").value
    this.items = [...this.form.getElementsByClassName("list-item")].map(itemElement => {
      return {
        checked: itemElement.querySelector("input[type=checkbox]").checked,
        name: itemElement.querySelector("input[type=text]").value
      }
    })

    return this
  }

  async save(e) {
    if (!this.persisted()){
      return
      // json list create is not yet working
      // continue with default submit action
    }
    await e.preventDefault()

    await this.setFromForm()
    console.log("Saving...", this.data())

    let response = await fetch(
      this.formAction(),
      {
        method: this.formMethod(),
        headers: {
          "Accepts": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken()
        },
        body: JSON.stringify({ list: this.data() })
      }
    );

    if (!response.ok) {
      console.error(`Error ${response.status} saving list`, response)
      throw Error(`Error ${response.status} saving list`)
    }

    document.querySelector("input[type=submit]").disabled = false

    let json = await response.json()

    await this.bulkSet(json);
    await console.log("Saved", this)
    return this
  }

  data() {
    return {
      name: this.name,
      items_attributes: this.items,
    }
  }

  persisted() {
    return !!this.id
  };

  formAction() {
    return this.persisted() ? `/lists/${this.id}.json/` : "/lists.json/"
  };

  formMethod() {
    return this.persisted() ? "PATCH" : "POST"
  };

  csrfToken() {
      let csrfElement = document.getElementsByName("csrf-token")[0]
      if (!(csrfElement instanceof Object) || !csrfElement.content) {
          throw "csrf-token not found"
      }
      return csrfElement.content
  };

  // Static (class) methods below

  static async fetchAll(query = "") {
    let response = await fetch(
      `/lists.json?query=${encodeURIComponent(query)}`,
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

  static async allHTML() {

    if (List.all.length === 0) {
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

  static async renderAll(element) {
    let html = await List.allHTML()

    let listsElement = await document.getElementById("lists")
    if (listsElement) {
      listsElement.innerHTML = await html
    }
  }

  static async searchHandler(e) {
    await e.preventDefault()

    let queryElement = await document.getElementById("query")
    let query = await ""
    if (queryElement) {
      query = await queryElement.value
    }

    await List.fetchAll(query)
    await List.renderAll()
    document.querySelector("input[type=submit]").disabled = false
  }

}

List.attributes = ["id", "name", "items", "ownerName", "isShared", "updatedAt", "form"];
List.all = [];

document.addEventListener("turbolinks:load", () => {

  let listsElement = document.getElementById("lists")
  if (listsElement) {
    List.renderAll(listsElement)
  }

  let searchForm = document.getElementsByClassName("search_form")[0]
  if (searchForm) {
    searchForm.addEventListener("submit", List.searchHandler)
  }

  list = new List()
  list.findForm()
  if (list.form) {
    list.setFromForm()
    list.form.addEventListener("submit", e => list.save(e))
  }



})


// Update list params
// 
// {
//   "utf8"=>"✓",
//   "_method"=>"patch",
//   "authenticity_token"=>"V476A3Xvm24WaE7a2WUGZekU28qyvLy0bRukkmxsbW3ueFSjmFmSVoEfOiIXCgO0jAcMi/fDE6N196+cAcKDRQ==",
//   "list"=>{
//     "name"=>"list name here ",
//     "items_attributes"=>{
//       "0"=>{"checked"=>"0", "name"=>"item 1", "id"=>"10"},
//       "1"=>{"checked"=>"0", "name"=>""},
//       "2"=>{"checked"=>"0", "name"=>""},
//       "3"=>{"checked"=>"0", "name"=>""},
//       "4"=>{"checked"=>"0", "name"=>""},
//       "5"=>{"checked"=>"0", "name"=>""},
//       "6"=>{"checked"=>"1", "name"=>"item 2", "id"=>"11"},
//       "7"=>{"checked"=>"1", "name"=>"item 4", "id"=>"12"}
//     }
//   },
//   "commit"=>"Update List",
//   "controller"=>"lists",
//   "action"=>"update",
//   "id"=>"10"
// }

// New list params
// 
// {
//   "utf8"=>"✓",
//   "authenticity_token"=>"bWxVza9qOWIcRBR0F3oJw2fdnlgZZFwH5J7XZWSV/S0Lcl7gc+YGTO/e7fuM87mziiHuox8k1YJP8D0pjU4fTg==",
//   "list"=>{
//     "name"=>"list name here ",
//     "items_attributes"=>{
//       "0"=>{"checked"=>"0", "name"=>"item 1"},
//       "1"=>{"checked"=>"1", "name"=>"item 2"},
//       "2"=>{"checked"=>"0", "name"=>""},
//       "3"=>{"checked"=>"1", "name"=>"item 4"},
//       "4"=>{"checked"=>"0", "name"=>""}
//     }
//   },
//   "commit"=>"Create List",
//   "controller"=>"lists",
//   "action"=>"create"
// }