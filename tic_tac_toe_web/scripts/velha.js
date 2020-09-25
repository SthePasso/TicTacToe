
var jogador = '_';
var vencedor = '_';
var finish;
const pos = document.getElementsByTagName('input');
const reset = document.getElementById('reiniciar');
const cuur_jogador = document.getElementById('jogador');



for(var i=0;i<9;i++) {
	pos[i].addEventListener('click', (event) => {
		if( (event.target.value=='_') && (vencedor=='_')) {
			event.target.value=jogador;
			event.target.style.color='#000000';

			trocarJogador();
			vencedor = vitoria();
		}
	});
}

reset.addEventListener('click', (event) => {
	for(var i=0;i<9;i++) {
		pos[i].value='_';
		pos[i].style.color='white';
		pos[i].style.backgroundColor='white';
	}

	vencedor = '_';

	sortearJogador();
});

var sortearJogador = function() {
	if(Math.floor(Math.random() * 2)==0) {
		jogador = "O";
		cuur_jogador.innerText="O";
		cuur_jogador.style.color='#ffffff';
	}else{
		jogador = "X";
		cuur_jogador.innerText="X";
		cuur_jogador.style.color='#ffffff';
	}
}

sortearJogador();

var trocarJogador = function() {
	if(jogador=='X') {
		jogador='O';
		cuur_jogador.innerText='O';
		cuur_jogador.style.color='#ffffff';
		
	}else{
		jogador='X';
		cuur_jogador.innerText='X';
		cuur_jogador.style.color='#ffffff';
	}
}

var vitoria = function() {
	if((pos[0].value==pos[1].value) && (pos[1].value==pos[2].value) && pos[0].value!='_' ) {
		pos[0].style.backgroundColor='#0F0';
		pos[1].style.backgroundColor='#0F0';
		pos[2].style.backgroundColor='#0F0';
    trocarJogador();
    	cuur_jogador.style.color='#0F0';


		return pos[0].value;
		
	}else if((pos[3].value==pos[4].value) && (pos[4].value==pos[5].value) && pos[3].value!='_' ) {
		pos[3].style.backgroundColor='#0F0';
		pos[4].style.backgroundColor='#0F0';
		pos[5].style.backgroundColor='#0F0';
    trocarJogador();
    
    	cuur_jogador.style.color='#0F0';

		return pos[3].value;

	}else if((pos[6].value==pos[7].value) && (pos[7].value==pos[8].value) && pos[6].value!='_' ) {
		pos[6].style.backgroundColor='#0F0';
		pos[7].style.backgroundColor='#0F0';
		pos[8].style.backgroundColor='#0F0';
    trocarJogador();
    	cuur_jogador.style.color='#0F0';
		return pos[6].value;

	}else if((pos[0].value==pos[3].value) && (pos[3].value==pos[6].value) && pos[0].value!='_' ) {
		pos[0].style.backgroundColor='#0F0';
		pos[3].style.backgroundColor='#0F0';
		pos[6].style.backgroundColor='#0F0';
    trocarJogador();
    	cuur_jogador.style.color='#0F0';
 
		return pos[0].value;
	
	}else if((pos[1].value==pos[4].value) && (pos[4].value==pos[7].value) && pos[1].value!='_' ) {
		pos[1].style.backgroundColor='#0F0';
		pos[4].style.backgroundColor='#0F0';
		pos[7].style.backgroundColor='#0F0';
    trocarJogador();
    	cuur_jogador.style.color='#0F0';
   

		return pos[1].value;

	}else if((pos[2].value==pos[5].value) && (pos[5].value==pos[8].value) && pos[2].value!='_' ) {
		pos[2].style.backgroundColor='#0F0';
		pos[5].style.backgroundColor='#0F0';
		pos[8].style.backgroundColor='#0F0';
    trocarJogador();
    	cuur_jogador.style.color='#0F0';
   
		return pos[2].value;
	}else if((pos[0].value==pos[4].value) && (pos[4].value==pos[8].value) && pos[0].value!='_' ) {
		pos[0].style.backgroundColor='#0F0';
		pos[4].style.backgroundColor='#0F0';
		pos[8].style.backgroundColor='#0F0';
    trocarJogador();
    cuur_jogador.style.color='#0F0';

		return pos[0].value;

	}else if((pos[2].value==pos[4].value) && (pos[4].value==pos[6].value) && pos[2].value!='_' ) {
		pos[2].style.backgroundColor='#0F0';
		pos[4].style.backgroundColor='#0F0';
		pos[6].style.backgroundColor='#0F0';
    trocarJogador();
    cuur_jogador.style.color='#0F0';

		return pos[2].value;
	}
	
								
    return '_';
}
