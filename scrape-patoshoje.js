var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var async = require("async");

var site = "http://www.patoshoje.com.br";

function apagarArquivo(nomeArquivo) {
  fs.unlink(nomeArquivo, function(err) {
    if (err) throw err;
  });
}  

function escreve(texto) {
  fs.appendFileSync('patoshoje.txt', texto);
}


request(site, function(error, response, body) {

  var $;
  if(error) {
    console.log("Error: " + error);
  }  

  function inicio() {
    console.time("Execução paralela");
    $ = cheerio.load(body);
    var keywords = "Keywords: " + $('meta[name="keywords"]').attr('content') + "\n";
    var description = "Description: " + $('meta[name="description"]').attr('content');
    //apagarArquivo('patoshoje.txt');
    console.log(site + '\n' + '\n' + "Meta tags" + '\n' + '\n' + keywords + '\n' + description + '\n');
    //escreve(site + '\n' + '\n' + "Meta tags" + '\n' + '\n' + keywords + '\n' + description + '\n' + '\n');
  }

  function destaques(callback) {
    console.log('\n' + "Destaques" + '\n');
    //escreve('\n' + "Destaques" + '\n');
    $('ul.ui-tabs-nav > li.ui-tabs-nav-item').each(function( index ) {
      var titulo = $(this).find('a').attr('title');
      var link = $(this).find('a').attr('onclick');
      link = link.substring(link.indexOf('(')+2, link.lastIndexOf(')')-1);
      resumir(link, titulo);
    })
  };

  function resumir(linkAVerificar, titulo) {
    var resumo;
    request(linkAVerificar, function(error, response, body) {
        if (error) {
          console.log("Error: " + error);
        }
        var $$ = cheerio.load(body);
        $$('section.container-detalhada').each(function(index) {
           resumo = $$(this).find('p.sintese').text().trim();
        });
        console.log('\n' + titulo + '\n' + linkAVerificar + '\n' + resumo + '\n');
        //escreve('\n' + titulo + '\n' + linkAVerificar + '\n' + resumo + '\n');
      });
  }

  function ultimasNoticias(callback) {
    console.log('\n' + "Últimas notícias" + '\n');
    //escreve('\n' + "Últimas notícias" + '\n');
     $('div#box_last_news > div.notice').each(function( index ) {    
        var titulo = $(this).find('a').attr('title');
        var link = $(this).find('a').attr('href');
        link = site + link;
        console.log('\n' + titulo + '\n' + link + '\n');
      });
     callback();
  } 

  async.parallel([
    function(callback) {
      inicio(function() {
        callback();
      });
    },
    function(callback) {
      ultimasNoticias(destaques, function() {
        callback();
      });
    }
  ], function() {
    console.timeEnd("Execução paralela");
  });
});