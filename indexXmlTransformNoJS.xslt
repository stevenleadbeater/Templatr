<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
 <xsl:output omit-xml-declaration="yes" indent="yes"/>    
<xsl:template match="CatModels">
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
	    <head>
            <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"/>
		    <script type="text/javascript">
          try{
            var t1 = window.performance.now();
          } catch(ex) {
            var t1 = new Date().getTime();
          }
        </script>
	    </head>
	    <body>
            <h2>XSLT without JS</h2>
            <div>
                <div><span>Initial: </span><span id="initialLoad"></span></div>                
            </div>
		    <div>        
                <xsl:apply-templates select="CatModel"/>
            </div>
            <script type="text/javascript">
              document.addEventListener('DOMContentLoaded', function () {
              try{
              var t2 = window.performance.now();
              } catch(ex) {
              var t2 = new Date().getTime();
              }
              document.getElementById("initialLoad").innerText = "First render: " + (t2 - t1);
              })
            </script>
	    </body>
    </html>
</xsl:template>           
<xsl:template match="CatModel" name="standardRow">
    <div class="cat {@class} {@name} {@color}" data-list="true" data-value="cat">
        <div>Type of cat:</div><div class="catName" data-target="name"><xsl:value-of select="@name"/></div>
        <div>Cat colouring: </div><div class="catColor" data-target="color"><xsl:value-of select="@color"/></div>
        <div>Trips to the Vet: </div>
        <div style="border:1px solid black;">
            <div class="vetTrips">
                <xsl:apply-templates select="VetTrips"/>
            </div>
        </div>
    </div>
</xsl:template>
<xsl:template match="VetTrip">
    <xsl:element name="div">
        <xsl:apply-templates select="@*|node()"/>
    </xsl:element>
</xsl:template>
<xsl:template match="@*">
    <xsl:element name="div">
        <xsl:attribute name="class"><xsl:value-of select="name(.)"/></xsl:attribute>
        <xsl:value-of select="."/>
    </xsl:element>
</xsl:template>
</xsl:stylesheet>