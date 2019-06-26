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

    formHTML(index) {
            return `
            <div class="list-item ph2 mh2 pv1 mv1">
            
                <span class="checked">
                    <input
                        type="hidden"
                        name="list[items_attributes][${ index }][checked]"
                        value="0"
                    />

                    <input
                        type="checkbox"
                        value="${ Number(this.checked) }"
                        name="list[items_attributes][${ index }][checked]"
                        id="list_items_attributes_${ index }_checked"
                    />
                </span>
                
                <span class="name">
                    <input 
                        type="text"
                        value="${ this.name }"
                        name="list[items_attributes][${ index }][name]"
                        id="list_items_attributes_${ index }_name"
                    />
                </span>

            </div>

            ${ self.saved() ? `
                <input 
                    type="hidden"
                    value="${ this.id }"
                    name="list[items_attributes][${ index }][id]"
                    id="list_items_attributes_${ index }_id"
                />` : ""
            }
        `;
    }
}