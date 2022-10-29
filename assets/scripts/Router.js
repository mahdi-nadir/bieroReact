export default class Router {
    constructor() {
        //console.log('Router');
        this._elBiero = document.querySelector('[data-js-biero]');

        page.base('/biero-js-vanille/');


        // page('/', this.#getBieres /*this.getTemplate*/); // # c'est importer comme privé


        page('/', this.#getMeilleuresBieres, this.getTemplate, this.showTemplate);
        page('liste', this.#getBieres, this.getTemplate, this.showTemplate);
        // page('liste/:id', this.#getBieres, this.getTemplate, this.showTemplate);
        // page('*', this.getTemplate, this.showTemplate);

        page({ window: window }) // page comprend que this c'est routeur, alors qu'on doit faire window
    }

    #getMeilleuresBieres = (ctx, next) => {
        fetch('http://127.0.0.1:8000/webservice/php/biere/')
            .then((res) => {
                return res.json();
            })
            .then((donnees) => {

                let bieres = donnees.data
                // console.log(donnees.data);
                let meilleuresBieres = [];

                for (let i = 0; i < 5; i++) {
                    bieres[i].image = 'assets/images/no-image.jpeg';
                    meilleuresBieres.push(bieres[i]);
                }

                ctx.data = meilleuresBieres;
                ctx.template = 'biere';
                next();
            })
    }

    #getBieres = (ctx, next) => {

        fetch('http://127.0.0.1:8000/webservice/php/biere/')
            .then((res) => {
                return res.json();
            })
            .then((donnees) => {

                let bieres = donnees.data
                // console.log(donnees.data);

                for (let i = 0; i < bieres.length; i++) {
                    bieres[i].note_moyenne = parseFloat(bieres[i].note_moyenne).toFixed(1);
                    if (!bieres[i].image) {
                        bieres[i].image = 'assets/images/no-image.jpeg';
                    }
                }

                ctx.data = bieres;
                ctx.data.grid = '4';
                ctx.template = 'liste';

                next();

            })
    }


    getTemplate = (ctx, next) => {
        fetch(`vues/${ctx.template}.html`)
            .then((res) => {
                return res.text();
            })
            .then((template) => {
                ctx.data.template = template;
                next();  // pour appaler la prochaine fonction mis dans la ligne 10
            })
    }

    showTemplate = (ctx) => {
        let rendered = Mustache.render(ctx.data.template, { data: ctx.data });
        this._elBiero.innerHTML = rendered;
    }
}