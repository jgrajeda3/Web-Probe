/**
 * @author Hugo Porras
 * 
 * Acknowledgements:
 * This work used resources from Cyber-ShARE Center of Excellence, 
 * which is supported by National Science Foundation grant number 
 * HRD-0734825. Unless otherwise stated, work by Cyber-ShARE is 
 * licensed under a Creative Commons Attribution 3.0 Unported 
 * License. Permissions beyond the scope of this license may be 
 * available at 
 * http://cybershare.utep.edu/content/cyber-share-acknowledgment.
 */

package prov.interfaces.globalView;

/**
 * 
 * @author joshuagrajeda
 *
 */

public class PROVJustificationTreeBuilder
{
	static WPPROVJustificationTree tree;
	
	/** builds the Justification Tree and returns the JSON representation of it */
	public static String getJustificationTree(String URI)
	{
		tree = new WPPROVJustificationTree(URI);
		return tree.convertToJSON();
	}
	
	public static void main(String args[])
	{
		String uri = "http://www.w3.org/2006/03/wn/wn20/rdf/wordnet-sameverbgroupas.rdf";
		//http://rio.cs.utep.edu/ciserver/ciprojects/GravityMapProvenance/gravityContourMap.ps_038568341971146025.owl#answer
		String treeJSON = getJustificationTree(uri);
		System.out.println("This is a test");
		System.out.println( treeJSON );
		System.out.println("This is a test");
		
	}
}
