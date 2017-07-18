'use strict';

graphAlgs.Kruskal = $.public.class.extends(AlgBase)([
    $.public({
        algorithm: function (i) {
            var j = 0;
            var u = this.i.orderedEdges[i].source;
            var v = this.i.orderedEdges[i].target;

            var inv = this.i.graph.getEdges(v.name, u.name);

            while (inv.length > 0 && inv[0].data.color != null) {
                if (this.i.orderedEdges[i] && 'source' in this.i.orderedEdges[i] && 'target' in this.i.orderedEdges[i]) {
                    var u = this.i.orderedEdges[i].source;
                    var v = this.i.orderedEdges[i].target;

                    var inv = this.i.graph.getEdges(v.name, u.name);
                    i++;
                } else {
                    break;
                }
            }

            var u_set = null;
            var v_set = null;

            // find set
            while (u_set == null || v_set == null) {
                if (this.i.set[j][0] == u.name) {
                    u_set = this.i.set[j][1];
                }
                else if (this.i.set[j][0] == v.name) {
                    v_set = this.i.set[j][1];
                }

                j++;
            }

            if (u_set != v_set) {
                for (j = 0; j < this.i.set.length; j++) {
                    if (this.i.set[j][1] == v_set) {
                        this.i.set[j][1] = u_set;
                    }
                }

                this.i.orderedEdges[i].data.color = "#4895FA";
                this.i.orderedEdges[i].data.weight = 2;
            }
            else {
                if (this.i.orderedEdges[i]) {
                    this.i.orderedEdges[i].data.color = "red";
                    this.i.orderedEdges[i].data.weight = 2;
                }
            }

            return i;
        },

        __construct: function (graph) {
            this.__super(graph, true, false);
        },

        process: function () {
            var i;

            this.i.resetGraph();

            for (i = 0; i < this.i.orderedEdges.length - 1; i++) {
                i = this.i.algorithm(i);
                this.i.graph.renderer.redraw();
            }
        },
        step_by_step: function () {
            var that = this;
            var i = 0;

            this.i.resetGraph();

            $('#nextStep').click(
                function () {
                    if (i < that.i.orderedEdges.length - 1) { // iterations: n-1
                        i = that.i.algorithm(i);
                        that.i.graph.renderer.redraw();
                    } else {
                        $(this).attr('disabled', true);
                        $('#runAlg').attr('disabled', false);
                        $(this).unbind('click');
                    }

                    i++;
                }
            );
        },

        resetGraph: function() {
            var that = this;

            this.i.minH = new MinHeap(null, function (item1, item2) {
                return item1.data.cost == item2.data.cost ? 0 : item1.data.cost < item2.data.cost ? -1 : 1;
            });

            this.i.graph.eachEdge(
                function (edge, pt) {
                    that.i.minH.push(edge);
                }
            );

            this.i.orderedEdges = new Array(); // array degli edges ordinati in base al loro peso

            while (this.i.minH.size() > 0) {
                this.i.orderedEdges.push(this.i.minH.pop());
            }

            // creo il find_set
            var nodeIndex = 0;
            this.i.set = new Array();

            this.i.graph.eachNode(
                function (node, pt) {
                    that.i.set[nodeIndex] = new Array(2);
                    that.i.set[nodeIndex][0] = node.name;
                    that.i.set[nodeIndex][1] = node.name;
                    nodeIndex++;
                }
            );
        }
    })
]);