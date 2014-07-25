/*jslint browser: true*/
/*global $, jQuery*/

$(document).ready(function() {
  graphAlgs.init();
  reset();
  generaPDF();
  clearStepsContainer();
  listener();
});

function exportGraph() {

  thisObj = graphAlgs.getGraph();

  var graphExported = "";

  thisObj.graph.eachEdge(
    function(edge, pt1, pt2){
      graphExported += edge.source.name + " " + edge.target.name + " " + edge.data.cost + "\n";
    }
  );

  var fileName = $('#fileName').val() + ".txt";

  var blob = new Blob([graphExported], {
    type: "text/plain;charset=utf-8;",
  });
  saveAs(blob, fileName);
}

function handleFileSelect(evt) {
  var files = evt.target.files;

  f = files[0];

  var reader = new FileReader();

  reader.onload = (function(theFile) {
    return function(e) {
      var text = e.target.result;
      var lines = text.split("\n");
      var values;

      var i = 0;

      while (i < lines.length)
      {
        if (lines[i] != "")
        {
          values = lines[i].split(" ");

          if (values.length != 3  ||
              isNaN(values[2])
             )
          {
            alert("Wrong file format!");
            break;
          }

          var u = values[0].toUpperCase();
          var v = values[1].toUpperCase();

          thisObj = graphAlgs.getGraph();

          thisObj.graph.eachNode(
            function(node, pt){
              thisObj.graph.pruneNode(node);
            }
          );

          if(thisObj.graph.getNode(u) == undefined)
          {
            thisObj.graph.addNode(u, {'color':'black','shape':'dot','label':u});
          }

          if(thisObj.graph.getNode(v) == undefined)
          {
            thisObj.graph.addNode(v, {'color':'black','shape':'dot','label':v});
          }

          thisObj.graph.addEdge(u, v, {cost: values[2]});
          thisObj.graph.addEdge(v, u, {cost: values[2]});
          thisObj.graph.renderer.redraw();
        }

        i++;
      }
    };
  })(f);

  reader.readAsText(f);

}

function listener()
{
  $('#clearpdf').click(clearStepsContainer);
  $('#runAlg').click(clearStepsContainer);

  $('.pdfType').click(function () {
    pdftype = $(this).val();

    switch (pdftype)
    {
      case "1":
        $('#genpdf2').css('display', 'inline-block');
        $('#genpdf').css('display', 'none');
        break;
      case "2":
        $('#genpdf2').css('display', 'none');
        $('#genpdf').css('display', 'inline-block');
        break;
    }

  });

  if (window.File && window.FileReader && window.FileList && window.Blob) {}
  else
  {
    alert('The File APIs are not fully supported in this browser.');
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);

  $('.editor').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') {
      $('#addEdge').click();
    }
  });

  $('#export').click(exportGraph);
}

function reset() {
  $('#selectAlgorithm')[0].selectedIndex = 0;
  $('[name=graphDensity]').val(['simpleGraph']);
  $('[name=stepByStep]').attr('checked', false);
}

