
  graphAlgs.Prims = function(){
    var thisObj = this;
    var root    = undefined;

    this.graph.eachNode(function(node, pt){
      if(root == undefined){
        root = node;
      }
    })

    this.graph.eachNode(
      function(node, pt){
        node.data.key    = 1000;
        node.data.parent = null;
      }
    );
    root.data.key = 0;
    root.data.label = root.name + ', ' + root.data.key + ', ' + root.data.parent;

    var minQ = new MinHeap(null, function(item1, item2) {
      return item1.data.key == item2.data.key ? 0 : item1.data.key < item2.data.key ? -1 : 1;
    });

    this.graph.eachNode(
      function(node, pt){
        minQ.push(node);
      }
    );

    while(minQ.size() > 0){
      var u = minQ.pop();
      var edges = thisObj.graph.getEdgesFrom(u);
      edges.forEach(
        function(edge, index, adjArray){
          var v      = edge.target;
          var vIndex = minQ.exists(v);
          if((vIndex !== false) && (edge.data.cost < v.data.key)){
            v.data.parent = u.name;
            v.data.key    = Number(edge.data.cost);
            v.data.label  = v.name + ', ' + v.data.key + ', ' + v.data.parent;
            minQ.siftUp(vIndex);
          }
        }
      )
    }
    root.data.color = "red";
  },

  graphAlgs.Prims_step_by_step = function(){
    var thisObj = this;
    var root    = undefined;

    this.graph.eachNode(function(node, pt){
      if(root == undefined){
        root = node;
      }
    })

    this.graph.eachNode(
      function(node, pt){
        node.data.key    = 1000;
        node.data.parent = null;
      }
    );
    root.data.key = 0;
    root.data.color = "red";
    root.data.label = root.name + ', ' + root.data.key + ', ' + root.data.parent;

    var minQ = new MinHeap(null, function(item1, item2) {
      return item1.data.key == item2.data.key ? 0 : item1.data.key < item2.data.key ? -1 : 1;
    });

    this.graph.eachNode(
      function(node, pt){
        minQ.push(node);
      }
    );
    $('#nextStep').click(
      function(){
        if(minQ.size() > 0){
          var u = minQ.pop();

          if(u.data.parent !== null){
            var treeEdge = thisObj.graph.getEdges(u.data.parent,u);
            treeEdge[0].data.color  = "#4895FA";
            treeEdge[0].data.weight = 2;
          }

          var edges = thisObj.graph.getEdgesFrom(u);
          edges.forEach(
            function(edge, index, adjArray){
              var v      = edge.target;
              var vIndex = minQ.exists(v);
              if((vIndex !== false) && (edge.data.cost < v.data.key)){
                v.data.key    = Number(edge.data.cost);
                v.data.parent = u.name;
                v.data.label  = v.name + ', ' + v.data.key + ', ' + v.data.parent;
                minQ.siftUp(vIndex);
              }
            }
          )
        }else{
          $(this).attr('disabled', true);
          $('#runAlg').attr('disabled', false);
          $(this).unbind('click');
        }
        thisObj.graph.renderer.redraw();
      }
    );
  };