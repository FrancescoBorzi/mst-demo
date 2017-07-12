graphAlgs.Kruskal = function() {
    var thisObj = this;

    var minH = new MinHeap(null, function(item1, item2) {
      return item1.data.cost == item2.data.cost ? 0 : item1.data.cost < item2.data.cost ? -1 : 1;
    });

    this.graph.eachEdge(
      function(edge, pt){
        minH.push(edge);
      }
    );

    var orderedEdges = new Array(); // array degli edges ordinati in base al loro peso

    while (minH.size() > 0) {
      orderedEdges.push(minH.pop());
    }

    // creo il find_set
    var nodeIndex = 0;
    var set = new Array();

    this.graph.eachNode(
      function(node, pt){
        set[nodeIndex] = new Array(2);
        set[nodeIndex][0] = node.name;
        set[nodeIndex][1] = node.name;
        nodeIndex++;
      }
    );

    var i, j;

    // procedura Kruskal
    for (i = 0; i < orderedEdges.length; i++)
    {
      var u = orderedEdges[i].source;
      var v = orderedEdges[i].target;

      var inv = thisObj.graph.getEdges(v.name, u.name);

      while (inv.length > 0 && inv[0].data.color != null)
      {
        i++;

        var u = orderedEdges[i].source;
        var v = orderedEdges[i].target;

        var inv = thisObj.graph.getEdges(v.name, u.name);
      }

      var u_set = null;
      var v_set = null;

      j = 0;

      // find set
      while (u_set == null || v_set == null)
      {
        if (set[j][0] == u.name)
        {
          u_set = set[j][1];
        }
        else if (set[j][0] == v.name)
        {
          v_set = set[j][1];
        }

        j++;
      }

      if (u_set != v_set)
      {
        for (j = 0; j < set.length; j++)
        {
          if (set[j][1] == v_set)
          {
            set[j][1] = u_set;
          }
        }

        orderedEdges[i].data.color = "#4895FA";
        orderedEdges[i].data.weight = 2;
      }
      else
      {
        orderedEdges[i].data.color = "red";
        orderedEdges[i].data.weight = 2;
      }
      thisObj.graph.renderer.redraw();
    }

    thisObj.graph.renderer.redraw();
  },

graphAlgs.Kruskal_step_by_step = function() {
    var thisObj = this;

    var minH = new MinHeap(null, function(item1, item2) {
      return item1.data.cost == item2.data.cost ? 0 : item1.data.cost < item2.data.cost ? -1 : 1;
    });

    this.graph.eachEdge(
      function(edge, pt){
        minH.push(edge);
      }
    );

    var orderedEdges = new Array(); // array degli edges ordinati in base al loro peso

    while (minH.size() > 0) {
      orderedEdges.push(minH.pop());
    }

    // creo il find_set
    var nodeIndex = 0;
    var set = new Array();

    this.graph.eachNode(
      function(node, pt){
        set[nodeIndex] = new Array(2);
        set[nodeIndex][0] = node.name;
        set[nodeIndex][1] = node.name;
        nodeIndex++;
      }
    );

    var i, j;

    // procedura Kruskal
    i = 0;
    $('#nextStep').click(
      function()
      {
        if (i < orderedEdges.length - 1 )
        {
          var u = orderedEdges[i].source;
          var v = orderedEdges[i].target;

          var inv = thisObj.graph.getEdges(v.name, u.name);

          while (inv.length > 0 && inv[0].data.color != null)
          {
            i++;

            var u = orderedEdges[i].source;
            var v = orderedEdges[i].target;

            var inv = thisObj.graph.getEdges(v.name, u.name);
          }

          var u_set = null;
          var v_set = null;

          j = 0;

          // find set
          while (u_set == null || v_set == null)
          {
            if (set[j][0] == u.name)
            {
              u_set = set[j][1];
            }
            else if (set[j][0] == v.name)
            {
              v_set = set[j][1];
            }

            j++;
          }

          if (u_set != v_set)
          {
            for (j = 0; j < set.length; j++)
            {
              if (set[j][1] == v_set)
              {
                set[j][1] = u_set;
              }
            }

            orderedEdges[i].data.color = "#4895FA";
            orderedEdges[i].data.weight = 2;
          }
          else
          {
            orderedEdges[i].data.color = "red";
            orderedEdges[i].data.weight = 2;
          }
          i++;
        }
        else
        {
          $(this).attr('disabled', true);
          $('#runAlg').attr('disabled', false);
          $(this).unbind('click');
        }

        thisObj.graph.renderer.redraw();
      }
    );
  };