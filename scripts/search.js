var articles = [

    {
        "id": "522590",
        "type": "Character",
        "img": "http://img2.wikia.nocookie.net/__cb20140801190734/marveldatabase/images/thumb/9/9c/Thanos_%28Earth-199999%29_004.jpg/200px-0%2C528%2C0%2C528-Thanos_%28Earth-199999%29_004.jpg",
        "title": "Thanos"
    },
    {
        "id": "714606",
        "type": "Character",
        "img": "http://img2.wikia.nocookie.net/__cb20140803101249/marveldatabase/images/thumb/8/8d/Nebula_%28Earth-199999%29.jpg/200px-0%2C1714%2C0%2C1714-Nebula_%28Earth-199999%29.jpg",
        "title": "Nebula"
    },
    {
        "id": "2122999",
        "type": "Person",
        "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Jim_Starlin_2008.jpg/230px-Jim_Starlin_2008.jpg",
        "title": "Jimm Starlin"
    },
    {
        "id": "7152",
        "type": "Person",
        "img": "images/zoe.jpg",
        "title": "Zoe Saldana"
    },
    {
        "id": "672121",
        "type": "Character",
        "img": "http://img3.wikia.nocookie.net/__cb20140803132945/marveldatabase/images/thumb/1/1b/Taneleer_Tivan_%28Earth-199999%29_003.jpg/200px-0%2C300%2C0%2C300-Taneleer_Tivan_%28Earth-199999%29_003.jpg",
        "title": "The Collector"
    },
    {
        "id": "31560",
        "type": "Weapon",
        "img": "http://img2.wikia.nocookie.net/__cb20071102223816/marveldatabase/images/thumb/9/93/Godslayer.jpg/200px-0%2C320%2C0%2C320-Godslayer.jpg",
        "title": "Godslayer"
    },
    {
        "id": "309275",
        "type": "Movie",
        "img": "http://img3.wikia.nocookie.net/__cb20100207013534/marveldatabase/images/thumb/b/b4/Planet_Hulk_%28film%29.jpg/200px-0%2C853%2C0%2C853-Planet_Hulk_%28film%29.jpg",
        "title": "Planet_Hulk"
    }

]

function format(x) {
    return "<table><tr><td><img style='width:80px;height:80px' src='" + x.item.img + "'/></td><td><b>" + x.text + "</b><br/><br/> <i>" + x.item.type + "</i></td></tr></table>"
}

function initSearch(parentNode, callback) {
    var searchModal = $('#searchModal'),
        searchSelect = $("#searchSelect");
    searchModal.reveal();

    searchSelect.select2({
        minimumInputLength: 1,
        query: function (query) {
            var data = {results: []}, i;
            for (var k in articles) {
                var item = articles[k];
                if (item.title.toLowerCase().indexOf(query.term.toLowerCase()) > -1) {
                    data.results.push({id: query.term + i, text: item.title, item: item});
                }
            }
            query.callback(data);
        },
        formatResult: format,
        formatSelection: format,

        escapeMarkup: function (m) {
            return m;
        }
    }).on("select2-selecting", function (x) {
        x.preventDefault();
        var obj = x.object.item;
        var newNode = {
            name: obj.title,
            meta: {
                type: '',
                id: obj.id,
                img: obj.img
            }
        };
        parentNode.children.unshift(newNode);

        searchSelect.select2("close");
        searchModal.trigger('reveal:close');
        searchSelect.off('select2-selecting');
        callback(newNode);
    });
}

function initRelation(parentNode, callback) {
    var relationModal = $('#relationModal');
    relationModal.reveal();

    relationModal.find('#relationSelect').on('change', function () {
        var newNode = {
            name: 'Family',
            meta: {
                isType: true,
                locked: true,
                img: 'images/family.png'
            },
            children: [{
                name: 'Add',
                meta: {
                    add: true,
                    locked: true,
                    img: 'images/create.png'
                }
            }]
        };
        parentNode.children.unshift(newNode);
        callback(newNode);
        relationModal.trigger('reveal:close');
    });
}