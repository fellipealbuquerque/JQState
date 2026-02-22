import { JQProcessor } from "./JQProcessor.js";

export class BindProcessor extends JQProcessor {
    process($el) {

        if(!$el.is('[data-bind]')) return;

        const prop = $el.attr('data-bind');
        const keyProp = `$${prop}`;

        if($el.is('[data-transform]')) {
            const expr = $el.attr('data-transform');
            this.proxy[keyProp] = new Function(`return (${expr})`).call(this.proxy);
        }

        const val = $el.is('[data-transform]') ? this.proxy[`$${prop}`] : this.proxy[prop];

        if ($el.is('input[type="checkbox"]')) {
            $el.prop('checked', !!val);
        } else if ($el.is('input[type="radio"]')) {
            $el.prop('checked', $el.val() === String(val));
        } else if ($el.is('input, select, textarea')) {
            if ($el.val() !== String(val)) $el.val(val);
        } else {
            $el.text(val);
        }
    }
}