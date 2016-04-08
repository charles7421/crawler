var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

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
    $ = cheerio.load(body);
    var keywords = "Keywords: " + $('meta[name="keywords"]').attr('content') + "\n";
    var description = "Description: " + $('meta[name="description"]').attr('content');
    apagarArquivo('patoshoje.txt');
    escreve(site + '\n' + '\n' + "Meta tags" + '\n' + '\n' + keywords + '\n' + description + '\n' + '\n');
  }

  function destaques(callback) {
    escreve('\n' + "Destaques" + '\n');
    $('ul.ui-tabs-nav > li.ui-tabs-nav-item').each(function( index ) {
      var titulo = $(this).find('a').attr('title');
      var link = $(this).find('a').attr('onclick');
      var resumo;
      link = link.substring(link.indexOf('(')+2, link.lastIndexOf(')')-1);

      request(link, function(error, response, body) {
        if (error) {
          console.log("Error: " + error);
        }
        var $$ = cheerio.load(body);
        $$('section.container-detalhada').each(function(index) {
           resumo = $$(this).find('p.sintese').text().trim();
        });
        escreve('\n' + titulo + '\n' + link + '\n' + resumo + '\n');
      });
    })
    callback();
  };

  function ultimasNoticias() {
    escreve('\n' + "Últimas notícias" + '\n');
     $('div#box_last_news > div.notice').each(function( index ) {    
        var titulo = $(this).find('a').attr('title');
        var link = $(this).find('a').attr('href');
        link = site + link;
        escreve('\n' + titulo + '\n' + link + '\n');
      });
  } 

  inicio();
  destaques((ultimasNoticias) => {
      console.log('Arquivo patoshoje.txt criado.');
  });
  
});