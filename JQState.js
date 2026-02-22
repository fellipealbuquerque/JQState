import { JQDom } from "./JQDom.js";

export class JQState {
    constructor(selector, initialState = {}, computed = {}) {

        this.$container = $(selector);
        this.context = this.$container.attr('id');
        this.observers = {};

        if (!this.context) {
            console.error("JQState: O container deve ter um ID único.");
            return;
        }

        const baseData = this.prepareInitialState(initialState);

        this.state = new Proxy(baseData, {
            set: (target, prop, value) => this.setValue(target, prop, value),
            get: (target, prop) => this.getValue(target, prop, computed)
        });

        this.dom = new JQDom(this.$container, this.state);

        this.initEvents();

        this.dom.render();
    }

    on(prop, callback) {
        if (!this.observers[prop]) {
            this.observers[prop] = [];
        }
        this.observers[prop].push(callback);
        return this;
    }

    prepareInitialState(initialState) {

        const rawInitial = this.$container.attr('data-initial');
        let bootstrap = {};
        if (rawInitial) {
            try { bootstrap = JSON.parse(rawInitial); } catch (e) { console.error("JSON data-initial inválido"); }
        }

        const data = { ...initialState, ...bootstrap };

        const namespacedData = {};

        Object.keys(data).forEach(key => {
            namespacedData[this.getNSKey(key)] = data[key];
        });

        namespacedData[this.getNSKey('$pending')] = false;
        namespacedData[this.getNSKey('$submitting')] = false;

        return namespacedData;
    }

    getNSKey(prop) {
        return prop.startsWith(`${this.context}_`) ? prop : `${this.context}_${prop}`;
    }

    setValue(target, prop, value) {

        const nsKey = this.getNSKey(prop);

        if (JSON.stringify(target[nsKey]) === JSON.stringify(value)) return true;

        target[nsKey] = value;

        this.dom.render(prop);

        if (this.observers[prop]) {
            this.observers[prop].forEach(callback => callback(this.state, value));
        }

        if (this.observers["*"]) {
            this.observers["*"].forEach(callback => callback(this.state, { prop, value }));
        }

        return true;
    }

    getValue(target, prop, computed) {
        if (prop in computed) return computed[prop](this.state);
        return target[this.getNSKey(prop)];
    }

    initEvents() {
        // Two-way data binding para inputs
        this.$container.on('input change', '[data-bind]', (e) => {

            const $el = $(e.currentTarget);
            const prop = $el.attr('data-bind');
            let val;

            if ($el.is('input[type="checkbox"]')) {
                val = $el.is(':checked');
            } else if ($el.is('input[type="radio"]')) {
                val = $el.val();
            } else {
                val = $el.val();
            }
            
            this.state[prop] = val;
        });

        const eventMap = ['click', 'blur', 'keyup', 'mouseenter', 'mouseleave'];
        eventMap.forEach(evt => {
            const attr = evt === 'click' ? 'data-click' : `data-on${evt}`;
            this.$container.on(evt, `[${attr}]`, (e) => {
                
                const $el = $(e.currentTarget);

                if($el.hasClass('jq-blocked') || $el.is(':disabled')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return;
                }

                const expr = $el.attr(attr);
                const index = $el.closest('[data-index]').attr('data-index');
                
                try {
                    new Function('state', 'index', 'event', `return (${expr})`)
                        .call(this.state, this.state, index, e);
                } catch (err) { console.error(`Erro no evento ${evt}:`, err); }
            });
        });
    }
}