

function createProductViewers(uri, conclusionText)
{
	startLoadingProductScreen();
	
	//enable and reset Product view
	$("#tabs").tabs('enable', 1);
	clearProductTabs();
	
	var visualizations;
	
	VisCacheAccess.getCachedVisualizations(uri, 
	{
		callback: function(data)
		{
			visualizations = data;
			
			if(visualizations != null)
			{
				VisCacheAccess.getViewer(uri, 
				{
					callback: function(viewerData)
					{
						var viewers = viewerData;// eval("(" + data + ")");
						
						if(viewerData!=null)
						{
							for(var i=0; i<viewers.length; i++)
							{
								//Image
								if(viewers[i]=="http://rio.cs.utep.edu/ciserver/ciprojects/viskoOperator/imageJ-viewer.owl#imageJ-viewer")
								{
									visType = "Image";
									$("#tabsBottom").tabs("add", "#tabs-"+i, "Image",1);
									$("#tabs-"+i).attr("class", "tabsBottomFill");
									$("#tabs-"+i).html("<img src="+visualizations[i]+" />");
								}
								//PDF
								else if(viewers[i]=="http://rio.cs.utep.edu/ciserver/ciprojects/viskoOperator/pdf-viewer.owl#pdf-viewer")
								{
									visType = "PDF";
									$("#tabsBottom").tabs("add", "#tabs-"+i, "PDF",0);
									$("#tabs-"+i).attr("class", "tabsBottomFill");
									$("#tabs-"+i).html("<iframe src=\"http://docs.google.com/gview?url="+visualizations[i]+"&embedded=true\" style=\"width:99%; height:98%;\" frameborder=\"2\">" +
											"<object data=\""+visualizations[i]+"\" type=\"application/pdf\" width=\"100%\" height=\"100%\"><p>It appears you don't have a PDF plugin for this browser. you can <a href=\""+visualizations[i]+"\">click here to download the PDF file.</a></p>" +
											"</object></iframe>");
								}
								//Text
								else if(viewers[i]=="http://rio.cs.utep.edu/ciserver/ciprojects/viskoOperator/plain-text-viewer.owl#plain-text-viewer")
								{
									//if .tex, .txt, ...
									var text = getTextFromFile(visualizations[i]);
									
									visType = "Text";
									$("#tabsBottom").tabs("add", "#tabs-"+i, "Text",3);
									$("#tabs-"+i).attr("class", "tabsBottomFill");
									$("#tabs-"+i).html("<div class=\"fill\"> <pre>"+text+"</pre> </div>"); //<pre> </pre>
								}
							}
						}
						
						$(".tabs-bottom .ui-tabs-nav, .tabs-bottom .ui-tabs-nav > *").removeClass("ui-corner-all ui-corner-top")
						.addClass("ui-corner-bottom");
						$("#tabsBottom").tabs("select",0);
					},
					
					errorHandler: function(errorString, exception)
					{
						alert("Error getting Visualization Viewer Types: " + errorString + "\n Exception: " + dwr.util.toDescriptiveString(exception, 2));
					    endLoadingScreen();
					}
				});
			}
			else //visualizations returned null
			{
				if(conclusionText != null)
				{
					$("#tabsBottom").tabs("add", "#tabs-1", "Text",1);
					$("#tabs-1").attr("class", "tabsBottomFill");
					$("#tabs-1").html("<div class=\"fill\"> <pre>"+conclusionText+"</pre> </div>"); //<pre> </pre>
				}
				else
				{
					$("#tabsBottom").tabs("add", "#tabs-1", "No Vis",1);
					$("#tabs-1").attr("class", "tabsBottomFill");
					$("#tabs-1").html("<h2>No Visualization(s) of Product found.</h2>");
				}
				
				//alert("No Visualization(s) of Product found.");
			}
			
			endLoadingProductScreen();
		},
		
		errorHandler: function(errorString, exception)
		{
			alert("Error Accessing Cached Visualizations: " + errorString + "\n Exception: " + dwr.util.toDescriptiveString(exception, 2));
		    endLoadingScreen();
		    endLoadingProductScreen();
		}
	});
}


function getTextFromFile(url)
{
	var txtFile = new XMLHttpRequest();
	txtFile.open("GET", url, false);
	
	var allText = "text";
	
	txtFile.onreadystatechange = function() 
	{
	  if (txtFile.readyState === 4) {  // Makes sure the document is ready to parse.
		  if (txtFile.status === 200) {  // Makes sure it's found the file.
			  allText = txtFile.responseText; 
	      //lines = txtFile.responseText.split("\n"); // Will separate each line into an array
	    }
	  }
	};
	
	txtFile.send(null);
	
	return allText;
}

/** Returns location of cached thumbnail from nodesetURI */
function getViskoThumbnail(uri)
{
	var thumbnailURI = null;
	
	VisCacheAccess.getCachedThumbnail(uri, 
	{
		async: false, 
		callback: function(data)
		{
			thumbnailURI = data;
		},
		
		errorHandler: function(errorString, exception)
		{
			alert("Error finding thumbnail: " + errorString + "\n Exception: " + exception);
		    endLoadingScreen();
		}
	});
	
	return thumbnailURI;
}




/* Loading for Product Visualizations */
function startLoadingProductScreen()
{
	$("#tabsBottom").block({ 
		message: '<h1>Loading Visualizations...</h1>', 
		border: 'none', 
		padding: '15px', 
		backgroundColor: '#000', 
		'-webkit-border-radius': '10px', 
		'-moz-border-radius': '10px', 
		opacity: .5, 
		color: '#fff'  
	}); 
}

function endLoadingProductScreen()
{
	$("#tabsBottom").unblock(); 
}