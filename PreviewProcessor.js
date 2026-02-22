import { JQProcessor } from "./JQProcessor.js";

export class PreviewProcessor extends JQProcessor {
    process($el) {
        if (!$el.is('[data-preview]')) return;
        const expr = $el.attr('data-preview');
        try {
            const result = new Function(`return (${expr})`).call(this.proxy);
            $el.text(result);
        } catch (e) {
            console.error("Erro no data-preview:", expr, e);
        }
    }
}