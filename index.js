

const fsm = {
  transicao: ["08:00", "12:00", "13:00", "18:00", "22:00"],
  estados: ["acordado", "trabalhando", "descansando", "dormindo"],
  inicial: "acordado",
  atual: "acordado",
  finais: ["acordado"],
  programa: {
    "08:00": {
      acordado: "trabalhando",
      
    },
    "12:00": {
      trabalhando: "descansando",
      
    },
    "13:00": {
     
      descansando: "trabalhando",
    },
    "18:00": {
      trabalhando: "dormindo",
    },
    "22:00": {
      dormindo: "acordado",
     
    },
  },
  transicoesDoEstado(s){
    let eventos = Object.keys(this.programa);
    let transicoes = {};
    eventos.map(ev => {
      if(this.programa[ev][s])
        transicoes[ev]=this.programa[ev][s];
      
    })
    if(!Object.keys(transicoes).length)
      throw new Error("não há transições para este estado na programação da máquina");
    return transicoes;
  },
  validaEstado(s){
    if (!this.estados.find((a) => a == s))
      throw new Error(`Estado ${s} não existe: ${this.estados}`);
  },
  validaPrograma(s){  
    if(!fsm.programa[s]) 
      throw new Error(`símbolo ${s} não existe na programação da máquina`);
  },
  validatransicao(s){
    if (!this.transicao.find((a) => a == s))
      throw new Error(`Símbolo ${s} não existe no transicao ${this.transicao}`);
  },
  passo(s) {
    this.validaPrograma(s);
    this.validatransicao(s);
    let next = this.programa[s][this.atual];
    if (next) {
      console.log(`São ${s}, estava ${this.atual} e agora estou ${next}`);
      this.atual = next;
    } else
      throw new Error(`Estado de saída desconhecido para {${s},${this.atual}}`);
  },
  aceitar(stream) {
    let i = -1;
    while (++i < stream.length) this.passo(stream[i]);
    i = this.finais.length;
    while (i--) if (this.atual == this.finais[i]) return true;
    return false;
  },
};




const http = require('http');

function uso(res,  mimeType, encoding){
  console.log("faltou o input");
    res.setHeader("Content-Type", `${mimeType}; charset=${encoding}`);

  res.end(`
    uso: 
    <p>
        <a href="https://finitestatemachine.herokuapp.com/aceita?08:00,12:00,13:00,18:00,22:00">http://127.0.0.1/aceita?08:00,12:00,13:00,18:00,22:00</a>

    </p>
    <p>
        <a href="https://finitestatemachine.herokuapp.com/passo?08:00 ">http://127.0.0.1/passo?08:00 </a>
    </p>
    <p>
        <a href="https://finitestatemachine.herokuapp.com/passo?12:00 ">http://127.0.0.1/passo?12:00 </a>
    </p>
    <p>
        <a href="https://finitestatemachine.herokuapp.com/passo?18:00 ">http://127.0.0.1/passo?18:00 </a>
    </p>
    <p>
        <a href="https://finitestatemachine.herokuapp.com/passo?22:00 ">http://127.0.0.1/passo?22:00 </a>
    </p>
    <p>
        <a href="https://finitestatemachine.herokuapp.com/atual ">http://127.0.0.1/atual </a>
    </p>

  `);
}

const server = new http.createServer((req,res)=>{
	const url = req.url
	if(url == "/favicon.ico") return res.end("")
	const path = req.url.split("?")
	const operacao = path[0]
	console.log(operacao)
	if(operacao){
    try {
      switch(operacao) {
        case "/aceita":
          const stream = path[1].split(",");
          console.log(stream);
          res.end(fsm.aceitar(stream) ? "input aceito" : "input não aceito");
        break;
        case "/passo":
          const anterior = fsm.atual;
          const evento = path[1];
          fsm.passo(path[1]);
          const atual = fsm.atual;
          res.end(JSON.stringify({anterior, evento, atual}));
          console.log(fsm);
        break;
        case "/atual":
          res.end(JSON.stringify(fsm));
        break;
        default:
               return uso(res, "text/html", "utf-8");
        break;
      }
    }catch(e){
      res.end(e.message);
    }
	} else {
		uso(res);
	}
})

server.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port);
});
