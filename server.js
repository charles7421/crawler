'use strict';
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
const http = require('http');

var date = (new Date()).toJSON();
var SUCCESS = {};
const ERROR = { message: "Não encontrado."};

http.createServer(function (req, res){
	if (req.url === '/api/v1') {
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
		request("http://www.patoshoje.com.br", function(error, response, body) {
			if(error) {
				console.log("Error: " + error);
			}
			//console.log("Status code: " + response.statusCode);

			var $ = cheerio.load(body);
			var i = 0;
			$('ul.ui-tabs-nav > li.ui-tabs-nav-item').each(function( index ) {
				var titulo = $(this).find('a').attr('title');
				var link = $(this).find('a').attr('onclick');
				link = link.substring(link.indexOf('(')+2, link.lastIndexOf(')')-1);
				SUCCESS = {
					nome: "Patos Hoje",
					links: {
						title: titulo,
						link: link
					}
				}
				res.write(JSON.stringify(SUCCESS));

			});
		});
		//res.end();		
	} else {
		res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
		res.write(JSON.stringify(ERROR));
		res.end();
	}
}).listen(3000, function(){
	console.log('Servidor rodando em localhost:3000');
});