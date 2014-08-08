<!DOCTYPE html>
<meta charset="utf-8">
<style type="text/css">

	.node {
		cursor: pointer;
	}

	.overlay {
		background-color: #EEE;
	}

	.node rect {
		fill: #000;
		stroke: steelblue;
		stroke-width: 1.5px;
	}

	.node text {
		font-size: 11px;
		font-family: Helvetica Neue, Helvetica, Arial;
		font-weight: bold;
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

	.ghostCircle.show {
		display: block;
	}

	.ghostCircle, .activeDrag .ghostCircle {
		display: none;
	}

</style>
<link rel="stylesheet" href="styles/reveal.css">
<script src="scripts/jquery-1.10.2.min.js"></script>
<script src="scripts/d3.min.js"></script>
<script src="scripts/dnd.js"></script>
<script src="scripts/select/select2.js"></script>
<script src="scripts/jquery.reveal.js"></script>
<script src="scripts/search.js"></script>
<body>
<div id="tree-container"></div>
<div id="searchModal" class="reveal-modal">
	<h1>Add</h1>
	<div id="myselect" style="width:400px"></div>
	<a class="close-reveal-modal">&#215;</a>
</div>
</body>
</html>