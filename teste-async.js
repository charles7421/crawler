"use strict";
class Usuario {
    retornarDadosUsuario(callback) {
        setTimeout(() => {
            return callback({ nome: "Erick Wendel" });
        });
    }
}
let usuario = new Usuario().retornarDadosUsuario((resultado) => {
console.log(resultado);
});
