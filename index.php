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
<script src="jquery-1.10.2.min.js"></script>
<script src="d3.min.js"></script>
<script src="dnd.js"></script>
<body>
<div id="tree-container"></div>
</body>
</html>