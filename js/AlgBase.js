var AlgBase = $.public.abstract.class([
    $.public({
        __construct: function (graphCt, weighted, directed) {
            this.i.prepare(weighted, directed);
            this.i.graphCt=graphCt;
            this.i.graph = graphCt.graph;
        },

        __destruct: function () {
        },

        prepare: function (weighted, directed) {
            this.i.weighted = weighted;
            this.i.directed = directed;
        },

        process: function () {

        },

        step_by_step: function () {
        },
    })
]);