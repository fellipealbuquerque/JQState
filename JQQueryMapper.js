export const JQQueryMapper = {
    
    directives: [
        'data-bind',
        'data-if',
        'data-switch',
        'data-for',
        'data-visible',
        'data-on',
        'data-preview'
    ],

    getSelector(prop = null) {
        
        if(!prop) return this.directives.map(d => `[${d}]`).join(',');

        const reactiveDirectives = [
            `[data-bind="${prop}"]`,
            `[data-if*="${prop}"]`,
            `[data-switch*="${prop}"]`,
            `[data-on*="${prop}"]`,
            `[data-case*="${prop}"]`,
        ];

        const globalDirectives = [
            '[data-visible]',
            '[data-preview]'
        ];

        return [...reactiveDirectives, ...globalDirectives].join(',');
    }
}