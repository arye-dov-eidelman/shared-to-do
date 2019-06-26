class Item {
    constructor(data) {
        return this.updateFromJson(data || {});
    };

    updateFromJson(data) {
        if (!(data instanceof Object)) {
            console.warn(`Item.updateFromJson() was called with '${data}' instead of json on:`, this, data)
            return this;
        }

        if (data.id instanceof Number) {
            this.id = data.id;
        }

        if (typeof(data.name) === 'string') {
            this.name = data.name;
        }

        // converts any of the following to a boolean: "0", "1", 0, 1, true, false
        this.checked = Boolean(Number(data.checked));

        return this;
    };

    saved() { return (this.id instanceof Number); };
}