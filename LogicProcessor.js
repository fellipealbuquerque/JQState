import { JQProcessor } from "./JQProcessor.js";

export class LogicProcessor extends JQProcessor {
    
    constructor(proxy) {
        super(proxy);
        this.lastIfResult = false;
    }

    process($el) {

        // não processamos ele isoladamente
        if ($el.is('[data-case], [data-default]')) {
            const $parent = $el.closest('[data-switch]');
            if ($parent.length) {
                this.handleSwitch($parent);
            }
            return;
        }

        if ($el.is('[data-if]')) this.handleIf($el);
        if ($el.is('[data-switch]')) this.handleSwitch($el);
    }

    handleIf($el) {
        const expr = $el.attr('data-if');
        try {
            const result = !!(new Function(`return (${expr})`).call(this.proxy));
            result ? $el.show() : $el.hide();
            $el.data('jq-last-result', result);
        } catch (e) {
            console.error("Erro data-if:", expr, e);
        }
    }

    handleSwitch($parent) {
        const switchExpr = $parent.attr('data-switch');
        let switchValue = null;
        let isNominal = (switchExpr && switchExpr.trim() !== "");

        if (isNominal) {
            try {
                switchValue = new Function(`return (${switchExpr})`).call(this.proxy);
            } catch (e) { console.error("Erro Switch:", e); }
        }

        let matched = false;

        const $cases = $parent.children('[data-case]');
        const $default = $parent.children('[data-default]');

        $cases.each((_, el) => {
            const $case = $(el);
            let isMatch = false;

            if (!matched) {
                try {
                    const expr = $case.attr('data-case');
                    if (isNominal) {
                        const caseVal = new Function(`return (${expr})`).call(this.proxy);
                        isMatch = (switchValue == caseVal);
                    } else {
                        isMatch = !!(new Function(`return (${expr})`).call(this.proxy));
                    }
                } catch (e) { isMatch = false; }
            }

            if (isMatch && !matched) {
                $case.show();
                matched = true;
            } else {
                $case.hide();
            }
        });

        $default.each((_, el) => {
            matched ? $(el).hide() : $(el).show();
        });
    }
}