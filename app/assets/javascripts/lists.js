class List {

  constructor(data) {
    this.bulkSet(data);
    this.keepLastSaveMessageCurrent()
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

  findForm(){
    this.form = document.getElementsByClassName("new_list")[0]

    if (!this.form) {
      this.form = document.getElementsByClassName("edit_list")[0]
    }
    if (!this.form) {
      return false
    }
    this.lastSaveTimeElement = this.form.getElementsByClassName("last-save-time")[0]

  }

  connectForm() {
    this.findForm()
    if (!this.form) {
      return false
    }

    this.importFormData()
    this.addFormHandlers()

    return this
  }

  importFormData() {
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

    await this.importFormData()
    List.renderAll()
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
      console.error(`Error ${response.status} saving list ${this.id}`, response)
      throw Error(`Error ${response.status} saving list ${this.id}`)
    } else {
      console.log("Saved", this)
    }

    document.querySelector("input[type=submit]").disabled = false

    let json = await response.json()
    await this.bulkSet(json);

    this.render()
    return this
  }

  async load() {
    if (!this.persisted()){
      return
      // only saved lists can be loaded!
    }
    console.log(`Loading list ${this.id}...`)

    let response = await fetch(
      this.formAction(),
      {
        method: "GET",
        headers: {
          "Accepts": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken()
        }
      }
    );

    if (!response.ok) {
      console.error(`Error ${response.status} loading list ${this.id}`, response)
      throw Error(`Error ${response.status} loading list ${this.id}`)
    }

    let json = await response.json()

    await this.bulkSet(json);
    console.log(`Loaded list ${this.id}`, this)

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

  lastSaveTime() {
    return moment(this.updatedAt).fromNow()
  }

  updateLastSaveTime() {
    if (this.persisted() && this.lastSaveTimeElement){
      this.lastSaveTimeElement.innerHTML = `Last saved ${this.lastSaveTime()}`
    }
  }

  keepLastSaveMessageCurrent() {
      setTimeout(() => {
        this.updateLastSaveTime()
        this.keepLastSaveMessageCurrent()
      }, 5000, true)
  }

  formHTML() {
    return this.persisted() ? this.editFormHTML() : this.newFormHTML()
  }

  newFormHTML() {
    return (`
      <form class="new_list" id="new_list" action="${this.formAction()}" accept-charset="UTF-8" method="post">
        <div class="list-name pa2 ma2">
          <label for="list_name">List name</label>
          <input required="required" type="text" name="list[name]" id="list_name" />
        </div>

        ${this.items.map(this.formItemHTML).join("")}

        <div class="list-submit pa2 ma2">
          <input type="submit" name="commit" value="Create List" data-disable-with="Create List" />
        </div>
      </form>
    `)
  }

  editFormHTML() {
    return (`
      <form class="edit_list" id="edit_list_${this.id}" action="${this.formAction()}" accept-charset="UTF-8" method="post">
        <input type="hidden" name="_method" value="${this.formMethod()}" />

        <div class="list-name pa2 ma2">
          <label for="list_name">List name</label>
          <input required="required" type="text" value="${this.name}" name="list[name]" id="list_name" />
        </div>

        ${this.items.map(this.formItemHTML).join("")}

        <div class="list-submit ma2 pa2 flex items-center">
          <input
            type="submit"
            name="commit"
            value="Update List"
            data-disable-with="Update List"
            class="h2 ma1 pa1"
          />
          <div
            class="last-save-time h2 ma1 pa1"
            style="border: 2px solid rgba(0, 0, 0, .0)"
          >
            Last saved ${this.lastSaveTime()}
          </div>
        </div>
      </form>
    `)
  }

  formItemHTML(item, index) {
    return (`
      <div class="list-item ph2 mh2 pv1 mv1">

        <span class="checked">
          <input
            type="checkbox"
            ${ item.checked && "checked" }
            name="list[items_attributes][${ index }][checked]"
            id="list_items_attributes_${ index }_checked"
          />
        </span>

        <span class="name">
          <input
            type="text"
            value="${ item.name }"
            name="list[items_attributes][${ index }][name]"
            id="list_items_attributes_${ index }_name"
          />
        </span>

      </div>
    `)
  }

  render() {
    if (!this.listArea){
      this.listArea = document.getElementById("list-area")
    }

    if (this.listArea) {
      this.listArea.innerHTML = this.formHTML()
      this.findForm()
      if (this.form) {
        this.addFormHandlers()
      }
    }
  }

  addFormHandlers() {
    this.form.addEventListener("submit", e => this.save(e))
  }





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
      <div class="list flex items-center shadow-3 br3 ma2 ph3 pv1">
        <div class="ma2 pa2 flex flex-auto">
          <div class="pa1 flex-auto">
            ${list.name}
          </div>

          <div class="pa1">
            by ${list.ownerName}
          </div>
        </div>

        <a class="edit ma2 pa2" href="/lists/${list.id}/edit" data-id="${list.id}">
          <i class="material-icons" data-id="${list.id}">edit</i>
        </a>

        <a class="ma2 pa2" href="/lists/${list.id}/users">
          <i class="material-icons">${this.isShared ? "people" : "lock"}</i>
        </a>

        <a class="delete ma2 pa2"
            data-confirm="Are you sure you want to delete the ${list.name} list?"
            rel="nofollow" data-method="delete" href="/lists/${list.id}">
          <i class="material-icons">delete</i>
        </a>
      </div>
    `).join("")
  }

  static async renderAll() {
    if (!List.listsElement){
      List.listsElement = await document.getElementById("lists")
    }

    if (List.listsElement) {
      let html = await List.allHTML()
      List.listsElement.innerHTML = html
      let listsEditButtons = await [...List.listsElement.getElementsByClassName("edit")]
      listsEditButtons.map(listLink => listLink.addEventListener("click", List.editList))
    }

  }

  static async editList(e) {
    if (e instanceof Event){
      await e.preventDefault()
      list = await List.all.find(list => list.id == e.target.dataset.id) || new List({id: e.target.dataset.id})
    } else if (typeof e == "number") {
      var id = await e
      list = await List.all.find(list => list.id == id) || new List({id: id})
    } else if (e instanceof List) {
      var list = await e
    }
    await list.load()
    list.render()
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

List.attributes = ["id", "name", "items", "ownerName", "isShared", "updatedAt", "form", "lastSaveTimeElement"];
List.all = [];

document.addEventListener("turbolinks:load", () => {

  let listsElement = document.getElementById("lists")
  if (listsElement) {
    List.renderAll()
  }

  let searchForm = document.getElementsByClassName("search_form")[0]
  if (searchForm) {
    searchForm.addEventListener("submit", List.searchHandler)
  }

  list = new List()
  list.connectForm()



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