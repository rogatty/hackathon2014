loadTree = function (character) {
    var treeJSON = d3.json('data/' + character + '.json', function(error, treeData) {

        // Calculate total nodes
        var totalNodes = 0;
        // variables for drag/drop
        var selectedNode = null;
        var draggingNode = null;
        // panning variables
        var panSpeed = 200;
        // Within 20px from edges will pan when dragging.
        var panBoundary = 100;
        // Misc. variables
        var i = 0;
        var duration = 750;
        var root;
        var tileWidth = 100;
        var tileHeight = 120;
        var tileImageWidth = 90;
        var tileImageHeight = 90;

        // size of the diagram
        var viewerWidth = $(document).width();
        var viewerHeight = $(document).height();

        var tree = d3.layout.tree()
            .size([viewerHeight, viewerWidth]);

        // define a d3 diagonal projection for use by the node paths later on.
        var diagonal = d3.svg.diagonal()
            .projection(function (d) {
                return [d.x, d.y];
            });

        // A recursive helper function for performing some setup by walking through all nodes

        function visit(parent, visitFn, childrenFn) {
            if (!parent) return;

            visitFn(parent);

            var children = childrenFn(parent);
            if (children) {
                var count = children.length;
                for (var i = 0; i < count; i++) {
                    visit(children[i], visitFn, childrenFn);
                }
            }
        }

        visit(treeData, function (d) {
            totalNodes++;
        }, function (d) {
            return d.children && d.children.length > 0 ? d.children : null;
        });


        // sort the tree according to the node names

        function sortTree() {
            return; //TODO temporary disabled
            tree.sort(function (a, b) {
                return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
            });
        }

        // Sort the tree initially incase the JSON isn't in a sorted order.
        sortTree();

        // TODO: Pan function, can be better implemented.

        function pan(domNode, direction) {
            var speed = panSpeed;
            if (panTimer) {
                clearTimeout(panTimer);
                translateCoords = d3.transform(svgGroup.attr("transform"));
                if (direction == 'left' || direction == 'right') {
                    translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                    translateY = translateCoords.translate[1];
                } else if (direction == 'up' || direction == 'down') {
                    translateX = translateCoords.translate[0];
                    translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
                }
                scaleX = translateCoords.scale[0];
                scaleY = translateCoords.scale[1];
                scale = zoomListener.scale();
                svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
                d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
                zoomListener.scale(zoomListener.scale());
                zoomListener.translate([translateX, translateY]);
                panTimer = setTimeout(function () {
                    pan(domNode, speed, direction);
                }, 50);
            }
        }

        // Define the zoom function for the zoomable tree

        function zoom() {
            svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }


        // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
        var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

        function initiateDrag(d, domNode) {
            draggingNode = d;
            d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
            d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
            d3.select(domNode).attr('class', 'node activeDrag');

            svgGroup.selectAll("g.node").sort(function (a, b) { // select the parent and sort the path's
                if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
                else return -1; // a is the hovered element, bring "a" to the front
            });
            // if nodes has children, remove the links and nodes
            if (nodes.length > 1) {
                // remove link paths
                links = tree.links(nodes);
                nodePaths = svgGroup.selectAll("path.link")
                    .data(links, function (d) {
                        return d.target.id;
                    }).remove();
                // remove child nodes
                nodesExit = svgGroup.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id;
                    }).filter(function (d, i) {
                        if (d.id == draggingNode.id) {
                            return false;
                        }
                        return true;
                    }).remove();
            }

            // remove parent link
            parentLink = tree.links(tree.nodes(draggingNode.parent));
            svgGroup.selectAll('path.link').filter(function (d, i) {
                return d.target.id == draggingNode.id;

            }).remove();

            dragStarted = null;
        }

        // define the baseSvg, attaching a class for styling and the zoomListener
        var baseSvg = d3.select("#tree-container").append("svg")
            .attr("width", viewerWidth)
            .attr("height", viewerHeight)
            .attr("class", "overlay")
            .call(zoomListener);


        // Define the drag listeners for drag/drop behaviour of nodes.
        dragListener = d3.behavior.drag()
            .on("dragstart", function (d) {
                if (d == root || (d.meta && d.meta.locked)) {
                    return;
                }

                dragStarted = true;
                nodes = tree.nodes(d);
                d3.event.sourceEvent.stopPropagation();
                // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
            })
            .on("drag", function (d) {
                if (d == root || (d.meta && d.meta.locked)) {
                    return;
                }

                if (dragStarted) {
                    domNode = this;
                    initiateDrag(d, domNode);
                }

                // get coords of mouseEvent relative to svg container to allow for panning
                relCoords = d3.mouse($('svg').get(0));
                if (relCoords[0] < panBoundary) {
                    panTimer = true;
                    pan(this, 'left');
                } else if (relCoords[0] > ($('svg').width() - panBoundary)) {
                    panTimer = true;
                    pan(this, 'right');
                } else if (relCoords[1] < panBoundary) {
                    panTimer = true;
                    pan(this, 'up');
                } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                    panTimer = true;
                    pan(this, 'down');
                } else {
                    try {
                        clearTimeout(panTimer);
                    } catch (e) {

                    }
                }

                d.x0 += d3.event.dx;
                d.y0 += d3.event.dy;
                var node = d3.select(this);
                node.attr("transform", "translate(" + d.x0 + "," + d.y0 + ")");
                updateTempConnector();
            }).on("dragend", function (d) {
                if (d == root) {
                    return;
                }
                domNode = this;
                if (draggingNode && selectedNode) {
                    // now remove the element from the parent, and insert it into the new elements children
                    var index = draggingNode.parent.children.indexOf(draggingNode);
                    if (index > -1) {
                        draggingNode.parent.children.splice(index, 1);
                    }
                    if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                        if (typeof selectedNode.children !== 'undefined') {
                            selectedNode.children.unshift(draggingNode);
                        } else {
                            selectedNode._children.unshift(draggingNode);
                        }
                    } else {
                        selectedNode.children = [];
                        selectedNode.children.unshift(draggingNode);
                    }
                    // Make sure that the node being added to is expanded so user can see added node is correctly moved
                    expand(selectedNode);
                    sortTree();
                    endDrag();
                } else {
                    endDrag();
                }
            });

        function endDrag() {
            selectedNode = null;
            d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
            d3.select(domNode).attr('class', 'node');
            // now restore the mouseover event or we won't be able to drag a 2nd time
            d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
            updateTempConnector();
            if (draggingNode !== null) {
                update(root);
                centerNode(draggingNode);
                draggingNode = null;
            }
        }

        // Helper functions for collapsing and expanding nodes.

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }

        function expand(d) {
            if (d._children) {
                d.children = d._children;
                d.children.forEach(expand);
                d._children = null;
            }
        }

        var overCircle = function (d) {
            selectedNode = d;
            updateTempConnector();
        };
        var outCircle = function (d) {
            selectedNode = null;
            updateTempConnector();
        };

        // Function to update the temporary connector indicating dragging affiliation
        var updateTempConnector = function () {
            var data = [];
            if (draggingNode !== null && selectedNode !== null) {
                // have to flip the source coordinates since we did this for the existing connectors on the original tree
                data = [{
                    source: {
                        y: selectedNode.y0,
                        x: selectedNode.x0
                    },
                    target: {
                        y: draggingNode.y0,
                        x: draggingNode.x0
                    }
                }];
            }
            var link = svgGroup.selectAll(".templink").data(data);

            link.enter().append("path")
                .attr("class", "templink")
                .attr("d", d3.svg.diagonal())
                .attr('pointer-events', 'none');

            link.attr("d", d3.svg.diagonal());

            link.exit().remove();
        };

        // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

        function centerNode(source) {
            scale = zoomListener.scale();
            y = -source.y0;
            x = -source.x0;
            x = x * scale + viewerWidth / 2;
            y = y * scale + viewerHeight / 2 - 130; //TODO magic number
            d3.select('g').transition()
                .duration(duration)
                .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
            zoomListener.scale(scale);
            zoomListener.translate([x, y]);
        }

        // Toggle children function

        function toggleChildren(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else if (d._children) {
                d.children = d._children;
                d._children = null;
            }
            return d;
        }

        // Toggle children on click.

        function click(d) {
            if (d3.event.defaultPrevented) return; // click suppressed

            if (d.meta.add) {
                if (d.depth === 1) {
                    initRelation(d.parent, function (createdNode) {
                        update(d);
                        centerNode(createdNode);
                    });
                } else {
                    initSearch(d.parent, function (createdNode) {
                        update(d);
                        centerNode(d.parent);
                    });
                }

                return;
            }

            if (d.meta.url) {
                if (window.parent) {
                    window.parent.location = d.meta.url;
                } else {
                    window.location = d.meta.url;
                }
                return;
            }

            d = toggleChildren(d);
            update(d);
            centerNode(d);
        }

        function addCreationTiles(root) {
            var addTile = {
                name: 'Add',
                meta: {
                    add: true,
                    locked: true,
                    img: 'images/create.png'
                }
            };
            root.children.forEach(function (relationNode) {
                relationNode.children.push($.extend({}, addTile));
            });

            root.children.push($.extend({}, addTile));
        }

        function update(source, firstRun) {
            firstRun = firstRun || false;

            // Compute the new height, function counts total children of root node and sets tree height accordingly.
            // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
            // This makes the layout more consistent.
            var levelWidth = [1];
            var childCount = function (level, n) {

                if (n.children && n.children.length > 0) {
                    if (levelWidth.length <= level + 1) levelWidth.push(0);

                    levelWidth[level + 1] += n.children.length;
                    n.children.forEach(function (d) {
                        childCount(level + 1, d);
                    });
                }
            };
            childCount(0, root);
            var newHeight = d3.max(levelWidth) * 10; // 10 pixels per line
            tree = tree.size([newHeight, viewerWidth]);

            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);
            // Set widths between levels based on tile size.
            nodes.forEach(function (d) {
                d.y = (d.depth * tileHeight * 2);
                d.x = d.x * tileWidth / 6;
            });

            // Update the nodes…
            var node = svgGroup.selectAll("g.node")
                .data(nodes, function (d) {
                    return d.id || (d.id = ++i);
                });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .call(dragListener)
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + (source.x0 - tileWidth / 2) + "," + source.y0 + ")";
                })
                .on('click', click);

            var rect = nodeEnter.append("rect")
                .attr('class', 'nodeCircle')
                .attr("width", tileWidth)
                //.attr("y",-100)
                .attr("height", tileHeight)
                .attr('pointer-events', 'mouseover')
                .style("fill", "#fff")
                .on("mouseover", function (node) {
                    overCircle(node);
                })
                .on("mouseout", function (node) {
                    outCircle(node);
                });

            nodeEnter.append('text')
                .attr('class', 'nodeText')
                .attr('x', 5)
                .attr('y', 110)
                .attr('text-anchor', 'start')
                .text(function (d) {
                    if (d.name.length > 15) {
                        return d.name.slice(0, 15) + '...';
                    }
                    return d.name;
                });

            nodeEnter.append('image')
                .attr('xlink:href', function (d) {
                    return (d.meta && d.meta.img) ? d.meta.img : null;
                })
                .attr('x', 5)
                .attr('y', 5)
                .attr('width', tileImageWidth)
                .attr('height', tileImageHeight);

            /*nodeEnter.append("text")
             .attr("x", function (d) {
             return d.children || d._children ? -10 : 10;
             })
             .attr("dy", ".35em")
             .attr('class', 'nodeText')
             .attr("text-anchor", function (d) {
             return d.children || d._children ? "end" : "start";
             })
             .text(function (d) {
             return d.name;
             })
             .style("fill-opacity", 0);*/

            // phantom node to give us mouseover in a radius around it
            /*nodeEnter.append("circle")
             .attr('class', 'ghostCircle')
             .attr("r", 30)
             .attr("opacity", 0.2) // change this to zero to hide the target area
             .style("fill", "red")
             .attr('pointer-events', 'mouseover')
             .on("mouseover", function (node) {
             overCircle(node);
             })
             .on("mouseout", function (node) {
             outCircle(node);
             });*/

            // Change the circle fill depending on whether it has children and is collapsed
            /*		node.select("circle.nodeCircle")
             .attr("r", 4.5)
             .style("fill", function (d) {
             return d._children ? "lightsteelblue" : "#fff";
             });*/

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + (d.x - tileWidth / 2)  + "," + d.y + ")";
                });

            // Fade the text in
            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + source.x + "," + source.y + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 0);

            nodeExit.select("text")
                .style("fill-opacity", 0);

            // Update the links…
            var link = svgGroup.selectAll("path.link")
                .data(links, function (d) {
                    return d.target.id;
                });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("x",100)
                .attr("d", function (d) {
                    var o = {
                        x: source.x0,
                        y: source.y0
                    };
                    var o2 = {
                        x: source.x0,
                        y: source.y0
                    };
                    return diagonal({
                        source: o,
                        target: o2
                    });
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function (d) {
                    var o = {
                        x: source.x,
                        y: source.y
                    };

                    return diagonal({
                        source: o,
                        target: o
                    });
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });

            if (firstRun) {
                nodes.forEach(function (d) {
                    if (d.depth === 1) {
                        toggleChildren(d);
                    }
                });
                update(source);
            }
        }

        // Append a group which holds all nodes and which the zoom Listener can act upon.
        var svgGroup = baseSvg.append("g");

        // Define the root
        root = treeData;
        root.x0 = viewerHeight / 2;
        root.y0 = 0;

        // Layout the tree initially and center on the root node.
        addCreationTiles(root);
        update(root, true);
        centerNode(root);
    });
};
