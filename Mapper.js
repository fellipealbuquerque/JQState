export const JQQueryMapper = {
    
    directives: [
        'data-bind',
        'data-if',
        'data-switch',
        'data-for',
        'data-visible',
        'data-forcerender',
        'data-teleport',
        'data-on',
    ],

    getSelector(prop = null) {
        
        if(!prop) return this.directives.map(d => `[${d}]`).join(',');

        const reactiveDirectives = [
            `[data-bind="${prop}"]`,
            `[data-if*="${prop}"]`,
            `[data-switch*="${prop}"]`,
            `[data-on*="${prop}"]`,
        ];

        const globalDirectives = [
            '[data-visible]',
            '[data-forcerender]',
            '[data-teleport]'
        ];

        return [...reactiveDirectives, ...globalDirectives].join(',');
    }
}