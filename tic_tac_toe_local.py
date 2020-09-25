# Trabalho de Redes ERE 2020
# Jogo da Velha 

from tkinter import *
from tkinter import messagebox

janela = Tk()
janela.title('Jogo da Velha')

# Variáveis Globais
clicou = True
contador = 0
vencedor = False
nome_ganhador = " "

# Desabilitando Botões
def desabilitar_botoes():
	botao_1.config(state=DISABLED)
	botao_2.config(state=DISABLED)
	botao_3.config(state=DISABLED)
	botao_4.config(state=DISABLED)
	botao_5.config(state=DISABLED)
	botao_6.config(state=DISABLED)
	botao_7.config(state=DISABLED)
	botao_8.config(state=DISABLED)
	botao_9.config(state=DISABLED)

# Checando a vitoria de X ou Y
def checar_vitoria():
	global vencedor

	linha()
	coluna()
	diagonal()

	# Ver se empatou
	if contador == 9 and vencedor == False:
		messagebox.showinfo("Jogo da Velha", "Empatou!")
		desabilitar_botoes()

	#print(contador)

# Checando se alguém ganhou nas linhas
def linha():
	global vencedor, nome_ganhador
	linha_1 = botao_1["text"] == botao_2["text"] == botao_3["text"] != " "
	linha_2 = botao_4["text"] == botao_5["text"] == botao_6["text"] != " "
	linha_3 = botao_7["text"] == botao_8["text"] == botao_9["text"] != " "
	# Retorna o vencedor (X ou O)
	if linha_1:
		botao_1.config(bg="green")
		botao_2.config(bg="green")
		botao_3.config(bg="green")
		vencedor = True
		nome_ganhador = botao_1["text"]
		messagebox.showinfo("Jogo da Velha", "Parabéns!\n" + nome_ganhador + " ganhou")	
		desabilitar_botoes()
	elif linha_2:
		botao_4.config(bg="green")
		botao_5.config(bg="green")
		botao_6.config(bg="green")
		vencedor = True
		nome_ganhador = botao_4["text"]
		messagebox.showinfo("Jogo da Velha", "Parabéns!\n" + nome_ganhador + " ganhou")	
		desabilitar_botoes()
	elif linha_3:
		botao_7.config(bg="green")
		botao_8.config(bg="green")
		botao_9.config(bg="green")
		vencedor = True
		nome_ganhador = botao_7["text"]
		messagebox.showinfo("Jogo da Velha", "Parabéns!\n" + nome_ganhador + " ganhou")	
		desabilitar_botoes()
	return

# Checando se alguém ganhou nas colunas
def coluna():
	global vencedor, nome_ganhador
	coluna_1 = botao_1["text"] == botao_4["text"] == botao_7["text"] != " "
	coluna_2 = botao_2["text"] == botao_5["text"] == botao_8["text"] != " "
	coluna_3 = botao_3["text"] == botao_6["text"] == botao_9["text"] != " "
	# Retorna o vencedor (X ou O)
	if coluna_1:
		botao_1.config(bg="green")
		botao_4.config(bg="green")
		botao_7.config(bg="green")
		vencedor = True
		nome_ganhador = botao_1["text"]
		messagebox.showinfo("Jogo da Velha", "Parabéns!\n" + nome_ganhador + " ganhou")
		desabilitar_botoes()
	elif coluna_2:
		botao_2.config(bg="green")
		botao_5.config(bg="green")
		botao_8.config(bg="green")
		vencedor = True
		nome_ganhador = botao_2["text"]
		messagebox.showinfo("Jogo da Velha", "Parabéns!\n" + nome_ganhador + " ganhou")
		desabilitar_botoes()
	elif coluna_3:
		botao_3.config(bg="green")
		botao_6.config(bg="green")
		botao_9.config(bg="green")
		vencedor = True
		nome_ganhador = botao_3["text"]
		messagebox.showinfo("Jogo da Velha", "Parabéns!\n" + nome_ganhador + " ganhou")
		desabilitar_botoes()
	return