function generaPDF(n) {
  document.getElementById("nextStep").onclick = function()
  {
    var container = document.getElementById("stepsContainer");
    container.insertBefore(Canvas2Image.convertToImage(document.getElementById("viewport"), 800, 400, "png"), container.firstChild);
  };

  document.getElementById("genpdf").onclick = function(){
    if(document.getElementById("nextStep").disabled != true)
    {
      var container = document.getElementById("stepsContainer");
      container.insertBefore(Canvas2Image.convertToImage(document.getElementById("viewport"), 800, 400, "png"), container.firstChild);
    }
    var doc = new jsPDF();
    var specialElementHandlers = {
      'DIV to be rendered out': function(element, renderer){
        return true;
      }
    };
    var image = document.getElementsByTagName("img");
    var y = 40;
    var j = 0;
    for(var i=document.getElementsByTagName("img").length-1; i > -1; i--)
    {
      if((j != 0) && (j % 2 == 0))
      {
        doc.addPage(1);
        y=40;
      }
      imgData = image[i].src;
      doc.addImage(imgData, 'PNG', 15, y, 180, 90);
      y+=90;
      j++;
    }
    var html=document.getElementById("stepsContainer").innerHTML;
    doc.fromHTML(html,0,0, {
      'width': 800,
      'elementHandlers': specialElementHandlers
    });
    doc.save("Graph.pdf");
  };

  document.getElementById("genpdf2").onclick = function(){    
    if(document.getElementById("nextStep").disabled != true)
    {
      var container = document.getElementById("stepsContainer");
      container.insertBefore(Canvas2Image.convertToImage(document.getElementById("viewport"), 800, 400, "png"), container.firstChild);
    }
    var doc = new jsPDF();
    var specialElementHandlers = {
      'DIV to be rendered out': function(element, renderer){
        return true;
      }
    };
    var image = document.getElementsByTagName("img");
    var y = 60;
    var j = 0;
    for(var i=document.getElementsByTagName("img").length-1; i > -1; i--)
    {
      if(j != 0)
        doc.addPage(1);
      imgData = image[i].src;
      doc.addImage(imgData, 'PNG', 15, y, 180, 90);
      j++;
    }
    var html=document.getElementById("stepsContainer").innerHTML;
    doc.fromHTML(html,0,0, {
      'width': 800,
      'elementHandlers': specialElementHandlers
    });
    doc.save("Graph.pdf");
  }
}

function clearStepsContainer() {
  $('#stepsContainer').empty();
}

