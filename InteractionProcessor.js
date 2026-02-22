import { JQProcessor } from "./JQProcessor.js";

export class InteractionProcessor extends JQProcessor {
    process($el) {
        if (!$el.is('[data-on]')) return;

        const expr = $el.attr('data-on');
        try {
            const shouldEnable = !!(new Function(`return (${expr})`).call(this.proxy));
            
            if (shouldEnable) {
                $el.removeClass('jq-blocked').prop('disabled', false);
            } else {
                $el.addClass('jq-blocked').prop('disabled', true);
            }
        } catch (e) {
            console.error("Erro data-on:", expr, e);
        }
    }
}