# Checando se alguém ganhou nas diagonais
def diagonal():
	global vencedor, nome_ganhador
	diagonal_1 = botao_1["text"] == botao_5["text"] == botao_9["text"] != " "
	diagonal_2 = botao_3["text"] == botao_5["text"] == botao_7["text"] != " "
	# Retorna o vencedor (X ou O)
	if diagonal_1:
		botao_1.config(bg="green")
		botao_5.config(bg="green")
		botao_9.config(bg="green")
		vencedor = True
		nome_ganhador = botao_1["text"]
		messagebox.showinfo("Jogo da Velha", "Parabéns!\n" + nome_ganhador + " ganhou")
		desabilitar_botoes()
	elif diagonal_2:
		botao_3.config(bg="green")
		botao_5.config(bg="green")
		botao_7.config(bg="green")
		vencedor = True
		nome_ganhador = botao_3["text"]
		messagebox.showinfo("Jogo da Velha", "Parabéns!\n" + nome_ganhador + " ganhou")
		desabilitar_botoes()
	return

# Mudança de estado de botões e erros
def b_click(botao):
	global clicou, contador

	if botao["text"] == " " and clicou == True:
		botao["text"] = "X"
		clicou = False
		contador += 1
		checar_vitoria()
	elif botao["text"] == " " and clicou == False:
		botao["text"] = "O"
		clicou = True
		contador += 1
		checar_vitoria()
	else:
		messagebox.showerror("Jogo da Velha", "Esta posição já foi escolhida!\nEscolha outra posição." )

# Resetando o jogo
def resetar():
	global botao_1, botao_2, botao_3, botao_4, botao_5, botao_6, botao_7, botao_8, botao_9
	global clicou, contador
	clicou = True
	contador = 0

	#Constriundo os botões
	botao_1 = Button(janela, text=" ", font=("Helvetica", 20), height=3, width=6, bg="SystemButtonFace", command=lambda: b_click(botao_1))
	botao_2 = Button(janela, text=" ", font=("Helvetica", 20), height=3, width=6, bg="SystemButtonFace", command=lambda: b_click(botao_2))
	botao_3 = Button(janela, text=" ", font=("Helvetica", 20), height=3, width=6, bg="SystemButtonFace", command=lambda: b_click(botao_3))

	botao_4 = Button(janela, text=" ", font=("Helvetica", 20), height=3, width=6, bg="SystemButtonFace", command=lambda: b_click(botao_4))
	botao_5 = Button(janela, text=" ", font=("Helvetica", 20), height=3, width=6, bg="SystemButtonFace", command=lambda: b_click(botao_5))
	botao_6 = Button(janela, text=" ", font=("Helvetica", 20), height=3, width=6, bg="SystemButtonFace", command=lambda: b_click(botao_6))

	botao_7 = Button(janela, text=" ", font=("Helvetica", 20), height=3, width=6, bg="SystemButtonFace", command=lambda: b_click(botao_7))
	botao_8 = Button(janela, text=" ", font=("Helvetica", 20), height=3, width=6, bg="SystemButtonFace", command=lambda: b_click(botao_8))
	botao_9 = Button(janela, text=" ", font=("Helvetica", 20), height=3, width=6, bg="SystemButtonFace", command=lambda: b_click(botao_9))

	# Colocando os botões na tela
	botao_1.grid(row=0, column=0)
	botao_2.grid(row=0, column=1)
	botao_3.grid(row=0, column=2)

	botao_4.grid(row=1, column=0)
	botao_5.grid(row=1, column=1)
	botao_6.grid(row=1, column=2)

	botao_7.grid(row=2, column=0)
	botao_8.grid(row=2, column=1)
	botao_9.grid(row=2, column=2)

# Menu para reiniciar jogo
meu_menu = Menu(janela)
janela.config(menu=meu_menu)

opcoes_menu = Menu(meu_menu, tearoff=False)
meu_menu.add_cascade(label="Opções", menu=opcoes_menu)
opcoes_menu.add_command(label="Reiniciar Jogo", command=resetar)

resetar()
janela.mainloop()


