import { BindProcessor } from './BindProcessor.js';
import { InteractionProcessor } from './InteractionProcessor.js';
import { JQQueryMapper } from './JQQueryMapper.js';
import { LogicProcessor } from './LogicProcessor.js';
import { PreviewProcessor } from './PreviewProcessor.js';

export class JQDom {

    constructor(container, proxy) {
        this.$container = container;
        this.proxy = proxy;

        this.processors = [
            new LogicProcessor(this.proxy),
            new BindProcessor(this.proxy),
            new InteractionProcessor(this.proxy),
            new PreviewProcessor(this.proxy)
        ];
    }

    render(changedProp = null) {

        const selector = JQQueryMapper.getSelector(changedProp);

        this.$container.find(selector).each((_, el) => {
            this.processElement($(el));
        });

    }

    processElement($el) {
        // Lazy loading
        if (this.shouldSkipRender($el)) return;

        this.processors.forEach(processor => processor.process($el));
    }

    shouldSkipRender($el) {
        return $el.is('[data-visible]');
    }
}