var graphAlgs = {

  getSimpleGraph: function(){
    var simpleGraph = {
      nodes:{
        A:{'color':'black','shape':'dot','label':'A'},
        B:{'color':'black','shape':'dot','label':'B'},
        C:{'color':'black','shape':'dot','label':'C'},
      },
      edges:{
        A:{ B:{cost: 2}, C:{cost: 3 } },
        B:{ A:{cost: 2}, C:{cost: 4}},
        C:{ A:{cost: 3 }, B:{cost: 4} }
      }
    }
    return simpleGraph;
  },

  getGraph1: function(){
    var graph1 = {
      nodes:{
        A:{'color':'black','shape':'dot','label':'A'},
        B:{'color':'black','shape':'dot','label':'B'},
        C:{'color':'black','shape':'dot','label':'C'},
        D:{'color':'black','shape':'dot','label':'D'},
        E:{'color':'black','shape':'dot','label':'E'},
        F:{'color':'black','shape':'dot','label':'F'},
        G:{'color':'black','shape':'dot','label':'G'}
      },
      edges:{
        A:{ B:{cost: 8}, C:{cost: 5 } },
        B:{ A:{cost: 8}, C:{cost: 10}, D:{cost: 2 }, E:{cost: 18} },
        C:{ A:{cost: 5 }, B:{cost: 10}, D:{cost: 3}, F:{cost: 16} },
        D:{ B:{cost: 2 }, C:{cost: 3}, E:{cost: 12}, F:{cost: 30}, G:{cost: 14} },
        E:{ B:{cost: 18}, D:{cost: 12}, G:{cost: 4 } },
        F:{ C:{cost: 16}, D:{cost: 30}, G:{cost: 26} },
        G:{ D:{cost: 14}, E:{cost: 4 }, F:{cost: 26} }
      }
    }
    return graph1;
  },

  getGraph2: function(){
    var graph2 = {
      nodes:{
        A:{'color':'black','shape':'dot','label':'A'},
        B:{'color':'black','shape':'dot','label':'B'},
        C:{'color':'black','shape':'dot','label':'C'},
        D:{'color':'black','shape':'dot','label':'D'},
        E:{'color':'black','shape':'dot','label':'E'},
        F:{'color':'black','shape':'dot','label':'F'},
        G:{'color':'black','shape':'dot','label':'G'},
        H:{'color':'black','shape':'dot','label':'H'}
      },
      edges:{
        A:{ B:{cost: 5}, D:{cost: 3}, E:{cost: 4}, H:{cost: 3}},
        B:{ A:{cost: 5}, C:{cost: 6}, E:{cost: 1}, F:{cost: 5} },
        C:{ B:{cost: 6}, F:{cost: 3}, G:{cost: 2}, D:{cost: 5} },
        D:{ A:{cost: 3}, C:{cost: 5}, G:{cost: 2}, H:{cost: 1} },
        E:{ A:{cost: 4}, B:{cost: 1}, F:{cost: 6}, H:{cost: 5} },
        F:{ B:{cost: 5}, C:{cost: 3}, E:{cost: 6}, G:{cost: 4} },
        G:{ C:{cost: 2}, D:{cost: 2}, F:{cost: 4}, H:{cost: 2} },
        H:{ A:{cost: 3}, D:{cost: 1}, E:{cost: 5}, G:{cost: 2} }
      }
    };
    return graph2;
  },

  getGraph3: function(){
    var graph3 = {
      nodes:{
        A:{'color':'black','shape':'dot','label':'A'},
        B:{'color':'black','shape':'dot','label':'B'},
        C:{'color':'black','shape':'dot','label':'C'},
        D:{'color':'black','shape':'dot','label':'D'},
        E:{'color':'black','shape':'dot','label':'E'},
        F:{'color':'black','shape':'dot','label':'F'},
        G:{'color':'black','shape':'dot','label':'G'},
        H:{'color':'black','shape':'dot','label':'H'},
        I:{'color':'black','shape':'dot','label':'I'},
        K:{'color':'black','shape':'dot','label':'K'}
      },
      edges:{
        A:{ B:{cost: 2}, E:{cost: 4} },
        B:{ A:{cost: 2}, C:{cost: 3}, E:{cost: 4}, I:{cost: 10} },
        C:{ B:{cost: 3}, D:{cost: 4}, E:{cost: 4} },
        D:{ C:{cost: 4}, E:{cost: 5}, F:{cost: 2} },
        E:{ A:{cost: 4}, B:{cost: 4}, C:{cost: 4}, D:{cost: 5}, F:{cost: 4}, H:{cost: 7}, I:{cost: 3} },
        F:{ D:{cost: 2}, E:{cost: 4}, H:{cost: 3}, I:{cost: 6} },
        G:{ F:{cost: 3}, H:{cost: 3} },
        H:{ E:{cost: 7}, F:{cost: 3}, G:{cost: 3}, G:{cost: 2} },
        I:{ B:{cost: 10}, E:{cost: 3}, F:{cost: 6}, H:{cost: 2} },
        K:{ I:{cost: 4} }
      }
    };
    return graph3;
  },

  renderGraphViz: function(nodeData){
    var graph = arbor.ParticleSystem(200, 400, 0.5) // create the graphtem with sensible repulsion/stiffness/friction
    graph.parameters({gravity:false}) // use center-gravity to make the graph settle nicely (ymmv)
    graph.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by graph...
    graph.graft(nodeData);
    this.graph = graph;
  },

  renderPredTree: function(){
    var thisObj = this;
    this.graph.eachNode(
      function(node, pt){
        if(node.data.parent !== null){
          var edge = thisObj.graph.getEdges(node.data.parent, node.name);
          edge[0].data.color  = "#4895FA";
          edge[0].data.weight = 2;
        }
      }
    );
  },

  resetGraph: function(){
    var thisObj = this;
    this.graph.eachNode(
      function(node, pt){
        node.data.label = node.name;
        node.data.color = 'black';
        var nodeEdges = thisObj.graph.getEdgesFrom(node);
        nodeEdges.forEach(function(edge, index, edgeArray){
          edge.data.weight = 1;
          edge.data.color  = null;
        });
      }
    );
    this.graph.renderer.redraw();
  },

  Kruskal: function() {
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

  Kruskal_step_by_step: function() {
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
  },

  Prims: function(){
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

  Prims_step_by_step: function(){
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
  },

  runAlgorithm: function(algorithm){
    var thisObj = this;
    thisObj.resetGraph();
    $('#nextStep').attr('disabled',false)
    switch(algorithm){
      case 'Kruskal':
        this.stepByStep ? this.Kruskal_step_by_step() : this.Kruskal();
        break;
      case 'Prim':
        this.stepByStep ? this.Prims_step_by_step() : this.Prims();
        break;
    }
    if(!this.stepByStep){
      this.renderPredTree();
      this.graph.renderer.redraw();
    }
  },

  initGraphTypeButtonListener: function(){
    var thisObj = this;
    $('.graphType').click(
      function()
      {
        var graphSelected = $(this).val();

        switch (graphSelected)
        {
          case 'simpleGraph':
            thisObj.graph.eachNode(
              function(node, pt){
                thisObj.graph.pruneNode(node);
              }
            );
            thisObj.graph.graft(thisObj.getSimpleGraph());
            break;

          case 'graph1':
            thisObj.graph.eachNode(
              function(node, pt){
                thisObj.graph.pruneNode(node);
              }
            );
            thisObj.graph.graft(thisObj.getGraph1());
            break;

          case 'graph2':
            thisObj.graph.eachNode(
              function(node, pt){
                thisObj.graph.pruneNode(node);
              }
            );
            thisObj.graph.graft(thisObj.getGraph2());
            break;

          case 'graph3':
            thisObj.graph.eachNode(
              function(node, pt){
                thisObj.graph.pruneNode(node);
              }
            );
            thisObj.graph.graft(thisObj.getGraph3());
            break;

          case 'customGraph':
            $('#nodeFrom').focus();
            thisObj.graph.eachNode(function(node, pt){
              thisObj.graph.pruneNode(node);
            })
            break;
        }

      });
  },

  initRunAlgListener: function(){
    var thisObj = this;
    $('#runAlg').click(
      function(){
        if(thisObj.stepByStep){
          $(this).attr('disabled', true);
        }
        var algorithm   = $('#selectAlgorithm').val();
        thisObj.runAlgorithm(algorithm);
      }
    );
  },

  addEdgeListener: function(){
    var thisObj = this;

    $('#addEdge').click(function(){
      var nodeFrom = $('#nodeFrom').val().toUpperCase();
      var nodeTo   = $('#nodeTo').val().toUpperCase();
      var weight   = $('#edgeWeight').val();

      if(!nodeFrom || !nodeTo || !weight || isNaN(weight) || nodeFrom == nodeTo)
      {
        alert('One of the node fields is missing or is not formatted correctly!');
      }
      else
      {
        if(thisObj.graph.getNode(nodeFrom) == undefined)
        {
          thisObj.graph.addNode(nodeFrom, {'color':'black','shape':'dot','label':nodeFrom});
        }

        if(thisObj.graph.getNode(nodeTo) == undefined)
        {
          thisObj.graph.addNode(nodeTo, {'color':'black','shape':'dot','label':nodeTo});
        }

        $('#nodeFrom').val('');
        $('#nodeTo').val('');
        $('#edgeWeight').val('');
        $('#nodeFrom').focus();

        thisObj.graph.addEdge(nodeFrom, nodeTo, {cost: weight});
        thisObj.graph.addEdge(nodeTo, nodeFrom, {cost: weight});
        thisObj.graph.renderer.redraw();
      }
    });
  },

  resultsData: [],

  isSparse: true,

  init: function(){
    var thisObj = this;
    var simpleGraph = this.getSimpleGraph();

    this.renderGraphViz(simpleGraph);

    this.initGraphTypeButtonListener();

    this.initRunAlgListener();

    this.addEdgeListener();

    $('#stepByStep').click(function(){
      $('#runAlg').attr('disabled', false);
      if($(this).is(':checked')){
        thisObj.stepByStep = true;
        $('#nextStep').css('display', 'inline-block');
      }else{
        thisObj.stepByStep = false;
        $('#nextStep').hide();
      }
    })
  },

  getGraph: function () {
    return this;
  },
};
