<?

date_default_timezone_set( "America/Los_Angeles" );

$FILE_PROJECTS_DATA_JSON = "assets/data/projects.json";

$projectsJSON = file_get_contents( $FILE_PROJECTS_DATA_JSON );
$projectsData = json_decode( $projectsJSON , true );

header("Content-type: text/xml");

?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

	<url>
		<loc>http://marcelray.com/</loc>
		<lastmod><?=date('c')?></lastmod>
		<priority>1.00</priority>
	</url>
<?php foreach ( $projectsData['projects'] as $iProject ) : ?>
	<url>
		<loc>http://marcelray.com/#<?=$iProject['id']?></loc>
		<lastmod><?=date('c')?></lastmod>
		<priority>0.64</priority>
	</url>
<?php endforeach; ?>
	<url>
		<loc>http://marcelray.com/assets/downloads/marcelray-resume.pdf</loc>
		<lastmod><?=date('c')?></lastmod>
		<priority>0.64</priority>
	</url>
	<url>
		<loc>http://marcelray.com/assets/downloads/marcelray-resume.txt</loc>
		<lastmod><?=date('c')?></lastmod>
		<priority>0.64</priority>
	</url>

</urlset>

