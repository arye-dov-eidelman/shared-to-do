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
        let request = await new Request(this.url(), {
            method: "POST",
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

    url() {
        if (this.id instanceof Number) {
            return `/lists/${this.id}/`
        } else {
            return "/lists/"
        }
    };

    token() {
        let csrfElement = document.getElementsByName("csrf-token")[0]
        if (!(csrfElement instanceof Object) || !csrfElement.content) {
            throw "csrf-token not found"
        }
        return csrfElement.content
    };

    render() {

    };
}