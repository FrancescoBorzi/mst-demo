'use strict';

graphAlgs.Dijkstra = $.public.class.extends(AlgBase)([
    $.public({
        algorithm: function () {
            var that = this;

            var u = this.i.minH.pop();

            if (u.data.parent !== null) {
                var treeEdge = this.i.graph.getEdges(u.data.parentName, u);
                treeEdge[0].data.color = "#4895FA";
                treeEdge[0].data.weight = 2;
            }

            var edges = this.i.graph.getEdgesFrom(u);
            edges.forEach(
                function (edge, index, adjArray) {
                    var v = edge.target;
                    var vIndex = that.i.minH.exists(v);

                    var totalCost = edge.data.cost + u.data.key;

                    if ((vIndex !== false) && (totalCost < v.data.key)) {
                        v.data.key = Number(totalCost);
                        v.data.parent = u;
                        v.data.parentName = u.name;
                        v.data.label = v.name + ', ' + totalCost + ', ' + v.data.parentName;
                        that.i.minH.siftUp(vIndex);
                    }
                }
            )
        },

        __construct: function (graph) {
            this.__super(graph, true, true);
        },

        process: function () {
            var i;

            this.i.resetGraph();

            // while queue is not empty
            while (this.i.minH.size() > 0) {
                this.i.algorithm();
                // redraw the graph
                this.i.graph.renderer.redraw();
            }

            this.i.root.data.color = "red";
        },
        step_by_step: function () {
            var that = this;

            this.i.resetGraph();

            $('#nextStep').click(
                function () {
                    if (that.i.minH.size() > 0) {
                        that.i.algorithm();
                    } else {
                        $(this).attr('disabled', true);
                        $('#runAlg').attr('disabled', false);
                        $(this).unbind('click');
                    }

                    that.i.graph.renderer.redraw();
                }
            );
        },

        resetGraph: function () {
            var that = this;

            // init priority queue
            this.i.minH = new MinHeap(null, function (item1, item2) {
                return item1.data.key == item2.data.key ? 0 : item1.data.key < item2.data.key ? -1 : 1;
            });

            this.i.root = undefined;

            var sum = 1;
            this.i.graph.eachEdge(
                function (edge, pt1, pt2) {
                    sum += edge.data.cost;
                }
            );

            // set all nodes to max value
            this.i.graph.eachNode(
                function (node, pt) {
                    node.data.key = sum;
                    node.data.parent = null;
                }
            );

            this.i.graph.eachNode(function (node, pt) {
                if (that.i.root == undefined) {
                    that.i.root = node;
                }
            })

            that.i.root.data.key = 0;
            that.i.root.data.color = "red";
            that.i.root.data.label = that.i.root.name + ', ' + that.i.root.data.key + ', ' + null;

            // insert all nodes into priority queue (using heap)
            this.i.graph.eachNode(
                function (node, pt) {
                    that.i.minH.push(node);
                }
            );
        }
    }),
]);
