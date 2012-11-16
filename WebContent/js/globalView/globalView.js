

function getTree(URI)
{
	
	JustificationTreeBuilder.getJustificationTree(URI,
			{
				callback: function(jsonResult)
				{
					alert("JSON TREE: \n"+jsonResult);
					/*
					var infSteps = jsonTree.PMLnode.inferenceSteps;
					
					if(infSteps !=null && infSteps.length > 0)
					{
						infSteps[0]...
					}
					*/
					
					//This javascript replaces all 3 types of line breaks with an html break
					jsonResult = jsonResult.replace(/(\r\n|\n|\r)/gm," <br/> ");
					
					var jsonTree = jsonParse(jsonResult);
					
					
					drawTree(jsonTree);
				},
				
				
				errorHandler: function(errorString, exception)
				{
					alert("Error getting Tree content: " + errorString );//+ "\n Exception: " + dwr.util.toDescriptiveString(exception, 2));
				    
				}
			});
	
}



function drawTree(jsonTree)
{
	var m = [ 40, 100, 40, 100 ], 
	w = 1280 - m[1] - m[3], 
	h = 800 - m[0] - m[2], 
	i = 0, 
	root;


	var tree = d3.layout.tree().size([ h, w ]);

	var diagonal = d3.svg.diagonal().projection(function(d) {
		return [ d.y, d.x ];
	});


	var vis = d3.select("#container")
	.append("svg:svg")
	.attr("width", w + m[1] + m[3])
	.attr("height", h + m[0] + m[2])
	.append("svg:g")
	.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	root = jsonTree;
	root.x0 = h / 2;
	root.y0 = 0;

	function toggleAll(d) 
	{
		if (d.children) {
			d.children.forEach(toggleAll);
			toggle(d);
		}
	}

	// Initialize the display to show a few nodes.
	//root.children.forEach(toggleAll);
	//toggle(root.children[0]);

	update(root);

	function update(source)
	{
		var duration = d3.event && d3.event.altKey ? 5000 : 500;

		// Compute the new tree layout.
		var nodes = tree.nodes(root);//.reverse();

		// Normalize for fixed-depth.
		nodes.forEach(function(d) {
			d.y = d.depth * 300;
		});

		// Update the nodes�
		var node = vis.selectAll("g.node").data(nodes, function(d) {
			return d.id || (d.id = ++i);
		});

		// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter()
		.append("svg:g")
		.attr("class", "node")
		.attr("transform", function(d) {
			return "translate(" + source.y0 + "," + source.x0 + ")";
		})
		.on("click", function(d) {
			toggle(d);
			update(d);
		});

		//Rect
		nodeEnter.append("svg:rect")
		.attr("width", 250)
		.attr("height", 100)
		.style("fill", function(d) {
			return d._children ? "lightsteelblue" : "#fff";
		})
		.attr("x", -125)
		.attr("y", -50);

		  
		//Add image to node, if available
		nodeEnter.append("svg:image")
		//.append("svg:image")
		.attr("xlink:href", function(d) 
		{
			if(d.PMLnode.conclusion.thumbURL != null)
				return d.PMLnode.conclusion.thumbURL;
			else
				return "../../images/No_sign.svg.png";
		})
		.attr("width", 225)
		.attr("height", 75)
		.attr("x", -113)
		.attr("y", -38);
		//.attr("cx", 40)
		//.attr("cy", 40);

		//Add text to node if available
		nodeEnter.append("svg:text").attr("x", function(d) {
			return d.children || d._children ? 125 : 125;//125 : -125;
		})
		.attr("dy", ".35em")
		.attr("text-anchor", function(d) {
			return d.children || d._children ? "start" : "start";//"start" : "end";
		}).text(function(d) {
			
			if(d.PMLnode.inferenceSteps != null)
			{
				return "Engine: "+d.PMLnode.inferenceSteps[0].infEngine+" <br> Rule: "+d.PMLnode.inferenceSteps[0].declRule;
			}
			
			return "Inference Step Information not found";
		}).style("fill-opacity", 1e-3);

		// Transition nodes to their new position.
		var nodeUpdate = node.transition().duration(duration).attr(
				"transform", function(d) {
					return "translate(" + d.y + "," + d.x + ")";
				});

		nodeUpdate.select("rect")
			.attr("width", 250)
			.attr("height", 100)
			.style("fill", function(d) 
			{
				return d._children ? "lightsteelblue" : "#fff";
			});

		nodeUpdate.select("text").style("fill-opacity", 1);

		// Transition exiting nodes to the parent's new position.
		var nodeExit = node.exit().transition().duration(duration)
		.attr(
				"transform",
				function(d) {
					return "translate(" + source.y + ","
					+ source.x + ")";
				}).remove();

		nodeExit.select("rect").attr("width", 1e-6).attr("height", 1e-6);
		
		nodeExit.select("image").attr("width", 1e-6).attr("height", 1e-6);

		nodeExit.select("text").style("fill-opacity", 1e-6);

		// Update the links�
		var link = vis.selectAll("path.link").data(tree.links(nodes),
				function(d) {
			return d.target.id;
		});

		// Enter any new links at the parent's previous position.
		link.enter().insert("svg:path", "g").attr("class", "link")
		.attr("d", function(d) {
			var o = {
					x : source.x0,
					y : source.y0
			};
			return diagonal({
				source : o,
				target : o
			});
		}).transition().duration(duration).attr("d", diagonal);

		// Transition links to their new position.
		link.transition().duration(duration).attr("d", diagonal);

		// Transition exiting nodes to the parent's new position.
		link.exit().transition().duration(duration).attr("d",
				function(d) {
			var o = {
					x : source.x,
					y : source.y
			};
			return diagonal({
				source : o,
				target : o
			});
		}).remove();

		// Stash the old positions for transition.
		nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
		});
	}

	// Toggle children.
	function toggle(d) {
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			d.children = d._children;
			d._children = null;
		}
	}
}