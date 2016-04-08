var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var site = "http://www.globo.com";

request(site, function(error, response, body) {
  if(error) {
    console.log("Error: " + error);
  }

  var $ = cheerio.load(body);

  $('div#bloco-principal > div.wide').each(function( index ) {
  	console.log($(this).html());
    // var titulo = $(this).find('a').attr('title');
    // var link = $(this).find('a').attr('onclick');
    // link = link.substring(link.indexOf('(')+2, link.lastIndexOf(')')-1);
  });
});