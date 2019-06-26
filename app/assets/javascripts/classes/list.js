class List {
    constructor(data) {
        return this.updateFromJson(data || {});
    };

    updateFromJson(data) {
        if (!(data instanceof Object)) {
            console.warn(`List.updateFromJson() was called with '${data}' instead of json on:`, this, data)
            return this;
        }

        if (data.id instanceof Number) {
            this.id = data.id;
        }

        if (typeof(data.name) === 'string') {
            this.name = data.name;
        }

        if (data.owner instanceof User) {
            this.owner = data.owner;
        } else if (data.owner instanceof Object) {
            this.owner = new User(data.owner);
        }

        if (data.isOwner instanceof Boolean) {
            this.isOwner = data.isOwner;
        }

        if (data.items instanceof Array) {
            this.items = data.items.map(item => {
                return (item instanceof Item) ? item : new Item(item)
            });
        }

        return this;
    };

    async save() {
        let request = await new Request(this.saveActionURL(), {
            method: this.saveMethod(),
            headers: {
                "Accepts": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-Token": this.token()
            },
            body: JSON.stringify({ list: this })
        });

        let response = await fetch(request);

        if (!response.ok) {
            console.error(`Error ${response.status} saving list`, request, response)
            throw Error(`Error ${response.status} saving list`)
        }

        let json = await response.json()

        await this.updateFromJson(json);
        return this.render(json);

    };

    saved() { return (this.id instanceof Number) };

    saveActionURL() { return this.saved ? `/lists/${this.id}/` : "/lists/" };

    saveMethod() { return this.saved ? "PATCH" : "POST" };

    token() {
        let csrfElement = document.getElementsByName("csrf-token")[0]
        if (!(csrfElement instanceof Object) || !csrfElement.content) {
            throw "csrf-token not found"
        }
        return csrfElement.content
    };

    formHTML() {
        this.saved ? this.editFormHTML : this.newFormHTML
    }

    newFormHTML() {
        return `
            <form class="new_list" id="new_list" action="${this.saveActionURL()}" accept-charset="UTF-8" method="post">
            <input name="utf8" type="hidden" value="&#x2713;" />
                <div class="list-name pa2 ma2">
                    <label for="list_name">List name</label>
                    <input required="required" type="text" name="list[name]" id="list_name" />
                </div>

                ${this.items.map((item, index) => item.formHTML(index)).join("")}

                <div class="list-submit pa2 ma2">
                    <input type="submit" name="commit" value="Create List" data-disable-with="Create List" />
                </div>
            </form>
        `
    }

    editFormHTML() {
        return `
            <form class="edit_list" id="edit_list_${this.id}" action="${this.saveActionURL()}" accept-charset="UTF-8" method="post">
                <input name="utf8" type="hidden" value="&#x2713;" />
                <input type="hidden" name="_method" value="${this.saveMethod()}" />

                <div class="list-name pa2 ma2">
                    <label for="list_name">List name</label>
                    <input required="required" type="text" value="${this.name}" name="list[name]" id="list_name" />
                </div>

                ${this.items.map((item, index) => item.formHTML(index)).join("")}

                <div class="list-submit pa2 ma2">
                    <input type="submit" name="commit" value="Update List" data-disable-with="Update List" />
                </div>

            </form>
        `
    }

    render() {

    };
}