<?php
	header("Access-Control-Allow-Origin: http://marvel.wikia.com");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: X-PINGOTHER");
	header("Access-Control-Max-Age: 1728000");
?>
<!DOCTYPE html>
<meta charset="utf-8">
<style type="text/css">

	.node {
		cursor: pointer;
	}

	.overlay{
		background-color:#EEE;
	}

	.node rect {
		fill: #000;
		stroke: steelblue;
		stroke-width: 1.5px;
	}

	.node text {
		font-size:10px;
		font-family:sans-serif;
	}

	.link {
		fill: none;
		stroke: #ccc;
		stroke-width: 1.5px;
	}

	.templink {
		fill: none;
		stroke: red;
		stroke-width: 3px;
	}

	.ghostCircle.show{
		display:block;
	}

	.ghostCircle, .activeDrag .ghostCircle{
		display: none;
	}

</style>
<script src="jquery-1.10.2.min.js"></script>
<script src="d3.min.js"></script>
<script src="dnd_org.js"></script>
<body>
<div id="tree-container"></div>
</body>
</html>